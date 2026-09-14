package com.wcop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_classifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIClassification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false, unique = true)
    private Complaint complaint;

    @Column(name = "predicted_department", nullable = false, length = 100)
    private String predictedDepartment;

    @Column(name = "predicted_priority", nullable = false, length = 20)
    private String predictedPriority;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "ai_response", length = 2000)
    private String aiResponse;

    @Column(name = "classified_at", nullable = false, updatable = false)
    private LocalDateTime classifiedAt;

    @PrePersist
    public void prePersist() {
        classifiedAt = LocalDateTime.now();
    }

}