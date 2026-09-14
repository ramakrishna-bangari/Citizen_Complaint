package com.wcop.service.impl;

import com.wcop.ai.GeminiRequest;
import com.wcop.ai.GeminiResponse;
import com.wcop.dto.request.CreateComplaintRequest;
import com.wcop.dto.request.RejectComplaintRequest;
import com.wcop.dto.request.UpdateComplaintStatusRequest;
import com.wcop.dto.response.ComplaintResponse;
import com.wcop.dto.response.ComplaintStatusHistoryResponse;
import com.wcop.entity.*;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.mapper.ComplaintMapper;
import com.wcop.repository.*;
import com.wcop.service.AIService;
import com.wcop.service.ComplaintService;
import com.wcop.service.DuplicateDetectionService;
import com.wcop.service.IncidentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository complaintStatusHistoryRepository;
    private final DepartmentRepository departmentRepository;
    private final DistrictRepository districtRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final AIService aiService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final IncidentService incidentService;

    // CREATE COMPLAINT
    @Override
    public ComplaintResponse createComplaint(CreateComplaintRequest request) {

        User user = getCurrentUser();
        validateRole(user, "CITIZEN", "Only citizens can create complaints.");

        // GEMINI
        GeminiRequest geminiRequest = GeminiRequest.builder().title(request.getTitle()).description(request.getDescription()).build();
        GeminiResponse geminiResponse = aiService.classifyComplaint(geminiRequest);

        if (geminiResponse == null || geminiResponse.getValid() == null) {
            throw new InvalidRequestException("AI returned an invalid classification response.");
        }

        // AI REJECTED
        if (!geminiResponse.getValid()) {
            return createAiRejectedComplaint(request, user, geminiResponse);
        }

        // AI CLASSIFICATION
        ClassificationResult classification = extractClassification(geminiResponse);

        // FIND DEPARTMENT
        Department department = departmentRepository.findByDepartmentNameIgnoreCase(classification.departmentName().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + classification.departmentName()));

        // FIND DISTRICT
        District district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District not found."));

        if (!Boolean.TRUE.equals(department.getActive())) {
            throw new InvalidRequestException("Department is inactive.");
        }

        if (!Boolean.TRUE.equals(district.getActive())) {
            throw new InvalidRequestException("District is inactive.");
        }

        // DUPLICATE DETECTION
        Complaint duplicate = duplicateDetectionService.findDuplicate(district, department, classification.problemType(), request.getLatitude(), request.getLongitude(), request.getDescription());

        Incident incident;

        if (duplicate != null) {
            // EXISTING INCIDENT
            incident = duplicate.getIncident();

            if (incident == null) {
                throw new InvalidRequestException("Duplicate complaint is not linked to an incident.");
            }

            // If an old incident exists but has no officer, automatically assign it now.
            if (incident.getAssignedOfficer() == null) {
                incidentService.autoAssignIncident(incident);
            }

        } else {
            // NEW INCIDENT
            incident = Incident.builder().title(request.getTitle()).description(request.getDescription()).imageUrl(request.getImageUrl()).latitude(request.getLatitude()).longitude(request.getLongitude()).department(department).district(district).status("OPEN").assignmentSource("NONE").build();

            incident = incidentRepository.save(incident);

            /*
             * Gemini gave the department, citizen gave the district.
             * IncidentService now finds a matching active officer for
             * this department + district and assigns them.
             */
            incidentService.autoAssignIncident(incident);
        }

        // CREATE COMPLAINT
        Complaint complaint = Complaint.builder().title(request.getTitle()).description(request.getDescription()).location(request.getLocation()).imageUrl(request.getImageUrl()).latitude(request.getLatitude()).longitude(request.getLongitude()).priority(classification.priority().trim().toUpperCase()).problemType(classification.problemType().trim()).user(user).district(district).department(department).incident(incident).status(incident.getAssignedOfficer() != null ? "ASSIGNED" : "PENDING").assignedOfficer(incident.getAssignedOfficer()).build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        // COMPLAINT HISTORY
        String complaintStatus = incident.getAssignedOfficer() != null ? "ASSIGNED" : "PENDING";

        ComplaintStatusHistory history = ComplaintStatusHistory.builder().complaint(savedComplaint).status(complaintStatus).remarks("ASSIGNED".equals(complaintStatus) ? "Complaint automatically assigned through incident." : "Complaint submitted. No matching officer available.").updatedBy(user).build();

        complaintStatusHistoryRepository.save(history);

        log.info("Complaint created: complaintId={}, incidentId={}, department={}, district={}, officerId={}, status={}",
                savedComplaint.getId(),
                incident.getId(),
                department.getDepartmentName(),
                district.getDistrictName(),
                incident.getAssignedOfficer() != null ? incident.getAssignedOfficer().getId() : "NOT ASSIGNED",
                complaintStatus);

        return ComplaintMapper.toComplaintResponse(savedComplaint);
    }


    // EXTRACTED: reads and validates the AI classification result
    private ClassificationResult extractClassification(GeminiResponse geminiResponse) {

        String departmentName = geminiResponse.getDepartment();
        String priority = geminiResponse.getPriority();
        String problemType = geminiResponse.getProblemType();

        if (departmentName == null || departmentName.isBlank()) {
            throw new InvalidRequestException("AI could not determine the department.");
        }

        if (priority == null || priority.isBlank()) {
            throw new InvalidRequestException("AI could not determine the priority.");
        }

        if (problemType == null || problemType.isBlank()) {
            throw new InvalidRequestException("AI could not determine the problem type.");
        }

        return new ClassificationResult(departmentName, priority, problemType);
    }

    // Small holder for the 3 AI classification values, used only inside this class
    private record ClassificationResult(String departmentName, String priority, String problemType) {
    }


    // AI REJECTED COMPLAINT
    private ComplaintResponse createAiRejectedComplaint(CreateComplaintRequest request, User user, GeminiResponse geminiResponse) {

        District district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District not found."));

        if (!Boolean.TRUE.equals(district.getActive())) {
            throw new InvalidRequestException("District is inactive.");
        }

        Complaint complaint = Complaint.builder().title(request.getTitle()).description(request.getDescription()).location(request.getLocation()).imageUrl(request.getImageUrl()).latitude(request.getLatitude()).longitude(request.getLongitude()).priority(geminiResponse.getPriority()).problemType(geminiResponse.getProblemType()).status("REJECTED").user(user).district(district).department(null).incident(null).assignedOfficer(null).rejectionReason(ComplaintRejectionReason.INVALID_COMPLAINT).rejectionNote("The submitted content does not describe a valid public-service complaint.").rejectedBy(null).rejectedAt(LocalDateTime.now()).build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        ComplaintStatusHistory history = ComplaintStatusHistory.builder().complaint(savedComplaint).status("REJECTED").remarks("Complaint automatically rejected during AI validation.").updatedBy(user).build();

        complaintStatusHistoryRepository.save(history);

        return ComplaintMapper.toComplaintResponse(savedComplaint);
    }


    // ADMIN - ALL
    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "ADMIN", "Only administrators can view all complaints.");

        return complaintRepository.findAll().stream().map(ComplaintMapper::toComplaintResponse).toList();
    }


    // ADMIN - PAGINATION
    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getComplaints(int page, int size, String status, String priority) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "ADMIN", "Only administrators can view all complaints.");
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);

        boolean hasStatus = status != null && !status.isBlank();
        boolean hasPriority = priority != null && !priority.isBlank();

        Page<Complaint> complaints;

        if (hasStatus && hasPriority) {
            complaints = complaintRepository.findByStatusAndPriority(status.trim().toUpperCase(), priority.trim().toUpperCase(), pageable);
        } else if (hasStatus) {
            complaints = complaintRepository.findByStatus(status.trim().toUpperCase(), pageable);
        } else if (hasPriority) {
            complaints = complaintRepository.findByPriority(priority.trim().toUpperCase(), pageable);
        } else {
            complaints = complaintRepository.findAll(pageable);
        }

        return complaints.map(ComplaintMapper::toComplaintResponse);
    }


    // CITIZEN - MY COMPLAINTS
    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints() {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "CITIZEN", "Only citizens can view their complaints.");

        return complaintRepository.findByUser(currentUser).stream().map(ComplaintMapper::toComplaintResponse).toList();
    }


    // OFFICER - ALL ASSIGNED COMPLAINTS
    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getOfficerComplaints() {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can view assigned complaints.");

        return complaintRepository.findByAssignedOfficer(currentUser).stream().map(ComplaintMapper::toComplaintResponse).toList();
    }


    // OFFICER - PAGINATED
    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getOfficerComplaints(int page, int size, String status, String priority) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can view assigned complaints.");
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);

        boolean hasStatus = status != null && !status.isBlank();
        boolean hasPriority = priority != null && !priority.isBlank();

        Page<Complaint> complaints;

        if (hasStatus && hasPriority) {
            complaints = complaintRepository.findByAssignedOfficerAndStatusAndPriority(currentUser, status.trim().toUpperCase(), priority.trim().toUpperCase(), pageable);
        } else if (hasStatus) {
            complaints = complaintRepository.findByAssignedOfficerAndStatus(currentUser, status.trim().toUpperCase(), pageable);
        } else if (hasPriority) {
            complaints = complaintRepository.findByAssignedOfficerAndPriority(currentUser, priority.trim().toUpperCase(), pageable);
        } else {
            complaints = complaintRepository.findByAssignedOfficer(currentUser, pageable);
        }

        return complaints.map(ComplaintMapper::toComplaintResponse);
    }


    // OFFICER - GET ONE
    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getOfficerComplaint(Long complaintId) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can view assigned complaints.");

        Complaint complaint = findComplaint(complaintId);
        validateOfficerComplaintAccess(currentUser, complaint);

        return ComplaintMapper.toComplaintResponse(complaint);
    }


    // GET BY ID
    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long complaintId) {

        User currentUser = getCurrentUser();
        Complaint complaint = findComplaint(complaintId);
        validateComplaintAccess(currentUser, complaint);

        return ComplaintMapper.toComplaintResponse(complaint);
    }


    // UPDATE STATUS
    @Override
    public ComplaintResponse updateComplaintStatus(Long complaintId, UpdateComplaintStatusRequest request) {

        User currentUser = getCurrentUser();
        Complaint complaint = findComplaint(complaintId);
        String role = getRole(currentUser);


        if (!"ADMIN".equals(role)) {
            if ("OFFICER".equals(role)) {
                validateOfficerComplaintAccess(currentUser, complaint);
            } else {
                throw new InvalidRequestException("You are not authorized to update complaint status.");
            }
        }

        String newStatus = validateAndNormalizeStatus(request, complaint.getStatus());

        complaint.setStatus(newStatus);

        Complaint savedComplaint = complaintRepository.save(complaint);

        ComplaintStatusHistory history = ComplaintStatusHistory.builder().complaint(savedComplaint).status(newStatus).remarks(request.getRemarks()).updatedBy(currentUser).build();

        complaintStatusHistoryRepository.save(history);

        return ComplaintMapper.toComplaintResponse(savedComplaint);
    }

    // EXTRACTED: validates the incoming status request and returns the normalized new status
    private String validateAndNormalizeStatus(UpdateComplaintStatusRequest request, String currentStatus) {

        if (request == null || request.getStatus() == null || request.getStatus().isBlank()) {
            throw new InvalidRequestException("Complaint status is required.");
        }

        String newStatus = request.getStatus().trim().toUpperCase();

        if ("REJECTED".equals(newStatus)) {
            throw new InvalidRequestException("Use the reject complaint operation.");
        }

        if (!List.of("PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED").contains(newStatus)) {
            throw new InvalidRequestException("Invalid complaint status.");
        }

        if (currentStatus != null && currentStatus.equals(newStatus)) {
            throw new InvalidRequestException("Complaint is already in " + newStatus + " status.");
        }

        return newStatus;
    }


    // OFFICER - UPDATE STATUS
    @Override
    public ComplaintResponse updateOfficerComplaintStatus(Long complaintId, UpdateComplaintStatusRequest request) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can update assigned complaints.");

        Complaint complaint = findComplaint(complaintId);
        validateOfficerComplaintAccess(currentUser, complaint);

        return updateComplaintStatus(complaintId, request);
    }


    // REJECT
    @Override
    public ComplaintResponse rejectComplaint(Long complaintId, RejectComplaintRequest request) {

        User currentUser = getCurrentUser();
        Complaint complaint = findComplaint(complaintId);
        String role = getRole(currentUser);
        if (!"ADMIN".equals(role)) {
            if ("OFFICER".equals(role)) {
                validateOfficerComplaintAccess(currentUser, complaint);
            } else {
                throw new InvalidRequestException("Only officers or administrators can reject complaints.");
            }
        }

        if ("REJECTED".equals(complaint.getStatus())) {
            throw new InvalidRequestException("Complaint is already rejected.");
        }

        if ("RESOLVED".equals(complaint.getStatus())) {
            throw new InvalidRequestException("A resolved complaint cannot be rejected.");
        }

        if (request == null || request.getReason() == null) {
            throw new InvalidRequestException("Rejection reason is required.");
        }

        if (request.getNote() == null || request.getNote().isBlank()) {
            throw new InvalidRequestException("Rejection note is required.");
        }

        complaint.setStatus("REJECTED");
        complaint.setRejectionReason(request.getReason());
        complaint.setRejectionNote(request.getNote().trim());
        complaint.setRejectedBy(currentUser);
        complaint.setRejectedAt(LocalDateTime.now());

        Complaint savedComplaint = complaintRepository.save(complaint);

        ComplaintStatusHistory history = ComplaintStatusHistory.builder().complaint(savedComplaint).status("REJECTED").remarks(request.getNote().trim()).updatedBy(currentUser).build();

        complaintStatusHistoryRepository.save(history);

        return ComplaintMapper.toComplaintResponse(savedComplaint);
    }


    // OFFICER - REJECT
    @Override
    public ComplaintResponse rejectOfficerComplaint(Long complaintId, RejectComplaintRequest request) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can reject assigned complaints.");

        Complaint complaint = findComplaint(complaintId);
        validateOfficerComplaintAccess(currentUser, complaint);

        return rejectComplaint(complaintId, request);
    }


    // HISTORY
    @Override
    @Transactional(readOnly = true)
    public List<ComplaintStatusHistoryResponse> getComplaintHistory(Long complaintId) {

        User currentUser = getCurrentUser();
        Complaint complaint = findComplaint(complaintId);
        validateComplaintAccess(currentUser, complaint);

        return complaintStatusHistoryRepository.findByComplaintOrderByUpdatedAtAsc(complaint).stream()
                .map(history -> ComplaintStatusHistoryResponse.builder()
                        .status(history.getStatus())
                        .remarks(history.getRemarks())
                        .updatedBy(history.getUpdatedBy() != null ? history.getUpdatedBy().getFirstName() : null)
                        .updatedAt(history.getUpdatedAt())
                        .build())
                .toList();
    }


    // FIND COMPLAINT
    private Complaint findComplaint(Long complaintId) {

        if (complaintId == null) {
            throw new InvalidRequestException("Complaint ID is required.");
        }

        return complaintRepository.findById(complaintId).orElseThrow(() -> new ResourceNotFoundException("Complaint not found."));
    }


    // COMPLAINT ACCESS
    private void validateComplaintAccess(User user, Complaint complaint) {

        String role = getRole(user);
        if ("ADMIN".equals(role)) {
            return;
        }

        if ("CITIZEN".equals(role)) {
            if (complaint.getUser() == null || !complaint.getUser().getId().equals(user.getId())) {
                throw new InvalidRequestException("You are not authorized to view this complaint.");
            }
            return;
        }

        if ("OFFICER".equals(role)) {
            validateOfficerComplaintAccess(user, complaint);
            return;
        }

        throw new InvalidRequestException("You are not authorized to view this complaint.");
    }


    // OFFICER ACCESS
    private void validateOfficerComplaintAccess(User officer, Complaint complaint) {

        if (complaint.getAssignedOfficer() == null) {
            throw new InvalidRequestException("This complaint is not assigned to an officer.");
        }

        if (!complaint.getAssignedOfficer().getId().equals(officer.getId())) {
            throw new InvalidRequestException("You are not authorized to access this complaint.");
        }
    }

    // ROLE
    private String getRole(User user) {

        if (user == null || user.getRole() == null || user.getRole().getRoleName() == null) {
            throw new InvalidRequestException("User role is not available.");
        }
        String role = user.getRole().getRoleName().trim().toUpperCase();
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        return role;
    }


    // ROLE VALIDATION
    private void validateRole(User user, String expectedRole, String message) {

        if (!expectedRole.equals(getRole(user))) {
            throw new InvalidRequestException(message);
        }
    }

    // PAGINATION
    private void validatePagination(int page, int size) {

        if (page < 0) {
            throw new InvalidRequestException("Page number cannot be negative.");
        }

        if (size <= 0 || size > 100) {
            throw new InvalidRequestException("Page size must be between 1 and 100.");
        }
    }


    // CURRENT USER
    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidRequestException("User is not authenticated.");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User authenticatedUser)) {
            throw new InvalidRequestException("Unable to identify authenticated user.");
        }

        return userRepository.findById(authenticatedUser.getId()).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }
}