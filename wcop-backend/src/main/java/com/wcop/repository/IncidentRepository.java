package com.wcop.repository;

import com.wcop.entity.Incident;
import com.wcop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    // ADMIN

    List<Incident> findByStatus(String status);

    long countByStatus(String status);

    long countByAssignedOfficerIsNull();

    // OFFICER

    List<Incident> findByAssignedOfficer(User officer);

    Page<Incident> findByAssignedOfficer(User officer, Pageable pageable);

    Page<Incident> findByAssignedOfficerAndStatus(User officer, String status, Pageable pageable);

    long countByAssignedOfficerAndStatus(User officer, String status);

    // ADMIN PAGINATION

    Page<Incident> findByStatus(String status, Pageable pageable);

    Page<Incident> findByDepartmentId(Long departmentId, Pageable pageable);

    Page<Incident> findByDistrictId(Long districtId, Pageable pageable);

    Page<Incident> findByDepartmentIdAndDistrictId(Long departmentId, Long districtId, Pageable pageable);

    Page<Incident> findByStatusAndDepartmentId(String status, Long departmentId, Pageable pageable);

    Page<Incident> findByStatusAndDistrictId(String status, Long districtId, Pageable pageable);

    Page<Incident> findByStatusAndDepartmentIdAndDistrictId(String status, Long departmentId, Long districtId, Pageable pageable);

    // ANALYTICS
    @Query("""
            SELECT i.department.departmentName, COUNT(i) FROM Incident i
            GROUP BY i.department.departmentName
            """)
    List<Object[]> countIncidentsByDepartment();

    @Query("""
            SELECT i.district.districtName, COUNT(i)
            FROM Incident i
            GROUP BY i.district.districtName
            """)
    List<Object[]> countIncidentsByDistrict();
}