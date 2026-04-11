package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.DigitalContent;
import com.CreatorFund.CreatorFund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DigitalContentRepository extends JpaRepository<DigitalContent, Long> {
    List<DigitalContent> findByCreatedBy(User creator);
    List<DigitalContent> findByContentStatus(DigitalContent.ContentStatus status);
    List<DigitalContent> findByCreatedByAndContentStatus(User creator, DigitalContent.ContentStatus status);
    long countByContentStatus(DigitalContent.ContentStatus status);
}
