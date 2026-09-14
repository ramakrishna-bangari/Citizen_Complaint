package com.wcop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff_profiles", uniqueConstraints = {@UniqueConstraint(name = "uk_staff_user", columnNames = "user_id"), @UniqueConstraint(name = "uk_staff_employee_id", columnNames = "employee_id")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_id", nullable = false, unique = true, length = 50)
    private String employeeId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}