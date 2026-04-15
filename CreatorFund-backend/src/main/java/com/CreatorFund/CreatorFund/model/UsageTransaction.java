package com.CreatorFund.CreatorFund.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsageTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "digital_content", nullable = false)
    private DigitalContent digitalContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distributor", nullable = false)
    private User distributor;

    @Enumerated(EnumType.STRING)
    @Column(name = "usage_type", nullable = false)
    private UsageType usageType;

    @Column(name = "usage_count", nullable = false)
    private Integer usageCount = 1;

    @Column(name = "revenue_generated", nullable = false, precision = 10, scale = 2)
    private BigDecimal revenueGenerated;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false)
    private TransactionStatus transactionStatus = TransactionStatus.RECORDED;

    
    @Column(name = "license_key")
    private String licenseKey;

    @PrePersist
    protected void onCreate() {
        this.transactionDate = LocalDateTime.now();
    }

    public enum UsageType {
        STREAM, DOWNLOAD, VIEW, SUBSCRIPTION_ACCESS
    }

    public enum TransactionStatus {
        RECORDED, VERIFIED, SETTLED
    }
}
