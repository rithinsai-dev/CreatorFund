package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.entity.ContentRights;
import com.CreatorFund.CreatorFund.entity.DigitalContent;
import com.CreatorFund.CreatorFund.entity.RoyaltyCalculation;
import com.CreatorFund.CreatorFund.repository.ContentRightsRepository;
import com.CreatorFund.CreatorFund.repository.RoyaltyCalculationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoyaltyService {

    private final ContentRightsRepository contentRightsRepository;
    private final RoyaltyCalculationRepository royaltyCalculationRepository;

    @Autowired
    public RoyaltyService(ContentRightsRepository contentRightsRepository,
                          RoyaltyCalculationRepository royaltyCalculationRepository) {
        this.contentRightsRepository = contentRightsRepository;
        this.royaltyCalculationRepository = royaltyCalculationRepository;
    }

    @Transactional
    public void calculateRoyalties(DigitalContent content, BigDecimal revenue) {
        // Find all active rights for this content
        List<ContentRights> rights = contentRightsRepository.findByDigitalContentAndRightsStatus(
                content, ContentRights.RightsStatus.ACTIVE);

        for (ContentRights right : rights) {
            // calculatedAmount = revenue * (percentage / 100)
            BigDecimal percentage = right.getOwnershipPercentage();
            BigDecimal calculatedAmount = revenue.multiply(percentage)
                    .divide(new BigDecimal("100.00"), 2, RoundingMode.HALF_UP);

            RoyaltyCalculation calculation = RoyaltyCalculation.builder()
                    .digitalContent(content)
                    .royaltyOwner(right.getRightsOwner())
                    .totalRevenue(revenue)
                    .royaltyPercentage(percentage)
                    .calculatedAmount(calculatedAmount)
                    .calculationDate(LocalDateTime.now())
                    .calculationStatus(RoyaltyCalculation.CalculationStatus.CALCULATED)
                    .build();

            royaltyCalculationRepository.save(calculation);
        }
    }
}
