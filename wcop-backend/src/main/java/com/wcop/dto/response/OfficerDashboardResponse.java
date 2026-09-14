package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficerDashboardResponse {

    private long assignedIncidents;

    private long inProgressIncidents;

    private long resolvedIncidents;

    private long assignedComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;

    private long highPriorityComplaints;

    private long mediumPriorityComplaints;

    private long lowPriorityComplaints;

    private long totalCitizenReports;
}