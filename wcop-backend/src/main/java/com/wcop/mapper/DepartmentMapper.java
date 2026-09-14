package com.wcop.mapper;

import com.wcop.dto.response.DepartmentResponse;
import com.wcop.entity.Department;

public final class DepartmentMapper {

    private DepartmentMapper() {
    }

    public static DepartmentResponse toDepartmentResponse(Department department) {

        if (department == null) {
            return null;
        }

        return DepartmentResponse.builder().id(department.getId()).departmentName(department.getDepartmentName()).description(department.getDescription()).createdAt(department.getCreatedAt()).updatedAt(department.getUpdatedAt()).build();
    }
}