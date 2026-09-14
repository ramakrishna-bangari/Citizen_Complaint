package com.wcop.service;

import com.wcop.dto.request.AssignIncidentRequest;
import com.wcop.dto.request.UpdateIncidentStatusRequest;
import com.wcop.dto.response.IncidentResponse;
import com.wcop.dto.response.IncidentStatusHistoryResponse;
import com.wcop.entity.Incident;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IncidentService {

    // =========================================================
    // GET INCIDENT
    // =========================================================

    IncidentResponse getIncidentById(Long incidentId);


    // =========================================================
    // ADMIN - ALL INCIDENTS
    // =========================================================

    List<IncidentResponse> getAllIncidents();


    // =========================================================
    // PAGINATED INCIDENTS
    //
    // ADMIN   -> ALL
    // OFFICER -> ASSIGNED ONLY
    // =========================================================

    Page<IncidentResponse> getIncidents(int page, int size, String status, Long departmentId, Long districtId);


    // =========================================================
    // ADMIN - OPEN / UNASSIGNED INCIDENTS
    // =========================================================

    List<IncidentResponse> getOpenIncidents();


    // =========================================================
    // AUTOMATIC ASSIGNMENT
    // =========================================================

    void autoAssignIncident(Incident incident);


    // =========================================================
    // ADMIN - MANUAL ASSIGN / TRANSFER
    // =========================================================

    IncidentResponse assignIncident(Long incidentId, AssignIncidentRequest request);


    // =========================================================
    // UPDATE INCIDENT STATUS
    //
    // ADMIN   -> ANY
    // OFFICER -> OWN ASSIGNED INCIDENT
    // =========================================================

    IncidentResponse updateIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request);


    // =========================================================
    // INCIDENT HISTORY
    // =========================================================

    List<IncidentStatusHistoryResponse> getIncidentHistory(Long incidentId);


    // =========================================================
    // OFFICER - ALL ASSIGNED INCIDENTS
    // =========================================================

    List<IncidentResponse> getOfficerIncidents();


    // =========================================================
    // OFFICER - PAGINATED ASSIGNED INCIDENTS
    // =========================================================

    Page<IncidentResponse> getOfficerIncidents(int page, int size, String status, Long departmentId, Long districtId);


    // =========================================================
    // OFFICER - ONE ASSIGNED INCIDENT
    // =========================================================

    IncidentResponse getOfficerIncident(Long incidentId);


    // =========================================================
    // OFFICER - UPDATE OWN INCIDENT
    // =========================================================

    IncidentResponse updateOfficerIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request);
}