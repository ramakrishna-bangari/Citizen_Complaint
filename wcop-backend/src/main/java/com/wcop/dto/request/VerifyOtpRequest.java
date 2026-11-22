package com.wcop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {

    private String phone;
    private String identifier;

    @NotBlank(message = "OTP is required")
    private String otp;

    public String getPhone() {
        if (phone != null && !phone.isBlank()) {
            return phone.trim();
        }
        if (identifier != null && !identifier.isBlank()) {
            return identifier.trim();
        }
        return null;
    }
}
