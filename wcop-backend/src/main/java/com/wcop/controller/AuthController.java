package com.wcop.controller;

import com.wcop.dto.request.*;
import com.wcop.dto.response.AuthResult;
import com.wcop.dto.response.LoginResponse;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.User;
import com.wcop.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        AuthResult result = authService.register(request);

        addAuthCookies(
                response,
                result.getAccessToken(),
                result.getRefreshToken());

        LoginResponse loginResponse = LoginResponse.builder()
                .user(result.getUser())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(loginResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthResult result = authService.login(request);

        addAuthCookies(
                response,
                result.getAccessToken(),
                result.getRefreshToken());

        LoginResponse loginResponse = LoginResponse.builder()
                .user(result.getUser())
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletResponse response) {

        deleteCookie(response, "accessToken");
        deleteCookie(response, "refreshToken");

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        AuthResult result = authService.refreshToken(refreshToken);

        addAuthCookies(
                response,
                result.getAccessToken(),
                result.getRefreshToken());

        LoginResponse loginResponse = LoginResponse.builder()
                .user(result.getUser())
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtp(request.getPhone());

        return ResponseEntity.ok(
                Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<LoginResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request,
            HttpServletResponse response) {

        AuthResult result = authService.verifyOtp(request);

        addAuthCookies(
                response,
                result.getAccessToken(),
                result.getRefreshToken());

        LoginResponse loginResponse = LoginResponse.builder()
                .user(result.getUser())
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        authService.changePassword(user, request);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        UserResponse response = authService.updateProfile(
                user,
                request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(
                request.getIdentifier());

        return ResponseEntity.ok(
                Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok().build();
    }

    private void addAuthCookies(
            HttpServletResponse response,
            String accessToken,
            String refreshToken) {

        ResponseCookie accessCookie = ResponseCookie
                .from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .build();

        ResponseCookie refreshCookie = ResponseCookie
                .from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                accessCookie.toString());

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                refreshCookie.toString());
    }

    private void deleteCookie(
            HttpServletResponse response,
            String name) {

        ResponseCookie cookie = ResponseCookie
                .from(name, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString());
    }
}