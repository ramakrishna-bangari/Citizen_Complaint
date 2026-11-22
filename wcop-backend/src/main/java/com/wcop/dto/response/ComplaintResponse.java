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

    private String citizenName;

    private String citizenEmail;

    private String citizenPhone;

    private Long incidentId;

    private String rejectionReason;

    private String rejectionNote;

    private String rejectedBy;

    private LocalDateTime rejectedAt;

    private String assignedOfficer;

    private String assignedOfficerEmployeeId;

    private String department;

    private String district;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
