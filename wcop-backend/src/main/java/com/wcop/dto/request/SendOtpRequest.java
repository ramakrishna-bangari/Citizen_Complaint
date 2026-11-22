package com.wcop.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendOtpRequest {

    private String phone;
    private String identifier;

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
