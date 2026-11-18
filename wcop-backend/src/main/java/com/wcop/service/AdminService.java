package com.wcop.service;

import com.wcop.dto.request.CreateOfficerRequest;
import com.wcop.dto.request.UpdateOfficerRequest;
import com.wcop.dto.response.UserResponse;

import java.util.List;

public interface AdminService {

    List<UserResponse> getOfficers();

    UserResponse getOfficerById(Long officerId);

    UserResponse createOfficer(CreateOfficerRequest request);

    UserResponse updateOfficer(Long officerId, UpdateOfficerRequest request);
}
