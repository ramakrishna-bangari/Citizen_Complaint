package com.wcop.config;

import com.wcop.entity.Department;
import com.wcop.entity.Role;
import com.wcop.entity.User;
import com.wcop.repository.DepartmentRepository;
import com.wcop.repository.RoleRepository;
import com.wcop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class InitialAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
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
        initRoles();
        initDepartments();
        initAdminUser();
    }

    private void initRoles() {
        List<String> roles = List.of("ADMIN", "OFFICER", "CITIZEN");
        for (String roleName : roles) {
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().roleName(roleName).build());
            }
        }
    }

    private void initDepartments() {
        if (departmentRepository.count() == 0) {
            List<Department> defaults = List.of(
                    Department.builder().departmentName("ENGINEERING").description("Roads, drainage, sewerage, public structures").active(true).build(),
                    Department.builder().departmentName("WATER_SUPPLY").description("Drinking water supply, pipelines, water quality").active(true).build(),
                    Department.builder().departmentName("STREET_LIGHTING_ELECTRICAL").description("Streetlights, electrical hazards").active(true).build(),
                    Department.builder().departmentName("SANITATION_SOLID_WASTE").description("Garbage collection, waste management").active(true).build(),
                    Department.builder().departmentName("PUBLIC_HEALTH").description("Vector control, mosquito breeding, sanitation").active(true).build(),
                    Department.builder().departmentName("TOWN_PLANNING").description("Encroachments, building violations").active(true).build(),
                    Department.builder().departmentName("PARKS_URBAN_BIODIVERSITY").description("Parks, urban green spaces, trees").active(true).build()
            );
            departmentRepository.saveAll(defaults);
        }
    }

    private void initAdminUser() {
        if (userRepository.existsByRole_RoleName("ADMIN")) {
            return;
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("ADMIN").build()));

        if (userRepository.existsByEmail(adminEmail.trim().toLowerCase()) || userRepository.existsByPhone(adminPhone)) {
            return;
        }

        User admin = User.builder()
                .firstName(adminFirstName)
                .lastName(adminLastName)
                .email(adminEmail.trim().toLowerCase())
                .password(passwordEncoder.encode(adminPassword))
                .phone(adminPhone)
                .address(adminAddress)
                .role(adminRole)
                .isActive(true)
                .build();

        userRepository.save(admin);
    }
}
