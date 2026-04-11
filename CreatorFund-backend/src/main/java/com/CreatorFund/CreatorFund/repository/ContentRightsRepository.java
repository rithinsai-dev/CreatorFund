package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.ContentRights;
import com.CreatorFund.CreatorFund.entity.DigitalContent;
import com.CreatorFund.CreatorFund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentRightsRepository extends JpaRepository<ContentRights, Long> {
    List<ContentRights> findByDigitalContentAndRightsStatus(DigitalContent content, ContentRights.RightsStatus status);
    
    Optional<ContentRights> findByDigitalContentAndRightsOwnerAndRightsStatus(
            DigitalContent content, User owner, ContentRights.RightsStatus status);
}
