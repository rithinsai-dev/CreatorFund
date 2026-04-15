package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.model.DigitalContent;
import com.CreatorFund.CreatorFund.model.RightsTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RightsTransferRepository extends JpaRepository<RightsTransfer, Long> {
    List<RightsTransfer> findByDigitalContentOrderByTransferDateDesc(DigitalContent content);
}
