package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.UsageTransaction;
import com.CreatorFund.CreatorFund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface UsageTransactionRepository extends JpaRepository<UsageTransaction, Long> {
    List<UsageTransaction> findByDistributor(User distributor);
    List<UsageTransaction> findByDistributorOrderByTransactionDateDesc(User distributor);

    @Query("SELECT COALESCE(SUM(t.revenueGenerated), 0) FROM UsageTransaction t")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(t.revenueGenerated), 0) FROM UsageTransaction t WHERE t.distributor = :distributor")
    BigDecimal sumRevenueByDistributor(User distributor);

    long countByDistributor(User distributor);
}
