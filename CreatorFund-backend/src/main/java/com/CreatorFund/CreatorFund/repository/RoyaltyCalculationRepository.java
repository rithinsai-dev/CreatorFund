package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.RoyaltyCalculation;
import com.CreatorFund.CreatorFund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoyaltyCalculationRepository extends JpaRepository<RoyaltyCalculation, Long> {
    List<RoyaltyCalculation> findByRoyaltyOwner(User owner);

    List<RoyaltyCalculation> findByRoyaltyOwnerAndCalculationStatus(User owner, RoyaltyCalculation.CalculationStatus status);
    
    @Query("SELECT SUM(r.calculatedAmount) FROM RoyaltyCalculation r WHERE r.royaltyOwner = :owner")
    BigDecimal sumCalculatedAmountByRoyaltyOwner(User owner);

    @Query("SELECT SUM(r.calculatedAmount) FROM RoyaltyCalculation r WHERE r.royaltyOwner = :owner AND r.calculationStatus = :status")
    BigDecimal sumCalculatedAmountByRoyaltyOwnerAndCalculationStatus(User owner, RoyaltyCalculation.CalculationStatus status);
}
