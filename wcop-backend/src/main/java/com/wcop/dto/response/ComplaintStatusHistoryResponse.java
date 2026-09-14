package com.wcop.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintStatusHistoryResponse {

    private String status;

    private String remarks;

    private String updatedBy;

    private LocalDateTime updatedAt;
}