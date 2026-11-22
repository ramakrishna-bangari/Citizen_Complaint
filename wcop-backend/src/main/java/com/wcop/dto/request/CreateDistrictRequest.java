package com.wcop.dto.request;

@lombok.Getter
@lombok.Setter
public class  CreateDistrictRequest {

    private String districtName;

    private String description;

    private Boolean active;
}
