package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffProfileResponse {

    private String employeeId;

    private String department;

    private String district;

    private Boolean active;
}