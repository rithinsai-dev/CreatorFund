package com.CreatorFund.CreatorFund.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "organization_name")
    private String organizationName;

    // Backward/alternate column name support (some DBs use `organizationname` instead of `organization_name`).
    // Keep both columns in sync so either schema variant works.
    @Column(name = "organizationname")
    private String organizationNameLegacy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        syncOrganizationNameColumns();
    }

    @PreUpdate
    protected void onUpdate() {
        syncOrganizationNameColumns();
    }

    private void syncOrganizationNameColumns() {
        if (this.organizationName != null && !this.organizationName.isBlank()) {
            this.organizationNameLegacy = this.organizationName;
            return;
        }
        if (this.organizationNameLegacy != null && !this.organizationNameLegacy.isBlank()) {
            this.organizationName = this.organizationNameLegacy;
        }
    }

    public enum Role {
        ADMIN, CREATOR, DISTRIBUTOR
    }
}
