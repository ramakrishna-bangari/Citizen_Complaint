package com.wcop.service.impl;

import com.wcop.dto.request.CreateDepartmentRequest;
import com.wcop.dto.request.UpdateDepartmentRequest;
import com.wcop.dto.response.DepartmentResponse;
import com.wcop.entity.Department;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.repository.DepartmentRepository;
import com.wcop.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    // Create a new department, rejecting duplicate names (case-insensitive)
    @Override
    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {

        String departmentName = request.getDepartmentName().trim();

        if (departmentRepository.existsByDepartmentNameIgnoreCase(departmentName)) {
            throw new InvalidRequestException("Department already exists.");
        }

        Department department = Department.builder().departmentName(departmentName).description(request.getDescription() == null ? null : request.getDescription().trim()).active(true).build();

        Department saved = departmentRepository.save(department);

        return toResponse(saved);
    }

    // Return all departments
    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAllByOrderByDepartmentNameAsc().stream().map(this::toResponse).toList();
    }

    // Return only active departments
    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getActiveDepartments() {

        return departmentRepository.findByActiveTrueOrderByDepartmentNameAsc().stream().map(this::toResponse).toList();
    }

    // Fetch a single department by id, or throw if not found
    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long departmentId) {

        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("Department not found."));

        return toResponse(department);
    }

    // Update a department's name/description, rejecting a name same  with another department
    @Override
    public DepartmentResponse updateDepartment(Long departmentId, UpdateDepartmentRequest request) {

        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("Department not found."));

        String newName = request.getDepartmentName().trim();

        boolean nameChanged = !department.getDepartmentName().equalsIgnoreCase(newName);

        if (nameChanged && departmentRepository.existsByDepartmentNameIgnoreCaseAndIdNot(newName, departmentId)) {
            throw new InvalidRequestException("Another department already uses this name.");
        }

        department.setDepartmentName(newName);

        department.setDescription(request.getDescription() == null ? null : request.getDescription().trim());

        Department updated = departmentRepository.save(department);

        return toResponse(updated);
    }

    // Map entity to response DTO
    private DepartmentResponse toResponse(Department department) {

        return DepartmentResponse.builder().id(department.getId()).departmentName(department.getDepartmentName()).description(department.getDescription()).createdAt(department.getCreatedAt()).updatedAt(department.getUpdatedAt()).build();
    }
}