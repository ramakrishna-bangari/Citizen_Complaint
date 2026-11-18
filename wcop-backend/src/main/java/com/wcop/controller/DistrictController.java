package com.wcop.controller;

import com.wcop.dto.request.CreateDistrictRequest;
import com.wcop.dto.response.DistrictResponse;
import com.wcop.service.DistrictService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictService districtService;

    @PostMapping
    public ResponseEntity<DistrictResponse> createDistrict(@RequestBody CreateDistrictRequest request) {

        DistrictResponse response = districtService.createDistrict(request.getDistrictName(), request.getDescription(), request.getActive());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DistrictResponse>> getAllDistricts() {

        return ResponseEntity.ok(districtService.getAllDistricts());
    }

    @GetMapping("/active")
    public ResponseEntity<List<DistrictResponse>> getActiveDistricts() {

        return ResponseEntity.ok(districtService.getActiveDistricts());
    }

    @GetMapping("/{districtId}")
    public ResponseEntity<DistrictResponse> getDistrictById(@PathVariable Long districtId) {

        return ResponseEntity.ok(districtService.getDistrictById(districtId));
    }

    @PutMapping("/{districtId}")
    public ResponseEntity<DistrictResponse> updateDistrict(@PathVariable Long districtId, @RequestBody CreateDistrictRequest request) {

        return ResponseEntity.ok(districtService.updateDistrict(districtId, request.getDistrictName(), request.getDescription(), request.getActive()));
    }

    @PatchMapping("/{districtId}/activate")
    public ResponseEntity<DistrictResponse> activateDistrict(@PathVariable Long districtId) {

        return ResponseEntity.ok(districtService.activateDistrict(districtId));
    }

    @PatchMapping("/{districtId}/deactivate")
    public ResponseEntity<DistrictResponse> deactivateDistrict(@PathVariable Long districtId) {

        return ResponseEntity.ok(districtService.deactivateDistrict(districtId));
    }
}
