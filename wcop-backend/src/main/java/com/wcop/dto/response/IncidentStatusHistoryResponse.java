package com.wcop.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentStatusHistoryResponse {

    private Long id;

    private String oldStatus;

    private String newStatus;

    private LocalDateTime changedAt;
}