package com.wcop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignIncidentRequest {

    @NotNull(message = "Officer ID is required")
    private Long officerId;
}