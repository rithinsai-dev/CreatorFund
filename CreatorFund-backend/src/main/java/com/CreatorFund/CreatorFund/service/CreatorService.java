package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.controller.CreatorController.SubmitContentRequest;
import com.CreatorFund.CreatorFund.entity.ContentRights;
import com.CreatorFund.CreatorFund.entity.DigitalContent;
import com.CreatorFund.CreatorFund.entity.RoyaltyCalculation;
import com.CreatorFund.CreatorFund.entity.User;
import com.CreatorFund.CreatorFund.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CreatorService {

    private final DigitalContentRepository digitalContentRepository;
    private final UsageTransactionRepository usageTransactionRepository;
    private final UserRepository userRepository;
    private final ContentRightsRepository contentRightsRepository;
    private final RoyaltyCalculationRepository royaltyCalculationRepository;

    @Autowired
    public CreatorService(DigitalContentRepository digitalContentRepository,
                          UsageTransactionRepository usageTransactionRepository,
                          UserRepository userRepository,
                          ContentRightsRepository contentRightsRepository,
                          RoyaltyCalculationRepository royaltyCalculationRepository) {
        this.digitalContentRepository = digitalContentRepository;
        this.usageTransactionRepository = usageTransactionRepository;
        this.userRepository = userRepository;
        this.contentRightsRepository = contentRightsRepository;
        this.royaltyCalculationRepository = royaltyCalculationRepository;
    }

    private User resolveCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator not found"));

        if (creator.getRole() != User.Role.CREATOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a creator");
        }

        return creator;
    }

    private DigitalContent.ContentType parseContentType(String type) {
        try {
            return DigitalContent.ContentType.valueOf(type.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid content type");
        }
    }

    public Map<String, Object> getStats(Long creatorId) {
        User creator = resolveCreator(creatorId);
        List<DigitalContent> myContent = digitalContentRepository.findByCreatedBy(creator);

        long totalSales = myContent.stream()
                .mapToLong(c -> c.getSalesCount() != null ? c.getSalesCount() : 0)
                .sum();

        // Calculate real earnings from RoyaltyCalculation records
        BigDecimal earnings = royaltyCalculationRepository.sumCalculatedAmountByRoyaltyOwner(creator);
        if (earnings == null) earnings = BigDecimal.ZERO;

        // Views approximation: sales × average view factor
        long totalViews = totalSales * 5;

        return Map.of(
                "totalViews", totalViews,
                "totalSales", totalSales,
                "earnings",   earnings
        );
    }

    public List<Map<String, Object>> getCreatorContent(Long creatorId) {
        User creator = resolveCreator(creatorId);
        return digitalContentRepository.findByCreatedBy(creator).stream()
                .map(c -> Map.<String, Object>of(
                        "id",         c.getId(),
                        "title",      c.getTitle(),
                        "type",       c.getContentType().name().toLowerCase(),
                        "price",      c.getPrice() != null ? c.getPrice() : BigDecimal.ZERO,
                        "status",     c.getContentStatus().name().toLowerCase(),
                        "salesCount", c.getSalesCount() != null ? c.getSalesCount() : 0,
                        "targetQty",  c.getTargetQty() != null ? c.getTargetQty() : 0
                ))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRoyaltyHistory(Long creatorId) {
        User creator = resolveCreator(creatorId);
        return royaltyCalculationRepository.findByRoyaltyOwner(creator).stream()
                .map(r -> Map.<String, Object>of(
                        "id",                r.getId(),
                        "contentTitle",      r.getDigitalContent().getTitle(),
                        "calculatedAmount",  r.getCalculatedAmount(),
                        "status",            r.getCalculationStatus().name().toLowerCase(),
                        "date",              r.getCalculationDate().toLocalDate().toString()
                ))
                .collect(Collectors.toList());
    }

    public Map<String, Object> submitContent(SubmitContentRequest request, Long creatorId) {
        User creator = resolveCreator(creatorId);
        BigDecimal price;

        if (request.title() == null || request.title().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }

        try {
            price = new BigDecimal(request.price());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be a valid number");
        }

        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price cannot be negative");
        }

        if (request.targetQty() != null && request.targetQty() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Target quantity must be greater than zero");
        }

        DigitalContent content = DigitalContent.builder()
                .title(request.title().trim())
                .contentType(parseContentType(request.type()))
                .price(price)
                .description(request.description() != null ? request.description().trim() : null)
                .targetQty(request.targetQty())
                .contentStatus(DigitalContent.ContentStatus.DRAFT)
                .createdBy(creator)
                .salesCount(0)
                .build();

        digitalContentRepository.save(content);

        // Assign 100% rights to the creator by default
        ContentRights rights = ContentRights.builder()
                .digitalContent(content)
                .rightsOwner(creator)
                .ownershipPercentage(new BigDecimal("100.00"))
                .rightsStartDate(LocalDateTime.now())
                .rightsStatus(ContentRights.RightsStatus.ACTIVE)
                .build();
        contentRightsRepository.save(rights);

        return Map.of("success", true, "contentId", content.getId());
    }
}
