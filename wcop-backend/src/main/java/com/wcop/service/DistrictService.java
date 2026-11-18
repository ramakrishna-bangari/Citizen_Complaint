package com.wcop.service;

import com.wcop.dto.response.DistrictResponse;

import java.util.List;

public interface DistrictService {

    DistrictResponse createDistrict(String districtName, String description, Boolean active);

    List<DistrictResponse> getAllDistricts();

    List<DistrictResponse> getActiveDistricts();

    DistrictResponse getDistrictById(Long districtId);

    DistrictResponse updateDistrict(Long districtId, String districtName, String description, Boolean active);

    DistrictResponse activateDistrict(Long districtId);

    DistrictResponse deactivateDistrict(Long districtId);
}
