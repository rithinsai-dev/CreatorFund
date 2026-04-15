package com.CreatorFund.CreatorFund.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "content_rights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentRights {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "digital_content", nullable = false)
    private DigitalContent digitalContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rights_owner", nullable = false)
    private User rightsOwner;

    @Column(name = "ownership_percentage", nullable = false, precision = 10, scale = 2)
    private BigDecimal ownershipPercentage;

    @Column(name = "rights_start_date", nullable = false)
    private LocalDateTime rightsStartDate;

    @Column(name = "rights_end_date")
    private LocalDateTime rightsEndDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "rights_status", nullable = false)
    private RightsStatus rightsStatus = RightsStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum RightsStatus {
        ACTIVE, EXPIRED, TRANSFERRED
    }
}
