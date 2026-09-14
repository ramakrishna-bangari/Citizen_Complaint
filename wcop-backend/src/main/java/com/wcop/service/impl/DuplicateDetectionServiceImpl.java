package com.wcop.service.impl;

import com.wcop.entity.Complaint;
import com.wcop.entity.Department;
import com.wcop.entity.District;
import com.wcop.repository.ComplaintRepository;
import com.wcop.service.DuplicateDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DuplicateDetectionServiceImpl implements DuplicateDetectionService {

    private final ComplaintRepository complaintRepository;

    @Override
    @Transactional(readOnly = true)
    public Complaint findDuplicate(District district, Department department, String problemType, Double latitude, Double longitude, String description) {

        List<Complaint> complaints = complaintRepository.findByDistrictAndDepartment(district, department);

        Complaint bestMatch = null;
        double highestSimilarity = 0.0;

        double radius = getDuplicateRadius(problemType);

        for (Complaint complaint : complaints) {

            // Same problem type is required
            if (complaint.getProblemType() == null || !complaint.getProblemType().equalsIgnoreCase(problemType)) {
                continue;
            }

            // Coordinates are required
            if (complaint.getLatitude() == null || complaint.getLongitude() == null || latitude == null || longitude == null) {
                continue;
            }

            // Calculate geographical distance
            double distance = calculateDistance(latitude, longitude, complaint.getLatitude(), complaint.getLongitude());

            // Too far away
            if (distance > radius) {
                continue;
            }

            // Compare descriptions
            double similarity = calculateSimilarity(description, complaint.getDescription());

            if (similarity >= 0.60 && similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = complaint;
            }
        }

        return bestMatch;
    }

    // DUPLICATE RADIUS (in meters), per problem type.

    private double getDuplicateRadius(String problemType) {

        Map<String, Double> radiusMap = Map.ofEntries(

                // ENGINEERING - roads
                Map.entry("POTHOLE", 200.0), Map.entry("ROAD_DAMAGE", 200.0), Map.entry("ROAD_COLLAPSE", 150.0),

                // ENGINEERING - drainage & sewerage
                Map.entry("DRAIN_BLOCKAGE", 300.0), Map.entry("DRAINAGE_OVERFLOW", 300.0), Map.entry("SEWER_BLOCKAGE", 300.0), Map.entry("SEWAGE_OVERFLOW", 300.0), Map.entry("MANHOLE_PROBLEM", 150.0),

                // ENGINEERING - general public infrastructure
                Map.entry("PUBLIC_INFRASTRUCTURE_DAMAGE", 300.0),

                // WATER_SUPPLY
                Map.entry("WATER_LEAK", 500.0), Map.entry("PIPELINE_DAMAGE", 500.0), Map.entry("WATER_SUPPLY_FAILURE", 1000.0), Map.entry("WATER_QUALITY_PROBLEM", 1000.0),

                // STREET_LIGHTING_ELECTRICAL
                Map.entry("STREETLIGHT_FAILURE", 100.0), Map.entry("ELECTRICAL_HAZARD", 100.0), Map.entry("ELECTRICAL_INFRASTRUCTURE_DAMAGE", 100.0),

                // SANITATION_SOLID_WASTE
                Map.entry("GARBAGE_ACCUMULATION", 200.0), Map.entry("ILLEGAL_DUMPING", 200.0), Map.entry("WASTE_COLLECTION_FAILURE", 300.0),

                // PUBLIC_HEALTH
                Map.entry("PUBLIC_HEALTH_HAZARD", 500.0), Map.entry("MOSQUITO_BREEDING_HAZARD", 500.0),

                // TOWN_PLANNING
                Map.entry("DAMAGED_PUBLIC_BUILDING", 150.0), Map.entry("UNSAFE_PUBLIC_STRUCTURE", 150.0), Map.entry("UNAUTHORIZED_CONSTRUCTION", 150.0), Map.entry("BUILDING_ENCROACHMENT", 150.0),

                // PARKS_URBAN_BIODIVERSITY
                Map.entry("PARK_DAMAGE", 150.0), Map.entry("PLAYGROUND_DAMAGE", 150.0), Map.entry("GREEN_SPACE_PROBLEM", 150.0), Map.entry("TREE_HAZARD", 150.0));

        if (problemType == null) {
            return 500.0;
        }

        return radiusMap.getOrDefault(problemType.toUpperCase(), 500.0);
    }

    private double calculateDistance(double latitude1, double longitude1, double latitude2, double longitude2) {

        final double earthRadius = 6371000.0;

        double latitudeDifference = Math.toRadians(latitude2 - latitude1);
        double longitudeDifference = Math.toRadians(longitude2 - longitude1);

        double a = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) + Math.cos(Math.toRadians(latitude1)) * Math.cos(Math.toRadians(latitude2)) * Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    private double calculateSimilarity(String description1, String description2) {

        if (description1 == null || description2 == null) {
            return 0.0;
        }

        String first = normalize(description1);
        String second = normalize(description2);

        if (first.equals(second)) {
            return 1.0;
        }

        String[] firstWords = first.split("\\s+");
        String[] secondWords = second.split("\\s+");

        int matchingWords = 0;
        int totalRelevantWords = 0;

        for (String word : firstWords) {

            if (word.length() < 3) {
                continue;
            }

            totalRelevantWords++;

            for (String otherWord : secondWords) {

                if (word.equals(otherWord)) {
                    matchingWords++;
                    break;
                }
            }
        }

        if (totalRelevantWords == 0) {
            return 0.0;
        }

        return (double) matchingWords / totalRelevantWords;
    }

    private String normalize(String text) {

        return text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }
}