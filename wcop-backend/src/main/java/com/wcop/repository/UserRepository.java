package com.wcop.repository;

import com.wcop.entity.Role;
import com.wcop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by phone
    Optional<User> findByPhone(String phone);

    // Check whether email already exists
    boolean existsByEmail(String email);

    // Check whether phone already exists
    boolean existsByPhone(String phone);

    // Check whether a user exists with a particular role
    boolean existsByRole_RoleName(String roleName);

    // Get all users having a particular Role
    List<User> findByRole(Role role);
}