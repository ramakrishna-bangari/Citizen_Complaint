package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistrictResponse {

    private Long id;

    private String districtName;

    private Boolean active;
}