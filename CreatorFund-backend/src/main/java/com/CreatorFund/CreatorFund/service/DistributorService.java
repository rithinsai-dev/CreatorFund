package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.controller.DistributorController.PurchaseRequest;
import com.CreatorFund.CreatorFund.entity.DigitalContent;
import com.CreatorFund.CreatorFund.entity.UsageTransaction;
import com.CreatorFund.CreatorFund.entity.User;
import com.CreatorFund.CreatorFund.repository.DigitalContentRepository;
import com.CreatorFund.CreatorFund.repository.UsageTransactionRepository;
import com.CreatorFund.CreatorFund.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DistributorService {

    private final UserRepository userRepository;
    private final DigitalContentRepository digitalContentRepository;
    private final UsageTransactionRepository usageTransactionRepository;
    private final RoyaltyService royaltyService;

    @Autowired
    public DistributorService(UserRepository userRepository,
                               DigitalContentRepository digitalContentRepository,
                               UsageTransactionRepository usageTransactionRepository,
                               RoyaltyService royaltyService) {
        this.userRepository = userRepository;
        this.digitalContentRepository = digitalContentRepository;
        this.usageTransactionRepository = usageTransactionRepository;
        this.royaltyService = royaltyService;
    }

    private User resolveDistributor(Long distributorId) {
        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Distributor not found"));

        if (distributor.getRole() != User.Role.DISTRIBUTOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a distributor");
        }

        return distributor;
    }

    public Map<String, Object> getDashboardStats(Long distributorId) {
        User distributor = resolveDistributor(distributorId);
        BigDecimal totalSpent = usageTransactionRepository.sumRevenueByDistributor(distributor);
        long purchaseCount = usageTransactionRepository.countByDistributor(distributor);
        long availableContent = digitalContentRepository.countByContentStatus(DigitalContent.ContentStatus.ACTIVE);
        long ownedLicenses = purchaseCount;

        return Map.of(
                "totalSpent",            totalSpent != null ? totalSpent : BigDecimal.ZERO,
                "purchaseCount",         purchaseCount,
                "availableContentCount", availableContent,
                "ownedLicensesCount",    ownedLicenses
        );
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPurchases(Long distributorId) {
        User distributor = resolveDistributor(distributorId);
        return usageTransactionRepository.findByDistributorOrderByTransactionDateDesc(distributor).stream()
                .map(t -> Map.<String, Object>of(
                        "id",           t.getId(),
                        "contentTitle", t.getDigitalContent().getTitle(),
                        "type",         t.getDigitalContent().getContentType().name().toLowerCase(),
                        "amount",       t.getRevenueGenerated(),
                        "status",       t.getTransactionStatus().name().toLowerCase(),
                        "date",         t.getTransactionDate().toLocalDate().toString(),
                        "licenseKey",   t.getLicenseKey() != null ? t.getLicenseKey() : ""
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMarketplace() {
        return digitalContentRepository.findByContentStatus(DigitalContent.ContentStatus.ACTIVE).stream()
                .map(c -> Map.<String, Object>of(
                        "id",          c.getId(),
                        "title",       c.getTitle(),
                        "type",        c.getContentType().name().toLowerCase(),
                        "price",       c.getPrice() != null ? c.getPrice() : BigDecimal.ZERO,
                        "status",      "active",
                        "creatorName", c.getCreatedBy().getName(),
                        "salesCount",  c.getSalesCount() != null ? c.getSalesCount() : 0,
                        "targetQty",   c.getTargetQty() != null ? c.getTargetQty() : 0
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> purchaseContent(PurchaseRequest request) {
        if (request == null || request.contentId() == null || request.distributorId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content and distributor are required");
        }

        if (request.usageType() == null || request.usageType().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usage type is required");
        }

        DigitalContent content = digitalContentRepository.findById(request.contentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found"));

        if (content.getContentStatus() != DigitalContent.ContentStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is not available for purchase");
        }

        if (content.getTargetQty() != null
                && content.getSalesCount() != null
                && content.getSalesCount() >= content.getTargetQty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content has reached its sales limit");
        }

        User distributor = resolveDistributor(request.distributorId());
        UsageTransaction.UsageType usageType;

        try {
            usageType = UsageTransaction.UsageType.valueOf(request.usageType().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid usage type");
        }

        String licenseKey = "LIC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        UsageTransaction transaction = UsageTransaction.builder()
                .digitalContent(content)
                .distributor(distributor)
                .usageType(usageType)
                .usageCount(1)
                .revenueGenerated(content.getPrice() != null ? content.getPrice() : BigDecimal.ZERO)
                .transactionStatus(UsageTransaction.TransactionStatus.RECORDED)
                .licenseKey(licenseKey)
                .build();

        usageTransactionRepository.save(transaction);

        content.setSalesCount(content.getSalesCount() != null ? content.getSalesCount() + 1 : 1);
        
        // Auto-expiry logic: if targetQty is reached, archive the content
        if (content.getTargetQty() != null && content.getSalesCount() >= content.getTargetQty()) {
            content.setContentStatus(DigitalContent.ContentStatus.ARCHIVED);
        }

        digitalContentRepository.save(content);

        // Distribute royalties to rights holders
        royaltyService.calculateRoyalties(content, transaction.getRevenueGenerated());

        return Map.of("success", true, "licenseKey", licenseKey);
    }
}
