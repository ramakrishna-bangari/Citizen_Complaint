package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitizenDashboardResponse {

    private long totalComplaints;

    private long pendingComplaints;

    private long assignedComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;

    private long highPriorityComplaints;

    private long mediumPriorityComplaints;

    private long lowPriorityComplaints;
}