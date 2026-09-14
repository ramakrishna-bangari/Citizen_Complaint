package com.wcop.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardAnalyticsResponse {

    private Map<String, Long> complaintsByDepartment;

    private Map<String, Long> incidentsByDepartment;

    private Map<String, Long> complaintsByDistrict;

    private Map<String, Long> incidentsByDistrict;

    private Map<String, Long> complaintsByPriority;

    private List<ComplaintResponse> recentComplaints;

    private List<IncidentResponse> recentIncidents;
}