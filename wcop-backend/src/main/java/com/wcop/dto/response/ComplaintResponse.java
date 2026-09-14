package com.wcop.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponse {

    private Long id;

    private String title;

    private String description;

    private String location;

    private Double latitude;

    private Double longitude;

    private String imageUrl;

    private String status;

    private String priority;

    private String problemType;


    // CITIZEN
    private String citizenName;

    private String citizenEmail;

    private String citizenPhone;


    // INCIDENT
    private Long incidentId;

    // REJECTION
    private String rejectionReason;

    private String rejectionNote;

    private String rejectedBy;

    private LocalDateTime rejectedAt;

    // ASSIGNED OFFICER
    private String assignedOfficer;

    private String assignedOfficerEmployeeId;


    private String department;

    private String district;

    // TIMESTAMPS
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}