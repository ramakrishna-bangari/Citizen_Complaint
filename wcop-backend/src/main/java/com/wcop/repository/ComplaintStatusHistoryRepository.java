package com.wcop.repository;

import com.wcop.entity.Complaint;
import com.wcop.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, Long> {
    List<ComplaintStatusHistory> findByComplaintOrderByUpdatedAtAsc(Complaint complaint);

}