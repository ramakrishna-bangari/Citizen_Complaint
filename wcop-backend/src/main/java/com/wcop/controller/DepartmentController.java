package com.wcop.controller;

import com.wcop.dto.request.CreateDepartmentRequest;
import com.wcop.dto.request.UpdateDepartmentRequest;
import com.wcop.dto.response.DepartmentResponse;
import com.wcop.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    // ADMIN - CREATE
    @PostMapping
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(request));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {

        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // GET BY ID

    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long departmentId) {

        return ResponseEntity.ok(departmentService.getDepartmentById(departmentId));
    }

    // ADMIN - UPDATE
    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long departmentId, @Valid @RequestBody UpdateDepartmentRequest request) {

        return ResponseEntity.ok(departmentService.updateDepartment(departmentId, request));
    }
}