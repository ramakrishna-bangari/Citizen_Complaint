package com.wcop.controller;

import com.wcop.dto.request.SendOtpRequest;
import com.wcop.dto.request.VerifyOtpRequest;
import com.wcop.service.TwoFactorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class OtpController {

    private final TwoFactorService twoFactorService;

    // =========================================================
    // SEND OTP
    // =========================================================

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody SendOtpRequest request) {

        String response = twoFactorService.sendOtp(request.getPhone());

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully", "providerResponse", response));
    }

    // VERIFY OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {

        String response = twoFactorService.verifyOtp(request.getPhone(), request.getOtp());

        return ResponseEntity.ok(Map.of("message", "OTP verification successful", "providerResponse", response));
    }
}