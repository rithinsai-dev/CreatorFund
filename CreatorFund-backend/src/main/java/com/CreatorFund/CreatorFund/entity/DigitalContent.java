package com.CreatorFund.CreatorFund.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "digital_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private ContentType contentType;

    @Lob
    private String description;

    @Column(name = "published_date")
    private java.time.LocalDateTime publishedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_status", nullable = false)
    private ContentStatus contentStatus = ContentStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    // Price for marketplace display
    @Column(precision = 10, scale = 2)
    private java.math.BigDecimal price;

    // Sales count for marketplace
    @Column(name = "sales_count")
    private Integer salesCount = 0;

    // Target quantity for distribution
    @Column(name = "target_qty")
    private Integer targetQty;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum ContentType {
        MUSIC, VIDEO, ARTICLE, COURSE, PODCAST
    }

    public enum ContentStatus {
        DRAFT, REGISTERED, ACTIVE, INACTIVE, ARCHIVED
    }
}
