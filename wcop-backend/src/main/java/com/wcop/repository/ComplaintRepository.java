package com.wcop.repository;

import com.wcop.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // CITIZEN

    List<Complaint> findByUser(User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, String status);

    long countByUserAndPriority(User user, String priority);

    // OFFICER
    // An officer can see:
    // 1. Complaints directly assigned to him
    // OR
    // 2. Complaints belonging to an incident assigned to him

    @Query("""
            SELECT c FROM Complaint c WHERE c.assignedOfficer = :officer
            OR c.incident.assignedOfficer = :officer
            ORDER BY c.createdAt DESC
            """)
    List<Complaint> findByAssignedOfficer(@Param("officer") User officer);


    @Query("""
            SELECT c FROM Complaint c WHERE c.assignedOfficer = :officer
            OR c.incident.assignedOfficer = :officer
            """)
    Page<Complaint> findByAssignedOfficer(@Param("officer") User officer, Pageable pageable);


    @Query("""
            SELECT c FROM Complaint c
            WHERE ( c.assignedOfficer = :officer OR c.incident.assignedOfficer = :officer )
             AND c.status = :status
            """)
    Page<Complaint> findByAssignedOfficerAndStatus(@Param("officer") User officer, @Param("status") String status, Pageable pageable);


    @Query("""
            SELECT c
            FROM Complaint c
            WHERE ( c.assignedOfficer = :officer OR c.incident.assignedOfficer = :officer
                  )
              AND c.priority = :priority
            """)
    Page<Complaint> findByAssignedOfficerAndPriority(@Param("officer") User officer, @Param("priority") String priority, Pageable pageable);


    @Query("""
            SELECT c
            FROM Complaint c
            WHERE (
                    c.assignedOfficer = :officer
                    OR c.incident.assignedOfficer = :officer
                  )
              AND c.status = :status
              AND c.priority = :priority
            """)
    Page<Complaint> findByAssignedOfficerAndStatusAndPriority(@Param("officer") User officer, @Param("status") String status, @Param("priority") String priority, Pageable pageable);


    @Query("""
            SELECT COUNT(c)
            FROM Complaint c
            WHERE c.assignedOfficer = :officer
               OR c.incident.assignedOfficer = :officer
            """)
    long countByAssignedOfficer(@Param("officer") User officer);


    @Query("""
            SELECT COUNT(c)
            FROM Complaint c
            WHERE (
                    c.assignedOfficer = :officer
                    OR c.incident.assignedOfficer = :officer
                  )
              AND c.status = :status
            """)
    long countByAssignedOfficerAndStatus(@Param("officer") User officer, @Param("status") String status);


    @Query("""
            SELECT COUNT(c)
            FROM Complaint c
            WHERE (
                    c.assignedOfficer = :officer
                    OR c.incident.assignedOfficer = :officer
                  )
              AND c.priority = :priority
            """)
    long countByAssignedOfficerAndPriority(@Param("officer") User officer, @Param("priority") String priority);


    // =========================================================
    // ADMIN / GENERAL
    // =========================================================

    List<Complaint> findByDepartment(Department department);

    List<Complaint> findByDistrictAndDepartment(District district, Department department);

    List<Complaint> findByIncident(Incident incident);

    List<Complaint> findByStatus(String status);

    List<Complaint> findByPriority(String priority);

    long countByStatus(String status);

    long countByPriority(String priority);

    long countByAssignedOfficerIsNull();

    long countByAssignedOfficerIsNotNull();


    // =========================================================
    // ADMIN PAGINATION
    // =========================================================

    Page<Complaint> findByStatus(String status, Pageable pageable);

    Page<Complaint> findByPriority(String priority, Pageable pageable);

    Page<Complaint> findByStatusAndPriority(String status, String priority, Pageable pageable);


    // =========================================================
    // ANALYTICS
    // =========================================================

    @Query("""
            SELECT c.department.departmentName, COUNT(c)
            FROM Complaint c
            GROUP BY c.department.departmentName
            """)
    List<Object[]> countComplaintsByDepartment();


    @Query("""
            SELECT c.district.districtName, COUNT(c)
            FROM Complaint c
            GROUP BY c.district.districtName
            """)
    List<Object[]> countComplaintsByDistrict();


    @Query("""
            SELECT c.priority, COUNT(c)
            FROM Complaint c
            GROUP BY c.priority
            """)
    List<Object[]> countComplaintsByPriority();
}