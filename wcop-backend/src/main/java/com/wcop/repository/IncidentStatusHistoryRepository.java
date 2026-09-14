package com.wcop.repository;

import com.wcop.entity.Incident;
import com.wcop.entity.IncidentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentStatusHistoryRepository extends JpaRepository<IncidentStatusHistory, Long> {

    List<IncidentStatusHistory> findByIncidentOrderByChangedAtDesc(Incident incident);
}