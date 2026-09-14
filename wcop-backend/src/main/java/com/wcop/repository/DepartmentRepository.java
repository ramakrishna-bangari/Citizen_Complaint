package com.wcop.repository;

import com.wcop.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentNameIgnoreCase(String departmentName);

    boolean existsByDepartmentNameIgnoreCase(String departmentName);

    boolean existsByDepartmentNameIgnoreCaseAndIdNot(String departmentName, Long id);

    List<Department> findByActiveTrueOrderByDepartmentNameAsc();

    List<Department> findAllByOrderByDepartmentNameAsc();
}