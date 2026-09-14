package com.wcop.service.impl;

import com.wcop.dto.request.CreateOfficerRequest;
import com.wcop.dto.request.UpdateOfficerRequest;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.*;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.mapper.UserMapper;
import com.wcop.repository.*;
import com.wcop.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final DistrictRepository districtRepository;
    private final StaffProfileRepository staffProfileRepository;
    private final PasswordEncoder passwordEncoder;

    // Find the OFFICER role, tolerating either "OFFICER" or "ROLE_OFFICER" naming
    private Role getOfficerRole() {

        return roleRepository.findByRoleNameIgnoreCase("OFFICER").orElseGet(() -> roleRepository.findByRoleNameIgnoreCase("ROLE_OFFICER").orElseThrow(() -> new ResourceNotFoundException("OFFICER role not found.")));
    }

    // Create a new officer account with a linked staff profile
    @Override
    @Transactional
    public UserResponse createOfficer(CreateOfficerRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        String phone = request.getPhone().trim();

        String employeeId = request.getEmployeeId().trim();

        if (userRepository.existsByEmail(email)) {
            throw new InvalidRequestException("Email is already registered.");
        }

        if (userRepository.existsByPhone(phone)) {
            throw new InvalidRequestException("Phone number is already registered.");
        }

        if (staffProfileRepository.existsByEmployeeId(employeeId)) {
            throw new InvalidRequestException("Employee ID is already registered.");
        }

        Role officerRole = getOfficerRole();

        Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() -> new ResourceNotFoundException("Department not found."));

        District district = districtRepository.findById(request.getDistrictId()).orElseThrow(() -> new ResourceNotFoundException("District not found."));

        if (!Boolean.TRUE.equals(department.getActive())) {
            throw new InvalidRequestException("Department is inactive.");
        }

        if (!Boolean.TRUE.equals(district.getActive())) {
            throw new InvalidRequestException("District is inactive.");
        }

        boolean officerExists = staffProfileRepository.existsByDistrictAndDepartmentAndActive(district, department, true);

        if (officerExists) {
            throw new InvalidRequestException("An active officer already exists for this department and district.");
        }

        User officer = User.builder().firstName(request.getFirstName().trim()).lastName(request.getLastName().trim()).email(email).password(passwordEncoder.encode(request.getPassword())).phone(phone).address(request.getAddress() == null ? null : request.getAddress().trim()).role(officerRole).isActive(true).build();

        User savedOfficer = userRepository.save(officer);

        log.info("Officer created: id={}, email={}", savedOfficer.getId(), savedOfficer.getEmail());

        StaffProfile staffProfile = StaffProfile.builder().user(savedOfficer).employeeId(employeeId).department(department).district(district).active(true).build();

        StaffProfile savedStaffProfile = staffProfileRepository.save(staffProfile);

        savedOfficer.setStaffProfile(savedStaffProfile);

        return UserMapper.toUserResponse(savedOfficer);
    }

    // List all officers with their staff profiles attached
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getOfficers() {

        Role officerRole = getOfficerRole();

        List<User> officers = userRepository.findByRole(officerRole);

        return officers.stream().map(officer -> {

            StaffProfile staffProfile = staffProfileRepository.findByUserId(officer.getId()).orElse(null);

            officer.setStaffProfile(staffProfile);

            return UserMapper.toUserResponse(officer);

        }).toList();
    }

    // Fetch a single officer by id
    @Override
    @Transactional(readOnly = true)
    public UserResponse getOfficerById(Long officerId) {

        User officer = userRepository.findById(officerId).orElseThrow(() -> new ResourceNotFoundException("Officer not found."));

        if (officer.getRole() == null || !isOfficerRole(officer.getRole().getRoleName())) {
            throw new InvalidRequestException("Selected user is not an officer.");
        }

        StaffProfile staffProfile = staffProfileRepository.findByUserId(officerId).orElseThrow(() -> new ResourceNotFoundException("Officer staff profile not found."));

        officer.setStaffProfile(staffProfile);

        return UserMapper.toUserResponse(officer);
    }

    // Update/transfer an officer's department, district, and active status
    @Override
    @Transactional
    public UserResponse updateOfficer(Long officerId, UpdateOfficerRequest request) {

        User officer = userRepository.findById(officerId).orElseThrow(() -> new ResourceNotFoundException("Officer not found."));

        if (officer.getRole() == null || !isOfficerRole(officer.getRole().getRoleName())) {
            throw new InvalidRequestException("Selected user is not an officer.");
        }

        StaffProfile staffProfile = staffProfileRepository.findByUserId(officerId).orElseThrow(() -> new ResourceNotFoundException("Officer staff profile not found."));

        Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() -> new ResourceNotFoundException("Department not found."));

        District district = districtRepository.findById(request.getDistrictId()).orElseThrow(() -> new ResourceNotFoundException("District not found."));

        if (!Boolean.TRUE.equals(department.getActive())) {
            throw new InvalidRequestException("Department is inactive.");
        }

        if (!Boolean.TRUE.equals(district.getActive())) {
            throw new InvalidRequestException("District is inactive.");
        }

        if (Boolean.TRUE.equals(request.getActive())) {

            boolean anotherOfficerExists = staffProfileRepository.existsByDistrictAndDepartmentAndActiveAndIdNot(district, department, true, staffProfile.getId());

            if (anotherOfficerExists) {
                throw new InvalidRequestException("An active officer already exists for this department and district.");
            }
        }

        staffProfile.setDepartment(department);

        staffProfile.setDistrict(district);

        staffProfile.setActive(request.getActive());

        officer.setIsActive(request.getActive());

        staffProfileRepository.save(staffProfile);

        userRepository.save(officer);

        log.info("Officer updated: id={}, active={}", officer.getId(), request.getActive());

        officer.setStaffProfile(staffProfile);

        return UserMapper.toUserResponse(officer);
    }

    // Check whether a role name represents the OFFICER role, tolerating a ROLE_ prefix
    private boolean isOfficerRole(String roleName) {

        if (roleName == null) {
            return false;
        }

        String normalized = roleName.trim().toUpperCase();

        if (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring(5);
        }

        return "OFFICER".equals(normalized);
    }
}