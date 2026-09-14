package com.wcop.service.impl;

import com.wcop.service.TwoFactorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class TwoFactorServiceImpl implements TwoFactorService {

    private final RestTemplate restTemplate;

    @Value("${twofactor.api-key}")
    private String apiKey;

    @Value("${twofactor.otp-template}")
    private String otpTemplate;

    @Override
    public String sendOtp(String mobileNumber) {

        String formattedNumber = formatIndianMobileNumber(mobileNumber);

        String url = "https://2factor.in/API/V1/" + apiKey + "/SMS/" + formattedNumber + "/AUTOGEN/" + otpTemplate;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        return response.getBody();
    }

    @Override
    public String verifyOtp(String mobileNumber, String otp) {

        String formattedNumber = formatIndianMobileNumber(mobileNumber);

        String url = "https://2factor.in/API/V1/" + apiKey + "/SMS/VERIFY3/" + formattedNumber + "/" + otp;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        return response.getBody();
    }

    private String formatIndianMobileNumber(String mobileNumber) {

        if (mobileNumber == null || mobileNumber.isBlank()) {
            throw new IllegalArgumentException("Mobile number is required");
        }

        String number = mobileNumber.trim();

        // Remove spaces, + and hyphens
        number = number.replace(" ", "").replace("-", "").replace("+", "");

        if (number.startsWith("91") && number.length() == 12) {
            return number;
        }
        // Normal 10-digit Indian mobile number
        if (number.length() == 10) {
            return "91" + number;
        }
        throw new IllegalArgumentException("Enter a valid 10-digit Indian mobile number.");
    }
}