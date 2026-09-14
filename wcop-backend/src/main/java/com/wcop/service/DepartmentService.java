package com.wcop.service;

import com.wcop.dto.request.CreateDepartmentRequest;
import com.wcop.dto.request.UpdateDepartmentRequest;
import com.wcop.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(CreateDepartmentRequest request);

    List<DepartmentResponse> getAllDepartments();

    List<DepartmentResponse> getActiveDepartments();

    DepartmentResponse getDepartmentById(Long departmentId);

    DepartmentResponse updateDepartment(Long departmentId, UpdateDepartmentRequest request);
}