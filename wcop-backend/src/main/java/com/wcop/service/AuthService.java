package com.wcop.service;

import com.wcop.dto.request.*;
import com.wcop.dto.response.AuthResult;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.User;

public interface AuthService {

    // REGISTER
    AuthResult register(RegisterRequest request);

    // LOGIN - EMAIL OR MOBILE + PASSWORD
    AuthResult login(LoginRequest request);

    // OTP LOGIN - 2FACTOR
    void sendOtp(String phone);

    AuthResult verifyOtp(VerifyOtpRequest request);

    // CHANGE PASSWORD
    void changePassword(User user, ChangePasswordRequest request);

    // REFRESH TOKEN
    AuthResult refreshToken(String refreshToken);

    // FORGOT PASSWORD
    void forgotPassword(String identifier);

    // RESET PASSWORD
    void resetPassword(ResetPasswordRequest request);

    UserResponse updateProfile(User user, UpdateProfileRequest request);
}