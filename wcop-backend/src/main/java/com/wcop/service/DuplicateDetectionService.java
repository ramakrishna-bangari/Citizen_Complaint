package com.wcop.service;

import com.wcop.entity.Complaint;
import com.wcop.entity.Department;
import com.wcop.entity.District;

public interface DuplicateDetectionService {

    Complaint findDuplicate(District district, Department department, String problemType, Double latitude, Double longitude, String description);
}