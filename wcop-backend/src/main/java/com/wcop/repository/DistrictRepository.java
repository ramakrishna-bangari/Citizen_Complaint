package com.wcop.repository;

import com.wcop.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Long> {

    boolean existsByDistrictName(String districtName);

    List<District> findByActiveTrueOrderByDistrictNameAsc();
}