package com.CreatorFund.CreatorFund.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "royalty_payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoyaltyPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "royalty_calculation", nullable = false)
    private RoyaltyCalculation royaltyCalculation;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "payment_reference", unique = true, nullable = false)
    private String paymentReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.INITIATED;

    public enum PaymentStatus {
        INITIATED, SUCCESS, FAILED
    }
}
