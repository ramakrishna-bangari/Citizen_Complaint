package com.wcop.service;

import com.wcop.dto.request.CreateComplaintRequest;
import com.wcop.dto.request.RejectComplaintRequest;
import com.wcop.dto.request.UpdateComplaintStatusRequest;
import com.wcop.dto.response.ComplaintResponse;
import com.wcop.dto.response.ComplaintStatusHistoryResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ComplaintService {

    // =========================================================
    // CITIZEN
    // =========================================================

    ComplaintResponse createComplaint(CreateComplaintRequest request);

    List<ComplaintResponse> getMyComplaints();


    // =========================================================
    // COMMON / ADMIN
    // =========================================================

    List<ComplaintResponse> getAllComplaints();

    Page<ComplaintResponse> getComplaints(int page, int size, String status, String priority);

    ComplaintResponse getComplaintById(Long complaintId);

    ComplaintResponse updateComplaintStatus(Long complaintId, UpdateComplaintStatusRequest request);

    ComplaintResponse rejectComplaint(Long complaintId, RejectComplaintRequest request);

    List<ComplaintStatusHistoryResponse> getComplaintHistory(Long complaintId);


    // =========================================================
    // OFFICER
    // =========================================================

    List<ComplaintResponse> getOfficerComplaints();

    Page<ComplaintResponse> getOfficerComplaints(int page, int size, String status, String priority);

    ComplaintResponse getOfficerComplaint(Long complaintId);

    ComplaintResponse updateOfficerComplaintStatus(Long complaintId, UpdateComplaintStatusRequest request);

    ComplaintResponse rejectOfficerComplaint(Long complaintId, RejectComplaintRequest request);
}