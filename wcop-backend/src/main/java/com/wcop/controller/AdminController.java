package com.wcop.controller;

import com.wcop.dto.request.*;
import com.wcop.dto.response.ComplaintResponse;
import com.wcop.dto.response.IncidentResponse;
import com.wcop.dto.response.UserResponse;
import com.wcop.service.AdminService;
import com.wcop.service.ComplaintService;
import com.wcop.service.IncidentService;
import com.wcop.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ComplaintService complaintService;
    private final IncidentService incidentService;
    private final UserService userService;

    // ADMIN PROFILE
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {

        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(userService.updateProfile(request));
    }

    // ADMIN CHANGE PASSWORD
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return ResponseEntity.noContent().build();
    }

    // OFFICER MANAGEMENT

    @GetMapping("/officers")
    public ResponseEntity<List<UserResponse>> getOfficers() {
        return ResponseEntity.ok(adminService.getOfficers());
    }

    @GetMapping("/officers/{officerId}")
    public ResponseEntity<UserResponse> getOfficer(@PathVariable Long officerId) {

        return ResponseEntity.ok(adminService.getOfficerById(officerId));
    }

    @PostMapping("/officers")
    public ResponseEntity<UserResponse> createOfficer(@Valid @RequestBody CreateOfficerRequest request) {

        UserResponse response = adminService.createOfficer(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/officers/{officerId}")
    public ResponseEntity<UserResponse> updateOfficer(@PathVariable Long officerId, @Valid @RequestBody UpdateOfficerRequest request) {

        return ResponseEntity.ok(adminService.updateOfficer(officerId, request));
    }

    // COMPLAINTS

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {

        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/complaints/page")
    public ResponseEntity<Page<ComplaintResponse>> getComplaintsPage(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "20") int size,

            @RequestParam(required = false) String status,

            @RequestParam(required = false) String priority) {

        return ResponseEntity.ok(complaintService.getComplaints(page, size, status, priority));
    }

    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(complaintService.getComplaintById(complaintId));
    }

    @PutMapping("/complaints/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(

            @PathVariable Long complaintId, @Valid @RequestBody UpdateComplaintStatusRequest request) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(complaintId, request));
    }

    @PutMapping("/complaints/{complaintId}/reject")
    public ResponseEntity<ComplaintResponse> rejectComplaint(

            @PathVariable Long complaintId, @Valid @RequestBody RejectComplaintRequest request) {

        return ResponseEntity.ok(complaintService.rejectComplaint(complaintId, request));
    }

    // INCIDENTS

    @GetMapping("/incidents")
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/incidents/page")
    public ResponseEntity<Page<IncidentResponse>> getIncidentsPage(

            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String status, @RequestParam(required = false) Long departmentId, @RequestParam(required = false) Long districtId) {
        return ResponseEntity.ok(incidentService.getIncidents(page, size, status, departmentId, districtId));
    }

    @GetMapping("/incidents/{incidentId}")
    public ResponseEntity<IncidentResponse> getIncident(@PathVariable Long incidentId) {
        return ResponseEntity.ok(incidentService.getIncidentById(incidentId));
    }

    @PutMapping("/incidents/{incidentId}/assign")
    public ResponseEntity<IncidentResponse> assignIncident(

            @PathVariable Long incidentId, @Valid @RequestBody AssignIncidentRequest request) {

        return ResponseEntity.ok(incidentService.assignIncident(incidentId, request));
    }

    @PutMapping("/incidents/{incidentId}/status")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(@PathVariable Long incidentId, @Valid @RequestBody UpdateIncidentStatusRequest request) {

        return ResponseEntity.ok(incidentService.updateIncidentStatus(incidentId, request));
    }
}