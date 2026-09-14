package com.wcop.service;

import com.wcop.dto.response.DistrictResponse;

import java.util.List;

public interface DistrictService {

    // =========================================================
    // CREATE
    // =========================================================

    DistrictResponse createDistrict(String districtName, String description, Boolean active);


    // =========================================================
    // GET ALL
    // =========================================================

    List<DistrictResponse> getAllDistricts();


    // =========================================================
    // GET ACTIVE
    // =========================================================

    List<DistrictResponse> getActiveDistricts();


    // =========================================================
    // GET BY ID
    // =========================================================

    DistrictResponse getDistrictById(Long districtId);


    // =========================================================
    // UPDATE
    // =========================================================

    DistrictResponse updateDistrict(Long districtId, String districtName, String description, Boolean active);


    // =========================================================
    // ACTIVATE
    // =========================================================

    DistrictResponse activateDistrict(Long districtId);


    // =========================================================
    // DEACTIVATE
    // =========================================================

    DistrictResponse deactivateDistrict(Long districtId);
}