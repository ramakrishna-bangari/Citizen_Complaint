package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalComplaints;

    private long pendingComplaints;

    private long assignedComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;

    private long totalIncidents;

    private long openIncidents;

    private long assignedIncidents;

    private long inProgressIncidents;

    private long resolvedIncidents;

    private long unassignedIncidents;


    // =========================================================
    // COMPLAINT PRIORITY
    // =========================================================

    private long highPriorityComplaints;

    private long mediumPriorityComplaints;

    private long lowPriorityComplaints;


    // =========================================================
    // PLATFORM OVERVIEW
    // =========================================================

    private long totalDepartments;

    private long totalUsers;
}