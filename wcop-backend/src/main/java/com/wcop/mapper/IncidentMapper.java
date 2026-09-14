package com.wcop.mapper;

import com.wcop.dto.response.IncidentResponse;
import com.wcop.entity.Incident;
import com.wcop.entity.StaffProfile;
import com.wcop.entity.User;

public final class IncidentMapper {

    private IncidentMapper() {
    }

    public static IncidentResponse toIncidentResponse(Incident incident) {

        if (incident == null) {
            return null;
        }

        String department = null;

        if (incident.getDepartment() != null) {
            department = incident.getDepartment().getDepartmentName();
        }

        String district = null;

        if (incident.getDistrict() != null) {
            district = incident.getDistrict().getDistrictName();
        }

        User assignedOfficer = incident.getAssignedOfficer();

        String assignedOfficerName = null;
        String assignedOfficerEmployeeId = null;

        if (assignedOfficer != null) {

            assignedOfficerName = buildFullName(assignedOfficer.getFirstName(), assignedOfficer.getLastName());

            StaffProfile staffProfile = assignedOfficer.getStaffProfile();

            if (staffProfile != null) {
                assignedOfficerEmployeeId = staffProfile.getEmployeeId();
            }
        }

        Integer citizenReportCount = 0;

        if (incident.getComplaints() != null) {
            citizenReportCount = incident.getComplaints().size();
        }

        return IncidentResponse.builder().id(incident.getId()).title(incident.getTitle()).description(incident.getDescription()).imageUrl(incident.getImageUrl()).latitude(incident.getLatitude()).longitude(incident.getLongitude()).department(department).district(district).status(incident.getStatus()).assignedOfficerName(assignedOfficerName).assignedOfficerEmployeeId(assignedOfficerEmployeeId).assignmentSource(incident.getAssignmentSource()).citizenReportCount(citizenReportCount).createdAt(incident.getCreatedAt()).updatedAt(incident.getUpdatedAt()).build();
    }

    private static String buildFullName(String firstName, String lastName) {

        String first = firstName == null ? "" : firstName.trim();
        String last = lastName == null ? "" : lastName.trim();

        if (first.isEmpty()) {
            return last.isEmpty() ? null : last;
        }

        if (last.isEmpty()) {
            return first;
        }

        return first + " " + last;
    }
}