package com.wcop.repository;

import com.wcop.entity.Department;
import com.wcop.entity.District;
import com.wcop.entity.StaffProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {

    Optional<StaffProfile> findByUserId(Long userId);

    boolean existsByEmployeeId(String employeeId);

    List<StaffProfile> findByDepartmentAndDistrictAndActiveTrue(Department department, District district);

    List<StaffProfile> findByDistrictAndActiveTrue(District district);

    boolean existsByDistrictAndDepartmentAndActive(District district, Department department, Boolean active);
    boolean existsByDistrictAndDepartmentAndActiveAndIdNot(District district, Department department, Boolean active, Long id);
}
