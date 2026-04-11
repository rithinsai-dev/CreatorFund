package com.CreatorFund.CreatorFund.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rights_transfer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RightsTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "digital_content", nullable = false)
    private DigitalContent digitalContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_owner", nullable = false)
    private User previousOwner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_owner", nullable = false)
    private User newOwner;

    @Column(name = "transfer_date", nullable = false)
    private LocalDateTime transferDate;

    @Column(name = "transfer_percentage", nullable = false, precision = 10, scale = 2)
    private BigDecimal transferPercentage;
}
