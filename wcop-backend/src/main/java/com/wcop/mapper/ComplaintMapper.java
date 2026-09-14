package com.wcop.mapper;

import com.wcop.dto.response.ComplaintResponse;
import com.wcop.entity.Complaint;
import com.wcop.entity.StaffProfile;
import com.wcop.entity.User;

public final class ComplaintMapper {

    private ComplaintMapper() {
    }

    public static ComplaintResponse toComplaintResponse(Complaint complaint) {

        if (complaint == null) {
            return null;
        }

        // CITIZEN
        User citizen = complaint.getUser();

        String citizenName = null;
        String citizenEmail = null;
        String citizenPhone = null;

        if (citizen != null) {
            citizenName = buildFullName(citizen.getFirstName(), citizen.getLastName());
            citizenEmail = citizen.getEmail();
            citizenPhone = citizen.getPhone();
        }

        // ASSIGNED OFFICER
        User assignedOfficer = complaint.getAssignedOfficer();
        if (assignedOfficer == null && complaint.getIncident() != null) {
            assignedOfficer = complaint.getIncident().getAssignedOfficer();
        }


        String assignedOfficerName = null;
        String assignedOfficerEmployeeId = null;

        if (assignedOfficer != null) {
            assignedOfficerName = buildFullName(assignedOfficer.getFirstName(), assignedOfficer.getLastName());

            // STAFF PROFILE

            StaffProfile staffProfile = assignedOfficer.getStaffProfile();

            if (staffProfile != null) {

                assignedOfficerEmployeeId = staffProfile.getEmployeeId();
            }
        }

        String department = null;
        if (complaint.getDepartment() != null) {
            department = complaint.getDepartment().getDepartmentName();
        }


        if (department == null && complaint.getIncident() != null && complaint.getIncident().getDepartment() != null) {

            department = complaint.getIncident().getDepartment().getDepartmentName();
        }

        String district = null;

        if (complaint.getDistrict() != null) {

            district = complaint.getDistrict().getDistrictName();
        }


        if (district == null && complaint.getIncident() != null && complaint.getIncident().getDistrict() != null) {

            district = complaint.getIncident().getDistrict().getDistrictName();
        }

        // REJECTION

        String rejectionReason = null;

        if (complaint.getRejectionReason() != null) {

            rejectionReason = complaint.getRejectionReason().name();
        }


        String rejectedBy = null;

        if (complaint.getRejectedBy() != null) {

            rejectedBy = buildFullName(complaint.getRejectedBy().getFirstName(), complaint.getRejectedBy().getLastName());
        }
        //INCIDENT ID
        Long incidentId = null;

        if (complaint.getIncident() != null) {

            incidentId = complaint.getIncident().getId();
        }

        // RESPONSE
        return ComplaintResponse.builder()

                .id(complaint.getId())

                .title(complaint.getTitle())

                .description(complaint.getDescription())

                .location(complaint.getLocation())

                .latitude(complaint.getLatitude())

                .longitude(complaint.getLongitude())

                .imageUrl(complaint.getImageUrl())

                // Classification

                .status(complaint.getStatus())

                .priority(complaint.getPriority())

                .problemType(complaint.getProblemType())

                // Citizen
                .citizenName(citizenName)

                .citizenEmail(citizenEmail)

                .citizenPhone(citizenPhone)


                .department(department)

                .district(district)

                // Officer
                .assignedOfficer(assignedOfficerName)

                .assignedOfficerEmployeeId(assignedOfficerEmployeeId)

                // Incident
                .incidentId(incidentId)

                // Rejection
                .rejectionReason(rejectionReason)

                .rejectionNote(complaint.getRejectionNote())

                .rejectedBy(rejectedBy)

                .rejectedAt(complaint.getRejectedAt())

                // Dates
                .createdAt(complaint.getCreatedAt())

                .updatedAt(complaint.getUpdatedAt())

                .build();
    }

    // NAME

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