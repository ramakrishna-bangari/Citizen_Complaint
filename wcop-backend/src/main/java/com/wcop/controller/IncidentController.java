package com.wcop.controller;

import com.wcop.dto.request.AssignIncidentRequest;
import com.wcop.dto.request.UpdateIncidentStatusRequest;
import com.wcop.dto.response.IncidentResponse;
import com.wcop.dto.response.IncidentStatusHistoryResponse;
import com.wcop.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {

        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<IncidentResponse>> getIncidents(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "20") int size,

            @RequestParam(required = false) String status,

            @RequestParam(required = false) Long departmentId,

            @RequestParam(required = false) Long districtId) {

        return ResponseEntity.ok(incidentService.getIncidents(page, size, status, departmentId, districtId));
    }

    @GetMapping("/open")
    public ResponseEntity<List<IncidentResponse>> getOpenIncidents() {

        return ResponseEntity.ok(incidentService.getOpenIncidents());
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long incidentId) {

        return ResponseEntity.ok(incidentService.getIncidentById(incidentId));
    }

    @PutMapping("/{incidentId}/assign")
    public ResponseEntity<IncidentResponse> assignIncident(

            @PathVariable Long incidentId,

            @Valid @RequestBody AssignIncidentRequest request) {

        return ResponseEntity.ok(incidentService.assignIncident(incidentId, request));
    }

    @PutMapping("/{incidentId}/status")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(

            @PathVariable Long incidentId,

            @Valid @RequestBody UpdateIncidentStatusRequest request) {

        return ResponseEntity.ok(incidentService.updateIncidentStatus(incidentId, request));
    }

    @GetMapping("/{incidentId}/history")
    public ResponseEntity<List<IncidentStatusHistoryResponse>> getIncidentHistory(@PathVariable Long incidentId) {

        return ResponseEntity.ok(incidentService.getIncidentHistory(incidentId));
    }
}
