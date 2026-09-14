package com.wcop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOfficerRequest {

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "District is required")
    private Long districtId;

    @NotNull(message = "Active status is required")
    private Boolean active;
}