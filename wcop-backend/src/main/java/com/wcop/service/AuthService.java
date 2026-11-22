package com.wcop.service;

import com.wcop.dto.request.*;
import com.wcop.dto.response.AuthResult;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.User;

public interface AuthService {

    AuthResult register(RegisterRequest request);

    AuthResult login(LoginRequest request);

    void sendOtp(String phone);

    AuthResult verifyOtp(VerifyOtpRequest request);

    void changePassword(User user, ChangePasswordRequest request);

    AuthResult refreshToken(String refreshToken);

    void forgotPassword(String identifier);

    void resetPassword(ResetPasswordRequest request);

    UserResponse updateProfile(User user, UpdateProfileRequest request);
}
