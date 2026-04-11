package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.RoyaltyPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoyaltyPaymentRepository extends JpaRepository<RoyaltyPayment, Long> {
}
