package com.wcop.config;

import com.wcop.entity.Role;
import com.wcop.entity.User;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.repository.RoleRepository;
import com.wcop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.first-name}")
    private String adminFirstName;

    @Value("${app.admin.last-name}")
    private String adminLastName;

    @Value("${app.admin.phone}")
    private String adminPhone;

    @Value("${app.admin.address}")
    private String adminAddress;

    @Override
    public void run(String... args) {

        if (userRepository.existsByRole_RoleName("ADMIN")) {
            System.out.println("ADMIN user already exists. Skipping initialization.");
            return;
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN").orElseThrow(() -> new ResourceNotFoundException("ADMIN role not found."));


        if (userRepository.existsByEmail(adminEmail.trim().toLowerCase())) {
            System.out.println("Admin email already belongs to another user.");
            return;
        }

        if (userRepository.existsByPhone(adminPhone)) {
            System.out.println("Admin phone already belongs to another user.");
            return;
        }

        User admin = User.builder().firstName(adminFirstName).lastName(adminLastName).email(adminEmail.trim().toLowerCase()).password(passwordEncoder.encode(adminPassword)).phone(adminPhone).address(adminAddress).role(adminRole).isActive(true).build();

        userRepository.save(admin);
        System.out.println("Initial ADMIN user created successfully.");
    }
}