package com.wcop.service;

import com.wcop.dto.response.AdminDashboardResponse;
import com.wcop.dto.response.CitizenDashboardResponse;
import com.wcop.dto.response.DashboardAnalyticsResponse;
import com.wcop.dto.response.OfficerDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();

    OfficerDashboardResponse getOfficerDashboard();

    CitizenDashboardResponse getCitizenDashboard();

    DashboardAnalyticsResponse getAdminAnalytics();
}