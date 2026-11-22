package com.wcop.service;

import com.wcop.dto.request.AssignIncidentRequest;
import com.wcop.dto.request.UpdateIncidentStatusRequest;
import com.wcop.dto.response.IncidentResponse;
import com.wcop.dto.response.IncidentStatusHistoryResponse;
import com.wcop.entity.Incident;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IncidentService {

    IncidentResponse getIncidentById(Long incidentId);

    List<IncidentResponse> getAllIncidents();

    Page<IncidentResponse> getIncidents(int page, int size, String status, Long departmentId, Long districtId);

    List<IncidentResponse> getOpenIncidents();

    void autoAssignIncident(Incident incident);

    IncidentResponse assignIncident(Long incidentId, AssignIncidentRequest request);

    IncidentResponse updateIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request);

    List<IncidentStatusHistoryResponse> getIncidentHistory(Long incidentId);

    List<IncidentResponse> getOfficerIncidents();

    Page<IncidentResponse> getOfficerIncidents(int page, int size, String status, Long departmentId, Long districtId);

    IncidentResponse getOfficerIncident(Long incidentId);

    IncidentResponse updateOfficerIncidentStatus(Long incidentId, UpdateIncidentStatusRequest request);
}
