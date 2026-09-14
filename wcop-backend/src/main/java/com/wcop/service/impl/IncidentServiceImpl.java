package com.wcop.service.impl;

import com.wcop.dto.request.AssignIncidentRequest;
import com.wcop.dto.request.UpdateIncidentStatusRequest;
import com.wcop.dto.response.IncidentResponse;
import com.wcop.dto.response.IncidentStatusHistoryResponse;
import com.wcop.entity.*;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.mapper.IncidentMapper;
import com.wcop.repository.*;
import com.wcop.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;

    private final IncidentStatusHistoryRepository incidentStatusHistoryRepository;

    private final ComplaintRepository complaintRepository;

    private final ComplaintStatusHistoryRepository complaintStatusHistoryRepository;

    private final StaffProfileRepository staffProfileRepository;

    private final UserRepository userRepository;

    // GET INCIDENT BY ID
    @Override
    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(Long incidentId) {

        Incident incident = findIncident(incidentId);

        User currentUser = getCurrentUser();

        String role = getRole(currentUser);

        if ("ADMIN".equals(role)) {
            return IncidentMapper.toIncidentResponse(incident);
        }

        if ("OFFICER".equals(role)) {

            validateOfficerIncidentAccess(currentUser, incident);

            return IncidentMapper.toIncidentResponse(incident);
        }

        throw new InvalidRequestException("You are not authorized to view this incident.");
    }


    // ADMIN - ALL INCIDENTS

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getAllIncidents() {

        User currentUser = getCurrentUser();

        validateRole(currentUser, "ADMIN", "Only administrators can view all incidents.");

        return incidentRepository.findAll().stream().map(IncidentMapper::toIncidentResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IncidentResponse> getIncidents(int page, int size, String status, Long departmentId, Long districtId) {

        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        User currentUser = getCurrentUser();

        String role = getRole(currentUser);


        if ("ADMIN".equals(role)) {

            Page<Incident> incidents;

            boolean hasStatus = status != null && !status.isBlank();

            boolean hasDepartment = departmentId != null;

            boolean hasDistrict = districtId != null;


            if (hasStatus && hasDepartment && hasDistrict) {

                incidents = incidentRepository.findByStatusAndDepartmentIdAndDistrictId(normalize(status), departmentId, districtId, pageable);

            } else if (hasStatus && hasDepartment) {

                incidents = incidentRepository.findByStatusAndDepartmentId(normalize(status), departmentId, pageable);

            } else if (hasStatus && hasDistrict) {

                incidents = incidentRepository.findByStatusAndDistrictId(normalize(status), districtId, pageable);

            } else if (hasStatus) {

                incidents = incidentRepository.findByStatus(normalize(status), pageable);

            } else if (hasDepartment && hasDistrict) {

                incidents = incidentRepository.findByDepartmentIdAndDistrictId(departmentId, districtId, pageable);

            } else if (hasDepartment) {

                incidents = incidentRepository.findByDepartmentId(departmentId, pageable);

            } else if (hasDistrict) {

                incidents = incidentRepository.findByDistrictId(districtId, pageable);

            } else {

                incidents = incidentRepository.findAll(pageable);
            }


            return incidents.map(IncidentMapper::toIncidentResponse);
        }

        if ("OFFICER".equals(role)) {

            return getOfficerIncidents(page, size, status, departmentId, districtId);
        }
        throw new InvalidRequestException("You are not authorized to view incidents.");
    }


    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getOpenIncidents() {

        User currentUser = getCurrentUser();

        validateRole(currentUser, "ADMIN", "Only administrators can view open incidents.");

        return incidentRepository.findByStatus("OPEN").stream().map(IncidentMapper::toIncidentResponse).toList();
    }


    @Override
    public void autoAssignIncident(Incident incident) {

        if (incident == null) {

            throw new InvalidRequestException("Incident is required.");
        }


        if (incident.getDepartment() == null) {

            incident.setAssignedOfficer(null);
            incident.setStatus("OPEN");

            incidentRepository.save(incident);

            return;
        }

        if (incident.getDistrict() == null) {

            incident.setAssignedOfficer(null);
            incident.setStatus("OPEN");

            incidentRepository.save(incident);

            return;
        }

        Long departmentId = incident.getDepartment().getId();

        Long districtId = incident.getDistrict().getId();


        // FIND MATCHING OFFICERS
        List<StaffProfile> officers = staffProfileRepository.findByDepartmentAndDistrictAndActiveTrue(incident.getDepartment(), incident.getDistrict());

        StaffProfile selectedProfile = null;
        // VALIDATE OFFICERS


        for (StaffProfile profile : officers) {

            if (profile == null) {
                continue;
            }
            if (!Boolean.TRUE.equals(profile.getActive())) {
                continue;
            }

            User officer = profile.getUser();
            if (officer == null) {
                continue;
            }

            if (!Boolean.TRUE.equals(officer.getIsActive())) {
                continue;
            }

            String role = normalizeRole(officer.getRole() != null ? officer.getRole().getRoleName() : null);

            if (!"OFFICER".equals(role)) {
                continue;
            }

            if (profile.getDepartment() == null || profile.getDepartment().getId() == null) {
                continue;
            }

            if (!profile.getDepartment().getId().equals(departmentId)) {
                continue;
            }

            if (profile.getDistrict() == null || profile.getDistrict().getId() == null) {
                continue;
            }

            if (!profile.getDistrict().getId().equals(districtId)) {
                continue;
            }

            selectedProfile = profile;
            break;
        }


        // NO MATCHING OFFICER

        if (selectedProfile == null) {

            incident.setAssignedOfficer(null);
            incident.setStatus("OPEN");
            incidentRepository.save(incident);

            return;
        }

        // ASSIGN

        User officer = selectedProfile.getUser();
        incident.setAssignedOfficer(officer);
        incident.setStatus("ASSIGNED");
        Incident savedIncident = incidentRepository.save(incident);


        // HISTORY
        IncidentStatusHistory history = IncidentStatusHistory.builder().incident(savedIncident).oldStatus("OPEN").newStatus("ASSIGNED").changedBy(null).build();
        incidentStatusHistoryRepository.save(history);

        // SYNCHRONIZE COMPLAINTS
        synchronizeComplaintsWithIncident(savedIncident, "ASSIGNED", null);
    }

    // ADMIN - MANUAL ASSIGN / TRANSFER
    @Override
    public IncidentResponse assignIncident(Long incidentId, AssignIncidentRequest request) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "ADMIN", "Only administrators can assign incidents.");

        if (request == null || request.getOfficerId() == null) {

            throw new InvalidRequestException("Officer ID is required.");
        }

        Incident incident = findIncident(incidentId);
        User officer = userRepository.findById(request.getOfficerId()).orElseThrow(() -> new ResourceNotFoundException("Officer not found."));

        // ROLE

        String officerRole = normalizeRole(officer.getRole() != null ? officer.getRole().getRoleName() : null);

        if (!"OFFICER".equals(officerRole)) {

            throw new InvalidRequestException("Incident can only be assigned to an officer.");
        }

        // USER ACTIVE
        if (!Boolean.TRUE.equals(officer.getIsActive())) {

            throw new InvalidRequestException("Officer is inactive.");
        }


        StaffProfile staffProfile = staffProfileRepository.findByUserId(officer.getId()).orElseThrow(() -> new ResourceNotFoundException("Officer staff profile not found."));

        if (!Boolean.TRUE.equals(staffProfile.getActive())) {

            throw new InvalidRequestException("Officer profile is inactive.");
        }

        if (incident.getDepartment() == null || staffProfile.getDepartment() == null || !staffProfile.getDepartment().getId().equals(incident.getDepartment().getId())) {

            throw new InvalidRequestException("Officer does not belong to the incident department.");
        }


        if (incident.getDistrict() == null || staffProfile.getDistrict() == null || !staffProfile.getDistrict().getId().equals(incident.getDistrict().getId())) {

            throw new InvalidRequestException("Officer does not belong to the incident district.");
        }
        String oldStatus = incident.getStatus();

        incident.setAssignedOfficer(officer);

        if ("OPEN".equals(oldStatus)) {

            incident.setStatus("ASSIGNED");
        }

        Incident savedIncident = incidentRepository.save(incident);


        // HISTORY
        if (!safeEquals(oldStatus, savedIncident.getStatus())) {

            IncidentStatusHistory history = IncidentStatusHistory.builder().incident(savedIncident).oldStatus(oldStatus).newStatus(savedIncident.getStatus()).changedBy(currentUser).build();

            incidentStatusHistoryRepository.save(history);
        }
        // SYNCHRONIZE COMPLAINTS

        synchronizeComplaintsWithIncident(savedIncident, savedIncident.getStatus(), currentUser);
        return IncidentMapper.toIncidentResponse(savedIncident);
    }

    // UPDATE INCIDENT STATUS
    @Override
    public IncidentResponse updateIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request) {

        if (request == null || request.getStatus() == null || request.getStatus().isBlank()) {

            throw new InvalidRequestException("Incident status is required.");
        }

        User currentUser = getCurrentUser();
        String role = getRole(currentUser);
        Incident incident = findIncident(incidentId);
        // OFFICER ACCESS
        if ("OFFICER".equals(role)) {
            validateOfficerIncidentAccess(currentUser, incident);
        }


        if (!"ADMIN".equals(role) && !"OFFICER".equals(role)) {

            throw new InvalidRequestException("You are not authorized to update incidents.");
        }

        String oldStatus = incident.getStatus();
        String newStatus = normalize(request.getStatus());

        if (!List.of("OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED").contains(newStatus)) {
            throw new InvalidRequestException("Invalid incident status.");
        }
        // DUPLICATE

        if (safeEquals(oldStatus, newStatus)) {

            throw new InvalidRequestException("Incident is already in " + newStatus + " status.");
        }

        // UPDATE
        incident.setStatus(newStatus);
        Incident savedIncident = incidentRepository.save(incident);

        IncidentStatusHistory history = IncidentStatusHistory.builder().incident(savedIncident).oldStatus(oldStatus).newStatus(newStatus).changedBy(currentUser).build();
        incidentStatusHistoryRepository.save(history);

        // SYNCHRONIZE COMPLAINTS
        synchronizeComplaintsWithIncident(savedIncident, newStatus, currentUser);
        return IncidentMapper.toIncidentResponse(savedIncident);
    }

    // INCIDENT HISTORY
    @Override
    @Transactional(readOnly = true)
    public List<IncidentStatusHistoryResponse> getIncidentHistory(Long incidentId) {

        Incident incident = findIncident(incidentId);
        User currentUser = getCurrentUser();
        String role = getRole(currentUser);
        // OFFICER CAN ONLY SEE OWN INCIDENT HISTORY
        if ("OFFICER".equals(role)) {
            validateOfficerIncidentAccess(currentUser, incident);

        } else if (!"ADMIN".equals(role)) {

            throw new InvalidRequestException("You are not authorized to view incident history.");
        }

        return incidentStatusHistoryRepository.findByIncidentOrderByChangedAtDesc(incident).stream().map(this::toHistoryResponse).toList();
    }

    // OFFICER - ALL ASSIGNED INCIDENTS
    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getOfficerIncidents() {
        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can view assigned incidents.");

        return incidentRepository.findByAssignedOfficer(currentUser).stream().map(IncidentMapper::toIncidentResponse).toList();
    }

    // OFFICER- PAGINATED
    @Override
    @Transactional(readOnly = true)
    public Page<IncidentResponse> getOfficerIncidents(int page, int size, String status, Long departmentId, Long districtId) {

        validatePagination(page, size);
        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can view assigned incidents.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        boolean hasStatus = status != null && !status.isBlank();
        Page<Incident> incidents;
        if (hasStatus) {
            incidents = incidentRepository.findByAssignedOfficerAndStatus(currentUser, normalize(status), pageable);
        } else {

            incidents = incidentRepository.findByAssignedOfficer(currentUser, pageable);
        }

        if (departmentId == null && districtId == null) {

            return incidents.map(IncidentMapper::toIncidentResponse);
        }

        // FILTER DEPARTMENT / DISTRICT
        List<IncidentResponse> filtered = incidents.getContent().stream().filter(incident -> {
            if (departmentId != null) {
                if (incident.getDepartment() == null || incident.getDepartment().getId() == null || !incident.getDepartment().getId().equals(departmentId)) {
                    return false;
                }
            }

            if (districtId != null) {

                return incident.getDistrict() != null && incident.getDistrict().getId() != null && incident.getDistrict().getId().equals(districtId);
            }


            return true;
        }).map(IncidentMapper::toIncidentResponse).toList();


        return new PageImpl<>(filtered, pageable, filtered.size());
    }

    // OFFICER - GET ONE INCIDENT
    @Override
    @Transactional(readOnly = true)
    public IncidentResponse getOfficerIncident(Long incidentId) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can view assigned incidents.");
        Incident incident = findIncident(incidentId);
        validateOfficerIncidentAccess(currentUser, incident);
        return IncidentMapper.toIncidentResponse(incident);
    }

    // OFFICER - UPDATE OWN INCIDENT
    @Override
    public IncidentResponse updateOfficerIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request) {

        User currentUser = getCurrentUser();
        validateRole(currentUser, "OFFICER", "Only officers can update assigned incidents.");
        Incident incident = findIncident(incidentId);
        validateOfficerIncidentAccess(currentUser, incident);
        return updateIncidentStatus(incidentId, request);
    }

    //OFFICER ACCESS
    private void validateOfficerIncidentAccess(User officer, Incident incident) {

        if (incident.getAssignedOfficer() == null) {

            throw new InvalidRequestException("This incident is not assigned to an officer.");
        }

        if (!incident.getAssignedOfficer().getId().equals(officer.getId())) {

            throw new InvalidRequestException("You are not authorized to access this incident.");
        }
    }

    // INCIDENT -> COMPLAINT SYNCHRONIZATION
    private void synchronizeComplaintsWithIncident(Incident incident, String incidentStatus, User changedBy) {

        String complaintStatus = mapIncidentStatusToComplaintStatus(incidentStatus);
        List<Complaint> complaints = complaintRepository.findByIncident(incident);
        for (Complaint complaint : complaints) {
            String oldComplaintStatus = complaint.getStatus();

            // UPDATE OFFICER
            if (incident.getAssignedOfficer() != null) {

                complaint.setAssignedOfficer(incident.getAssignedOfficer());
            }


            if (safeEquals(complaintStatus, oldComplaintStatus)) {
                complaintRepository.save(complaint);
                continue;
            }


            complaint.setStatus(complaintStatus);
            Complaint savedComplaint = complaintRepository.save(complaint);

            ComplaintStatusHistory history = ComplaintStatusHistory.builder().complaint(savedComplaint).status(complaintStatus).remarks("Complaint status synchronized with incident.").updatedBy(changedBy).build();
            complaintStatusHistoryRepository.save(history);
        }
    }


    // INCIDENT STATUS -> COMPLAINT STATUS

    private String mapIncidentStatusToComplaintStatus(String incidentStatus) {

        return switch (incidentStatus) {

            case "OPEN" -> "PENDING";
            case "ASSIGNED" -> "ASSIGNED";
            case "IN_PROGRESS" -> "IN_PROGRESS";
            case "RESOLVED" -> "RESOLVED";
            default ->
                    throw new InvalidRequestException("Cannot synchronize complaint status for incident status: " + incidentStatus);
        };
    }

    // FIND INCIDENT
    private Incident findIncident(Long incidentId) {

        if (incidentId == null) {

            throw new InvalidRequestException("Incident ID is required.");
        }
        return incidentRepository.findById(incidentId).orElseThrow(() -> new ResourceNotFoundException("Incident not found."));
    }

    // CURRENT AUTHENTICATED USER
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


    // =========================================================
    // ROLE
    // =========================================================

    private String getRole(User user) {

        if (user == null || user.getRole() == null || user.getRole().getRoleName() == null) {

            throw new InvalidRequestException("User role is not available.");
        }
        return normalizeRole(user.getRole().getRoleName());
    }


    private String normalizeRole(String role) {

        if (role == null) {
            return "";
        }
        String value = role.trim().toUpperCase();

        if (value.startsWith("ROLE_")) {

            value = value.substring(5);
        }
        return value;
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

    // NORMALIZE STRING
    private String normalize(String value) {

        if (value == null) {
            return null;
        }
        return value.trim().toUpperCase();
    }

    // NULL SAFE EQUALITY

    private boolean safeEquals(String first, String second) {
        if (first == null) {
            return second == null;
        }
        return first.equals(second);
    }

    // HISTORY RESPONSE

    private IncidentStatusHistoryResponse toHistoryResponse(IncidentStatusHistory history) {

        return IncidentStatusHistoryResponse.builder().id(history.getId()).oldStatus(history.getOldStatus()).newStatus(history.getNewStatus()).changedAt(history.getChangedAt()).build();
    }
}