package com.wcop.controller;

import com.wcop.dto.request.ChangePasswordRequest;
import com.wcop.dto.request.CreateComplaintRequest;
import com.wcop.dto.request.UpdateProfileRequest;
import com.wcop.dto.response.ComplaintResponse;
import com.wcop.dto.response.ComplaintStatusHistoryResponse;
import com.wcop.dto.response.UserResponse;
import com.wcop.service.ComplaintService;
import com.wcop.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
public class CitizenController {

    private final ComplaintService complaintService;
    private final UserService userService;

    // PROFILE
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {

        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(userService.updateProfile(request));
    }

    // CHANGE PASSWORD
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return ResponseEntity.noContent().build();
    }

    // CREATE COMPLAINT
    @PostMapping("/complaints")
    public ResponseEntity<ComplaintResponse> createComplaint(@Valid @RequestBody CreateComplaintRequest request) {

        ComplaintResponse response = complaintService.createComplaint(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // MY COMPLAINTS
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints() {

        return ResponseEntity.ok(complaintService.getMyComplaints());
    }

    // SINGLE COMPLAINT
    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaint(@PathVariable Long complaintId) {

        return ResponseEntity.ok(complaintService.getComplaintById(complaintId));
    }

    // COMPLAINT HISTORY
    @GetMapping("/complaints/{complaintId}/history")
    public ResponseEntity<List<ComplaintStatusHistoryResponse>> getComplaintHistory(@PathVariable Long complaintId) {

        return ResponseEntity.ok(complaintService.getComplaintHistory(complaintId));
    }
}