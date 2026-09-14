package com.wcop.service;

public interface TwoFactorService {

    String sendOtp(String mobileNumber);

    String verifyOtp(String mobileNumber, String otp);
}