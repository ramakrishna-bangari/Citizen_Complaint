package com.wcop.repository;

import com.wcop.entity.AIClassification;
import com.wcop.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AIClassificationRepository extends JpaRepository<AIClassification, Long> {
    Optional<AIClassification> findByComplaint(Complaint complaint);

}