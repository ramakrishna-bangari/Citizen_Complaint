package com.wcop.service;

import com.wcop.dto.request.UpdateProfileRequest;
import com.wcop.dto.response.UserResponse;
import com.wcop.dto.request.ChangePasswordRequest;

public interface UserService {

    UserResponse getProfile();
    UserResponse updateProfile(UpdateProfileRequest request);
    void changePassword(ChangePasswordRequest request);

}