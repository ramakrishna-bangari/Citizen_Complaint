package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOfficerResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String employeeId;

    private String department;

    private String district;

    private String designation;
}