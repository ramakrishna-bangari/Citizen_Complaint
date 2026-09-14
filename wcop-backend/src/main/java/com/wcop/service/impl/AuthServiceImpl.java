package com.wcop.service.impl;

import com.wcop.dto.request.*;
import com.wcop.dto.response.AuthResult;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.RefreshToken;
import com.wcop.entity.Role;
import com.wcop.entity.User;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.mapper.UserMapper;
import com.wcop.repository.RefreshTokenRepository;
import com.wcop.repository.RoleRepository;
import com.wcop.repository.UserRepository;
import com.wcop.security.JwtService;
import com.wcop.service.AuthService;
import com.wcop.service.TwoFactorService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final String CITIZEN_ROLE = "CITIZEN";

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final TwoFactorService twoFactorService;

    // Register a new citizen account
    @Override
    public AuthResult register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        String phone = request.getPhone().trim();

        if (userRepository.existsByEmail(email)) {
            throw new InvalidRequestException("Email is already registered.");
        }

        if (userRepository.existsByPhone(phone)) {
            throw new InvalidRequestException("Phone number is already registered.");
        }

        Role citizenRole = roleRepository.findByRoleName(CITIZEN_ROLE).orElseThrow(() -> new ResourceNotFoundException("CITIZEN role not found."));

        User user = User.builder().firstName(request.getFirstName().trim()).lastName(request.getLastName().trim()).email(email).password(passwordEncoder.encode(request.getPassword())).phone(phone).address(request.getAddress() != null ? request.getAddress().trim() : null).role(citizenRole).isActive(true).build();

        User savedUser = userRepository.save(user);

        return createAuthResult(savedUser);
    }

    // Password login — accepts email or phone via "identifier"
    @Override
    public AuthResult login(LoginRequest request) {

        String identifier = request.getIdentifier().trim();

        User user = findUserByIdentifier(identifier);

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new InvalidRequestException("Your account is inactive.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidRequestException("Invalid email/phone or password.");
        }

        return createAuthResult(user);
    }

    // Send OTP — phone only, citizens only
    @Override
    public void sendOtp(String phone) {

        String normalizedPhone = phone.trim();

        User user = findUserByIdentifier(normalizedPhone);

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new InvalidRequestException("Your account is inactive.");
        }

        if (!CITIZEN_ROLE.equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new InvalidRequestException("OTP login is only available for citizen accounts. Please use email/password login.");
        }

        String registeredPhone = user.getPhone();

        if (registeredPhone == null || registeredPhone.isBlank()) {
            throw new InvalidRequestException("No phone number is registered for this account.");
        }

        String response = twoFactorService.sendOtp(registeredPhone);

        if (response == null || response.isBlank()) {
            throw new InvalidRequestException("Unable to send OTP. Please try again.");
        }
    }

    // Verify OTP — phone only, citizens only
    @Override
    public AuthResult verifyOtp(VerifyOtpRequest request) {

        String phone = request.getPhone().trim();

        String otp = request.getOtp().trim();

        User user = findUserByIdentifier(phone);

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new InvalidRequestException("Your account is inactive.");
        }

        if (!CITIZEN_ROLE.equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new InvalidRequestException("OTP login is only available for citizen accounts. Please use email/password login.");
        }

        String registeredPhone = user.getPhone();

        if (registeredPhone == null || registeredPhone.isBlank()) {
            throw new InvalidRequestException("No phone number is registered for this account.");
        }

        String response = twoFactorService.verifyOtp(registeredPhone, otp);

        if (response == null || response.isBlank()) {
            throw new InvalidRequestException("OTP verification failed.");
        }

        return createAuthResult(user);
    }

    // Change password for a logged-in user (knows current password)
    @Override
    public void changePassword(User user, ChangePasswordRequest request) {

        if (user == null) {
            throw new InvalidRequestException("User is not authenticated.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidRequestException("Current password is incorrect.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new InvalidRequestException("New password must be different from current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    // Update profile for a logged-in user — works for any role
    @Override
    public UserResponse updateProfile(User user, UpdateProfileRequest request) {

        if (user == null) {
            throw new InvalidRequestException("User is not authenticated.");
        }

        String email = request.getEmail().trim().toLowerCase();

        String phone = request.getPhone().trim();

        if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new InvalidRequestException("Email is already registered to another account.");
        }

        if (!phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
            throw new InvalidRequestException("Phone number is already registered to another account.");
        }

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);

        User savedUser = userRepository.save(user);

        return UserMapper.toUserResponse(savedUser);
    }

    // Rotate access/refresh tokens using a valid stored refresh token
    @Override
    public AuthResult refreshToken(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidRequestException("Refresh token is required.");
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken).orElseThrow(() -> new InvalidRequestException("Invalid refresh token."));

        if (storedToken.getExpiryDate() == null || storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new InvalidRequestException("Refresh token has expired.");
        }

        User user = userRepository.findById(storedToken.getUser().getId()).orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            refreshTokenRepository.delete(storedToken);
            throw new InvalidRequestException("Your account is inactive.");
        }

        if (!jwtService.isTokenValid(refreshToken, user)) {
            refreshTokenRepository.delete(storedToken);
            throw new InvalidRequestException("Invalid or expired refresh token.");
        }

        return createAuthResult(user);
    }

    // Forgot password — accepts email or phone, all roles
    @Override
    public void forgotPassword(String identifier) {

        String normalizedIdentifier = identifier.trim();

        User user = findUserByIdentifier(normalizedIdentifier);

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new InvalidRequestException("Your account is inactive.");
        }

        String phone = user.getPhone();

        if (phone == null || phone.isBlank()) {
            throw new InvalidRequestException("No phone number is registered for this account.");
        }

        twoFactorService.sendOtp(phone);
    }

    // Reset password — accepts email or phone, all roles
    @Override
    public void resetPassword(ResetPasswordRequest request) {

        String identifier = request.getIdentifier().trim();

        String otp = request.getOtp().trim();

        User user = findUserByIdentifier(identifier);

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new InvalidRequestException("Your account is inactive.");
        }

        String phone = user.getPhone();

        if (phone == null || phone.isBlank()) {
            throw new InvalidRequestException("No phone number is registered for this account.");
        }

        String response = twoFactorService.verifyOtp(phone, otp);

        if (response == null || response.isBlank()) {
            throw new InvalidRequestException("OTP verification failed.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        refreshTokenRepository.deleteByUser(user);
    }

    // Build access/refresh tokens and persist the refresh token for a user
    private AuthResult createAuthResult(User user) {

        String accessToken = jwtService.generateAccessToken(user);

        String refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByUser(user).orElseGet(() -> RefreshToken.builder().user(user).build());

        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setCreatedAt(LocalDateTime.now());
        refreshTokenEntity.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshTokenRepository.save(refreshTokenEntity);

        return AuthResult.builder().accessToken(accessToken).refreshToken(refreshToken).user(UserMapper.toUserResponse(user)).build();
    }

    // Shared helper — resolves a user by email or phone
    private User findUserByIdentifier(String identifier) {

        if (identifier == null || identifier.isBlank()) {
            throw new InvalidRequestException("Email or phone number is required.");
        }

        String value = identifier.trim();

        if (value.contains("@")) {
            return userRepository.findByEmail(value.toLowerCase()).orElseThrow(() -> new InvalidRequestException("No account found with this email."));
        }

        return userRepository.findByPhone(value).orElseThrow(() -> new InvalidRequestException("No account found with this phone number."));
    }
}