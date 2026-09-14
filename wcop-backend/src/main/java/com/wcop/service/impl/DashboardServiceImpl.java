package com.wcop.service.impl;

import com.wcop.dto.response.AdminDashboardResponse;
import com.wcop.dto.response.CitizenDashboardResponse;
import com.wcop.dto.response.DashboardAnalyticsResponse;
import com.wcop.dto.response.OfficerDashboardResponse;
import com.wcop.entity.User;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.repository.ComplaintRepository;
import com.wcop.repository.DepartmentRepository;
import com.wcop.repository.IncidentRepository;
import com.wcop.repository.UserRepository;
import com.wcop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ComplaintRepository complaintRepository;

    private final IncidentRepository incidentRepository;

    private final UserRepository userRepository;

    private final DepartmentRepository departmentRepository;


    // ADMIN DASHBOARD
    @Override
    public AdminDashboardResponse getAdminDashboard() {

        User currentUser = getCurrentUser();

        requireRole(currentUser, "ADMIN");

        // COMPLAINT COUNTS

        long totalComplaints = complaintRepository.count();

        long pendingComplaints = complaintRepository.countByStatus("PENDING");

        long assignedComplaints = complaintRepository.countByStatus("ASSIGNED");

        long inProgressComplaints = complaintRepository.countByStatus("IN_PROGRESS");

        long resolvedComplaints = complaintRepository.countByStatus("RESOLVED");


        // INCIDENT COUNTS

        long totalIncidents = incidentRepository.count();

        long openIncidents = incidentRepository.countByStatus("OPEN");

        long assignedIncidents = incidentRepository.countByStatus("ASSIGNED");

        long inProgressIncidents = incidentRepository.countByStatus("IN_PROGRESS");

        long resolvedIncidents = incidentRepository.countByStatus("RESOLVED");

        long unassignedIncidents = incidentRepository.countByAssignedOfficerIsNull();

        // PRIORITY COUNTS

        long highPriorityComplaints = complaintRepository.countByPriority("HIGH");

        long mediumPriorityComplaints = complaintRepository.countByPriority("MEDIUM");

        long lowPriorityComplaints = complaintRepository.countByPriority("LOW");


        // PLATFORM COUNTS

        long totalDepartments = departmentRepository.count();

        long totalUsers = userRepository.count();

        // RESPONSE

        return AdminDashboardResponse.builder()

                // Complaints
                .totalComplaints(totalComplaints).pendingComplaints(pendingComplaints).assignedComplaints(assignedComplaints).inProgressComplaints(inProgressComplaints).resolvedComplaints(resolvedComplaints)

                // Incidents
                .totalIncidents(totalIncidents).openIncidents(openIncidents).assignedIncidents(assignedIncidents).inProgressIncidents(inProgressIncidents).resolvedIncidents(resolvedIncidents).unassignedIncidents(unassignedIncidents)

                // Priority
                .highPriorityComplaints(highPriorityComplaints).mediumPriorityComplaints(mediumPriorityComplaints).lowPriorityComplaints(lowPriorityComplaints)

                // Platform
                .totalDepartments(totalDepartments).totalUsers(totalUsers)

                .build();
    }


    // =========================================================
    // OFFICER DASHBOARD
    // =========================================================

    @Override
    public OfficerDashboardResponse getOfficerDashboard() {

        User currentUser = getCurrentUser();

        requireRole(currentUser, "OFFICER");


        return OfficerDashboardResponse.builder()

                .assignedIncidents(incidentRepository.countByAssignedOfficerAndStatus(currentUser, "ASSIGNED"))

                .inProgressIncidents(incidentRepository.countByAssignedOfficerAndStatus(currentUser, "IN_PROGRESS"))

                .resolvedIncidents(incidentRepository.countByAssignedOfficerAndStatus(currentUser, "RESOLVED"))

                .assignedComplaints(complaintRepository.countByAssignedOfficerAndStatus(currentUser, "ASSIGNED"))

                .inProgressComplaints(complaintRepository.countByAssignedOfficerAndStatus(currentUser, "IN_PROGRESS"))

                .resolvedComplaints(complaintRepository.countByAssignedOfficerAndStatus(currentUser, "RESOLVED"))

                .highPriorityComplaints(complaintRepository.countByAssignedOfficerAndPriority(currentUser, "HIGH"))

                .mediumPriorityComplaints(complaintRepository.countByAssignedOfficerAndPriority(currentUser, "MEDIUM"))

                .lowPriorityComplaints(complaintRepository.countByAssignedOfficerAndPriority(currentUser, "LOW"))

                .totalCitizenReports(complaintRepository.countByAssignedOfficer(currentUser))

                .build();
    }


    // =========================================================
    // CITIZEN DASHBOARD
    // =========================================================

    @Override
    public CitizenDashboardResponse getCitizenDashboard() {

        User currentUser = getCurrentUser();

        requireRole(currentUser, "CITIZEN");


        long totalComplaints = complaintRepository.countByUser(currentUser);

        long pendingComplaints = complaintRepository.countByUserAndStatus(currentUser, "PENDING");

        long assignedComplaints = complaintRepository.countByUserAndStatus(currentUser, "ASSIGNED");

        long inProgressComplaints = complaintRepository.countByUserAndStatus(currentUser, "IN_PROGRESS");

        long resolvedComplaints = complaintRepository.countByUserAndStatus(currentUser, "RESOLVED");


        long highPriorityComplaints = complaintRepository.countByUserAndPriority(currentUser, "HIGH");

        long mediumPriorityComplaints = complaintRepository.countByUserAndPriority(currentUser, "MEDIUM");

        long lowPriorityComplaints = complaintRepository.countByUserAndPriority(currentUser, "LOW");


        return CitizenDashboardResponse.builder()

                .totalComplaints(totalComplaints)

                .pendingComplaints(pendingComplaints)

                .assignedComplaints(assignedComplaints)

                .inProgressComplaints(inProgressComplaints)

                .resolvedComplaints(resolvedComplaints)

                .highPriorityComplaints(highPriorityComplaints)

                .mediumPriorityComplaints(mediumPriorityComplaints)

                .lowPriorityComplaints(lowPriorityComplaints)

                .build();
    }


    // ADMIN ANALYTICS
    @Override
    public DashboardAnalyticsResponse getAdminAnalytics() {

        User currentUser = getCurrentUser();

        requireRole(currentUser, "ADMIN");

        Map<String, Long> complaintsByDepartment = convertToMap(complaintRepository.countComplaintsByDepartment());

        Map<String, Long> incidentsByDepartment = convertToMap(incidentRepository.countIncidentsByDepartment());

        Map<String, Long> complaintsByDistrict = convertToMap(complaintRepository.countComplaintsByDistrict());

        Map<String, Long> incidentsByDistrict = convertToMap(incidentRepository.countIncidentsByDistrict());

        Map<String, Long> complaintsByPriority = convertToMap(complaintRepository.countComplaintsByPriority());

        return DashboardAnalyticsResponse.builder()

                .complaintsByDepartment(complaintsByDepartment)

                .incidentsByDepartment(incidentsByDepartment)

                .complaintsByDistrict(complaintsByDistrict)

                .incidentsByDistrict(incidentsByDistrict)

                .complaintsByPriority(complaintsByPriority)

                .recentComplaints(List.of())

                .recentIncidents(List.of())

                .build();
    }


    // ROLE VALIDATION
    private void requireRole(User user, String expectedRole) {

        if (user == null) {

            throw new InvalidRequestException("Authenticated user not found.");
        }

        if (user.getRole() == null) {

            throw new InvalidRequestException("Authenticated user has no role.");
        }

        String actualRole = user.getRole().getRoleName();

        if (!expectedRole.equalsIgnoreCase(actualRole)) {

            throw new InvalidRequestException("Only " + expectedRole.toLowerCase() + " users can access this dashboard.");
        }
    }

    // CURRENT USER

    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {

            throw new InvalidRequestException("User is not authenticated.");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User authenticatedUser) {

            if (authenticatedUser.getId() == null) {

                throw new InvalidRequestException("Authenticated user ID is missing.");
            }


            return userRepository.findById(authenticatedUser.getId()).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
        }

        String email = authentication.getName();

        if (email == null || email.isBlank()) {

            throw new InvalidRequestException("Unable to identify authenticated user.");
        }

        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }


    private Map<String, Long> convertToMap(List<Object[]> results) {

        Map<String, Long> map = new LinkedHashMap<>();

        if (results == null) {

            return map;
        }

        for (Object[] result : results) {

            if (result == null || result.length < 2) {

                continue;
            }

            String key = result[0] != null ? String.valueOf(result[0]) : "UNKNOWN";

            Long value = result[1] instanceof Number number ? number.longValue() : 0L;

            map.put(key, value);
        }

        return map;
    }
}