package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.RightsTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RightsTransferRepository extends JpaRepository<RightsTransfer, Long> {
}
