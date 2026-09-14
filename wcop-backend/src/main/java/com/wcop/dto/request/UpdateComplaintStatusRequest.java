package com.wcop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateComplaintStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;
}