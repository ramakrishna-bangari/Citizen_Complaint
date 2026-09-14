package com.wcop.service.impl;

import com.wcop.dto.response.DistrictResponse;
import com.wcop.entity.District;
import com.wcop.exception.InvalidRequestException;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.repository.DistrictRepository;
import com.wcop.service.DistrictService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DistrictServiceImpl implements DistrictService {

    private final DistrictRepository districtRepository;

    // CREATE DISTRICT
    @Override
    public DistrictResponse createDistrict(String districtName, String description, Boolean active) {

        if (districtName == null) {
            throw new InvalidRequestException("District name is required.");
        }
        String name = districtName.trim();

        if (name.isBlank()) {
            throw new InvalidRequestException("District name is required.");
        }

        if (districtRepository.existsByDistrictName(name)) {
            throw new InvalidRequestException("District already exists.");
        }

        boolean districtActive = active == null || active;

        District district = District.builder().districtName(name).active(districtActive).build();

        District savedDistrict = districtRepository.save(district);

        return toResponse(savedDistrict);
    }
    // GET ALL DISTRICTS Returns both active and inactive districts. Used by Admin.

    @Override
    @Transactional(readOnly = true)
    public List<DistrictResponse> getAllDistricts() {

        return districtRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DistrictResponse> getActiveDistricts() {

        return districtRepository.findByActiveTrueOrderByDistrictNameAsc().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DistrictResponse getDistrictById(Long districtId) {

        District district = districtRepository.findById(districtId).orElseThrow(() -> new ResourceNotFoundException("District not found."));

        return toResponse(district);
    }


    @Override
    public DistrictResponse updateDistrict(Long districtId, String districtName, String description, Boolean active) {

        District district = districtRepository.findById(districtId).orElseThrow(() -> new ResourceNotFoundException("District not found."));

        if (districtName == null) {
            throw new InvalidRequestException("District name is required.");
        }

        String name = districtName.trim();

        if (name.isBlank()) {

            throw new InvalidRequestException("District name is required.");
        }


        if (!district.getDistrictName().equalsIgnoreCase(name) && districtRepository.existsByDistrictName(name)) {

            throw new InvalidRequestException("District already exists.");
        }

        district.setDistrictName(name);

        if (active != null) {
            district.setActive(active);
        }

        District updatedDistrict = districtRepository.save(district);
        return toResponse(updatedDistrict);
    }


    @Override
    public DistrictResponse activateDistrict(Long districtId) {

        District district = districtRepository.findById(districtId).orElseThrow(() -> new ResourceNotFoundException("District not found."));

        district.setActive(true);

        District updatedDistrict = districtRepository.save(district);

        return toResponse(updatedDistrict);
    }


    @Override
    public DistrictResponse deactivateDistrict(Long districtId) {

        District district = districtRepository.findById(districtId).orElseThrow(() -> new ResourceNotFoundException("District not found."));

        district.setActive(false);

        District updatedDistrict = districtRepository.save(district);

        return toResponse(updatedDistrict);
    }


    // ENTITY → RESPONSE
    private DistrictResponse toResponse(District district) {

        return DistrictResponse.builder().id(district.getId()).districtName(district.getDistrictName()).active(district.getActive()).build();
    }
}