package com.CreatorFund.CreatorFund.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "royalty_calculation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoyaltyCalculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "digital_content", nullable = false)
    private DigitalContent digitalContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "royalty_owner_id", nullable = false)
    private User royaltyOwner;

    @Column(name = "total_revenue", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalRevenue;

    @Column(name = "royalty_percentage", nullable = false, precision = 10, scale = 2)
    private BigDecimal royaltyPercentage;

    @Column(name = "calculated_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal calculatedAmount;

    @Column(name = "calculation_date", nullable = false)
    private LocalDateTime calculationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "calculation_status", nullable = false)
    private CalculationStatus calculationStatus = CalculationStatus.PENDING;

    public enum CalculationStatus {
        PENDING, CALCULATED, APPROVED
    }
}
