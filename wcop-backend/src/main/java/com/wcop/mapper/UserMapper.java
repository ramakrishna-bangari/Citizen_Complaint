package com.wcop.mapper;

import com.wcop.dto.response.StaffProfileResponse;
import com.wcop.dto.response.UserResponse;
import com.wcop.entity.StaffProfile;
import com.wcop.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toUserResponse(User user) {

        if (user == null) {
            return null;
        }

        String roleName = null;
        if (user.getRole() != null) {
            roleName = user.getRole().getRoleName();

            if (roleName != null) {
                roleName = roleName.trim();

                if (roleName.startsWith("ROLE_")) {
                    roleName = roleName.substring(5);
                }
                roleName = roleName.toUpperCase();
            }
        }

        StaffProfileResponse staffProfileResponse = null;

        StaffProfile staffProfile = user.getStaffProfile();

        // Citizens normally do not have a StaffProfile. staffProfileResponse remains null for CITIZEN users.

        if (staffProfile != null) {
            staffProfileResponse = StaffProfileResponse.builder().employeeId(staffProfile.getEmployeeId()).department(staffProfile.getDepartment() != null ? staffProfile.getDepartment().getDepartmentName() : null).district(staffProfile.getDistrict() != null ? staffProfile.getDistrict().getDistrictName() : null).active(staffProfile.getActive()).build();
        }

        return UserResponse.builder().id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName()).email(user.getEmail()).phone(user.getPhone()).address(user.getAddress()).role(roleName).isActive(user.getIsActive()).staffProfile(staffProfileResponse).build();
    }
}