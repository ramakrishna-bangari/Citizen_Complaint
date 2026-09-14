package com.wcop.controller;

import com.wcop.dto.request.ChangePasswordRequest;
import com.wcop.dto.request.RejectComplaintRequest;
import com.wcop.dto.request.UpdateComplaintStatusRequest;
import com.wcop.dto.request.UpdateIncidentStatusRequest;
import com.wcop.dto.request.UpdateProfileRequest;

import com.wcop.dto.response.ComplaintResponse;
import com.wcop.dto.response.IncidentResponse;
import com.wcop.dto.response.IncidentStatusHistoryResponse;
import com.wcop.dto.response.UserResponse;

import com.wcop.service.ComplaintService;
import com.wcop.service.IncidentService;
import com.wcop.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final ComplaintService complaintService;
    private final IncidentService incidentService;
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

    // COMPLAINTS
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getOfficerComplaints() {

        return ResponseEntity.ok(complaintService.getOfficerComplaints());
    }

    @GetMapping("/complaints/page")
    public ResponseEntity<Page<ComplaintResponse>> getOfficerComplaintsPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String status, @RequestParam(required = false) String priority) {

        return ResponseEntity.ok(complaintService.getOfficerComplaints(page, size, status, priority));
    }

    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<ComplaintResponse> getOfficerComplaint(@PathVariable Long complaintId) {

        return ResponseEntity.ok(complaintService.getOfficerComplaint(complaintId));
    }

    @PutMapping("/complaints/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateOfficerComplaintStatus(@PathVariable Long complaintId, @Valid @RequestBody UpdateComplaintStatusRequest request) {

        return ResponseEntity.ok(complaintService.updateOfficerComplaintStatus(complaintId, request));
    }

    @PutMapping("/complaints/{complaintId}/reject")
    public ResponseEntity<ComplaintResponse> rejectOfficerComplaint(@PathVariable Long complaintId, @Valid @RequestBody RejectComplaintRequest request) {

        return ResponseEntity.ok(complaintService.rejectOfficerComplaint(complaintId, request));
    }

    // INCIDENTS
    @GetMapping("/incidents")
    public ResponseEntity<List<IncidentResponse>> getOfficerIncidents() {

        return ResponseEntity.ok(incidentService.getOfficerIncidents());
    }

    @GetMapping("/incidents/page")
    public ResponseEntity<Page<IncidentResponse>> getOfficerIncidentsPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String status, @RequestParam(required = false) Long departmentId, @RequestParam(required = false) Long districtId) {

        return ResponseEntity.ok(incidentService.getOfficerIncidents(page, size, status, departmentId, districtId));
    }

    @GetMapping("/incidents/{incidentId}")
    public ResponseEntity<IncidentResponse> getOfficerIncident(@PathVariable Long incidentId) {

        return ResponseEntity.ok(incidentService.getOfficerIncident(incidentId));
    }

    @GetMapping("/incidents/{incidentId}/history")
    public ResponseEntity<List<IncidentStatusHistoryResponse>> getOfficerIncidentHistory(@PathVariable Long incidentId) {

        return ResponseEntity.ok(incidentService.getIncidentHistory(incidentId));
    }

    @PutMapping("/incidents/{incidentId}/status")
    public ResponseEntity<IncidentResponse> updateOfficerIncidentStatus(@PathVariable Long incidentId, @Valid @RequestBody UpdateIncidentStatusRequest request) {

        return ResponseEntity.ok(incidentService.updateOfficerIncidentStatus(incidentId, request));
    }
}