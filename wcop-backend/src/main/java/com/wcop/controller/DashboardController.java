package com.wcop.controller;

import com.wcop.dto.response.AdminDashboardResponse;
import com.wcop.dto.response.CitizenDashboardResponse;
import com.wcop.dto.response.DashboardAnalyticsResponse;
import com.wcop.dto.response.OfficerDashboardResponse;
import com.wcop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/officer")
    public ResponseEntity<OfficerDashboardResponse> getOfficerDashboard() {
        return ResponseEntity.ok(dashboardService.getOfficerDashboard());
    }

    @GetMapping("/citizen")
    public ResponseEntity<CitizenDashboardResponse> getCitizenDashboard() {
        return ResponseEntity.ok(dashboardService.getCitizenDashboard());
    }

    @GetMapping("/admin/analytics")
    public ResponseEntity<DashboardAnalyticsResponse> getAdminAnalytics() {
        return ResponseEntity.ok(dashboardService.getAdminAnalytics());
    }
}