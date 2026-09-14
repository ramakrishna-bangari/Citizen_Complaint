package com.wcop.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentResponse {


    private Long id;

    private String title;

    private String description;

    private String imageUrl;


    private String department;

    private String district;

    private Double latitude;

    private Double longitude;

    private String status;

    private Integer citizenReportCount;

    private String assignedOfficerEmployeeId;

    private String assignedOfficerName;

    private String assignmentSource;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}