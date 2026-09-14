package com.wcop.service;

import com.wcop.dto.request.CreateOfficerRequest;
import com.wcop.dto.request.UpdateOfficerRequest;
import com.wcop.dto.response.UserResponse;

import java.util.List;

public interface AdminService {

    // Existing
    List<UserResponse> getOfficers();

    // ADD THIS
    UserResponse getOfficerById(Long officerId);

    // Existing
    UserResponse createOfficer(CreateOfficerRequest request);

    // Existing
    UserResponse updateOfficer(Long officerId, UpdateOfficerRequest request);
}