package com.wcop.dto.request;

import com.wcop.entity.ComplaintRejectionReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RejectComplaintRequest {

    @NotNull(message = "Rejection reason is required")
    private ComplaintRejectionReason reason;

    @NotBlank(message = "Rejection note is required")
    @Size(max = 1000, message = "Rejection note cannot exceed 1000 characters")
    private String note;
}