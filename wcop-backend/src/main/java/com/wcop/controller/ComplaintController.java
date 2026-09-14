package com.wcop.controller;

import com.wcop.dto.request.CreateComplaintRequest;
import com.wcop.dto.request.RejectComplaintRequest;
import com.wcop.dto.request.UpdateComplaintStatusRequest;
import com.wcop.dto.response.ComplaintResponse;
import com.wcop.dto.response.ComplaintStatusHistoryResponse;
import com.wcop.service.ComplaintService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // CITIZEN - CREATE
    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(@Valid @RequestBody CreateComplaintRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.createComplaint(request));
    }

    // CITIZEN - MY COMPLAINTS

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints() {

        return ResponseEntity.ok(complaintService.getMyComplaints());
    }


    // ADMIN / OFFICER - PAGINATED COMPLAINTS
    @GetMapping("/page")
    public ResponseEntity<Page<ComplaintResponse>> getComplaintsPage(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "20") int size,

            @RequestParam(required = false) String status,

            @RequestParam(required = false) String priority) {

        return ResponseEntity.ok(complaintService.getComplaints(page, size, status, priority));
    }


    // ADMIN / OFFICER - ALL COMPLAINTS

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {

        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // GET SINGLE COMPLAINT

    @GetMapping("/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long complaintId) {

        return ResponseEntity.ok(complaintService.getComplaintById(complaintId));
    }


    // COMPLAINT HISTORY

    @GetMapping("/{complaintId}/history")
    public ResponseEntity<List<ComplaintStatusHistoryResponse>> getComplaintHistory(@PathVariable Long complaintId) {

        return ResponseEntity.ok(complaintService.getComplaintHistory(complaintId));
    }

    // ADMIN / OFFICER - UPDATE STATUS
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(

            @PathVariable Long complaintId,

            @Valid @RequestBody UpdateComplaintStatusRequest request) {

        return ResponseEntity.ok(complaintService.updateComplaintStatus(complaintId, request));
    }

    // ADMIN / OFFICER - REJECT

    @PutMapping("/{complaintId}/reject")
    public ResponseEntity<ComplaintResponse> rejectComplaint(

            @PathVariable Long complaintId,

            @Valid @RequestBody RejectComplaintRequest request) {

        return ResponseEntity.ok(complaintService.rejectComplaint(complaintId, request));
    }


    // OFFICER - UPDATE ASSIGNED COMPLAINT

    @PutMapping("/{complaintId}/officer-status")
    public ResponseEntity<ComplaintResponse> updateOfficerComplaintStatus(

            @PathVariable Long complaintId,

            @Valid @RequestBody UpdateComplaintStatusRequest request) {

        return ResponseEntity.ok(complaintService.updateOfficerComplaintStatus(complaintId, request));
    }


    // OFFICER - REJECT ASSIGNED COMPLAINT

    @PutMapping("/{complaintId}/officer-reject")
    public ResponseEntity<ComplaintResponse> rejectOfficerComplaint(

            @PathVariable Long complaintId,

            @Valid @RequestBody RejectComplaintRequest request) {

        return ResponseEntity.ok(complaintService.rejectOfficerComplaint(complaintId, request));
    }
}