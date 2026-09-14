package com.wcop.service.impl;

import com.wcop.dto.request.ChangePasswordRequest;
import com.wcop.dto.request.UpdateProfileRequest;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.User;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.mapper.UserMapper;
import com.wcop.repository.UserRepository;
import com.wcop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Return the currently logged-in user's profile — works for citizen, officer, or admin
    @Override
    @Transactional(readOnly = true)
    public UserResponse getProfile() {

        User user = getCurrentUser();

        return UserMapper.toUserResponse(user);
    }

    // Partially update the currently logged-in user's profile.
    // Only fields that are present and non-blank in the request are changed.
    @Override
    public UserResponse updateProfile(UpdateProfileRequest request) {

        User user = getCurrentUser();

        if (request.getFirstName() != null) {

            String firstName = request.getFirstName().trim();

            if (!firstName.isEmpty()) {
                user.setFirstName(firstName);
            }
        }

        if (request.getLastName() != null) {

            String lastName = request.getLastName().trim();

            if (!lastName.isEmpty()) {
                user.setLastName(lastName);
            }
        }

        if (request.getEmail() != null) {

            String newEmail = request.getEmail().trim().toLowerCase();

            if (!newEmail.isEmpty() && !newEmail.equalsIgnoreCase(user.getEmail())) {

                if (userRepository.existsByEmail(newEmail)) {
                    throw new InvalidRequestException("Email is already registered.");
                }

                user.setEmail(newEmail);
            }
        }

        if (request.getPhone() != null) {

            String newPhone = request.getPhone().trim();

            if (!newPhone.isEmpty() && !newPhone.equals(user.getPhone())) {

                if (userRepository.existsByPhone(newPhone)) {
                    throw new InvalidRequestException("Phone number is already registered.");
                }

                user.setPhone(newPhone);
            }
        }

        if (request.getAddress() != null) {

            user.setAddress(request.getAddress().trim());
        }

        User updatedUser = userRepository.save(user);

        return UserMapper.toUserResponse(updatedUser);
    }

    // Resolve the currently authenticated user from the security context
    private User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidRequestException("User is not authenticated.");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User authenticatedUser)) {
            throw new InvalidRequestException("Unable to identify authenticated user.");
        }

        return userRepository.findById(authenticatedUser.getId()).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    // Change the currently logged-in user's password — works for citizen, officer, or admin
    @Override
    public void changePassword(ChangePasswordRequest request) {

        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidRequestException("Current password is incorrect.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new InvalidRequestException("New password must be different from current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}