package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.entity.*;
import com.CreatorFund.CreatorFund.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DigitalContentRepository digitalContentRepository;
    private final UsageTransactionRepository usageTransactionRepository;
    private final RoyaltyCalculationRepository royaltyCalculationRepository;
    private final RoyaltyPaymentRepository royaltyPaymentRepository;

    @Autowired
    public AdminService(UserRepository userRepository,
                        DigitalContentRepository digitalContentRepository,
                        UsageTransactionRepository usageTransactionRepository,
                        RoyaltyCalculationRepository royaltyCalculationRepository,
                        RoyaltyPaymentRepository royaltyPaymentRepository) {
        this.userRepository = userRepository;
        this.digitalContentRepository = digitalContentRepository;
        this.usageTransactionRepository = usageTransactionRepository;
        this.royaltyCalculationRepository = royaltyCalculationRepository;
        this.royaltyPaymentRepository = royaltyPaymentRepository;
    }

    private static final BigDecimal PLATFORM_FEE_RATE = new BigDecimal("0.03");

    public Map<String, Object> getDashboardStats() {
        BigDecimal totalRevenue = usageTransactionRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        // Platform earns 3% of all transaction revenue
        BigDecimal platformRevenue = totalRevenue.multiply(PLATFORM_FEE_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        long activeCreators = userRepository.countByRole(User.Role.CREATOR);
        long pendingRequests = digitalContentRepository.countByContentStatus(DigitalContent.ContentStatus.DRAFT);

        return Map.of(
                "platformRevenue",        platformRevenue,
                "totalTransactionRevenue", totalRevenue,
                "activeCreators",          activeCreators,
                "pendingRequests",         pendingRequests
        );
    }

    public List<Map<String, Object>> getAllCreators() {
        return userRepository.findByRole(User.Role.CREATOR).stream()
                .map(u -> Map.<String, Object>of(
                        "id",           u.getId(),
                        "name",         u.getName(),
                        "email",        u.getEmail(),
                        "status",       "active",
                        "totalRevenue", 0,
                        "joined",       u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().toString() : ""
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPendingRequests() {
        return digitalContentRepository.findByContentStatus(DigitalContent.ContentStatus.DRAFT).stream()
                .map(c -> Map.<String, Object>of(
                        "id",           c.getId(),
                        "contentTitle", c.getTitle(),
                        "creatorName",  c.getCreatedBy().getName(),
                        "type",         c.getContentType().name().toLowerCase(),
                        "date",         c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate().toString() : "",
                        "status",       "pending"
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean approveContent(Long contentId) {
        return digitalContentRepository.findById(contentId).map(c -> {
            c.setContentStatus(DigitalContent.ContentStatus.ACTIVE);
            digitalContentRepository.save(c);
            return true;
        }).orElse(false);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCreatorRevenueStats() {
        return userRepository.findByRole(User.Role.CREATOR).stream()
                .map(creator -> {
                    BigDecimal totalEarnings = royaltyCalculationRepository.sumCalculatedAmountByRoyaltyOwner(creator);
                    BigDecimal pendingPayout = royaltyCalculationRepository.sumCalculatedAmountByRoyaltyOwnerAndCalculationStatus(
                            creator, RoyaltyCalculation.CalculationStatus.CALCULATED);

                    return Map.<String, Object>of(
                            "id",            creator.getId(),
                            "name",          creator.getName(),
                            "totalEarnings", totalEarnings != null ? totalEarnings : BigDecimal.ZERO,
                            "pendingPayout", pendingPayout != null ? pendingPayout : BigDecimal.ZERO
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> processPayout(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator not found"));

        if (creator.getRole() != User.Role.CREATOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a creator");
        }

        List<RoyaltyCalculation> pending = royaltyCalculationRepository.findByRoyaltyOwnerAndCalculationStatus(
                creator, RoyaltyCalculation.CalculationStatus.CALCULATED);

        if (pending.isEmpty()) {
            return Map.of("success", false, "message", "No pending royalties found");
        }

        // Process each calculation into a payment
        for (RoyaltyCalculation rc : pending) {
            RoyaltyPayment payment = RoyaltyPayment.builder()
                    .royaltyCalculation(rc)
                    .paidAmount(rc.getCalculatedAmount())
                    .paymentDate(LocalDateTime.now())
                    .paymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .paymentStatus(RoyaltyPayment.PaymentStatus.SUCCESS)
                    .build();

            royaltyPaymentRepository.save(payment);
            rc.setCalculationStatus(RoyaltyCalculation.CalculationStatus.APPROVED);
            royaltyCalculationRepository.save(rc);
        }

        return Map.of("success", true, "processedCount", pending.size());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentTransactions() {
        return usageTransactionRepository.findTop20ByOrderByTransactionDateDesc().stream()
                .map(t -> Map.<String, Object>of(
                        "id",              t.getId(),
                        "contentTitle",    t.getDigitalContent().getTitle(),
                        "distributorName", t.getDistributor().getName(),
                        "amount",          t.getRevenueGenerated(),
                        "type",            t.getUsageType().name().toLowerCase(),
                        "status",          t.getTransactionStatus().name().toLowerCase(),
                        "date",            t.getTransactionDate().toLocalDate().toString()
                ))
                .collect(Collectors.toList());
    }
}
