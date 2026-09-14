package com.wcop.repository;

import com.wcop.entity.Department;
import com.wcop.entity.District;
import com.wcop.entity.StaffProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {
    // USER
    Optional<StaffProfile> findByUserId(Long userId);

    boolean existsByEmployeeId(String employeeId);

    // OFFICER BY DEPARTMENT + DISTRICT
    List<StaffProfile> findByDepartmentAndDistrictAndActiveTrue(Department department, District district);

    // OFFICER BY DISTRICT
    List<StaffProfile> findByDistrictAndActiveTrue(District district);

    // ACTIVE OFFICER CHECK
    boolean existsByDistrictAndDepartmentAndActive(District district, Department department, Boolean active);
    boolean existsByDistrictAndDepartmentAndActiveAndIdNot(District district, Department department, Boolean active, Long id);
}