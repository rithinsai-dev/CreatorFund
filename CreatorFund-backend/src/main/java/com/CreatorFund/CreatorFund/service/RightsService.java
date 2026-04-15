package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.model.ContentRights;
import com.CreatorFund.CreatorFund.model.DigitalContent;
import com.CreatorFund.CreatorFund.model.RightsTransfer;
import com.CreatorFund.CreatorFund.model.User;
import com.CreatorFund.CreatorFund.repository.ContentRightsRepository;
import com.CreatorFund.CreatorFund.repository.DigitalContentRepository;
import com.CreatorFund.CreatorFund.repository.RightsTransferRepository;
import com.CreatorFund.CreatorFund.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RightsService {

    private final DigitalContentRepository digitalContentRepository;
    private final ContentRightsRepository contentRightsRepository;
    private final RightsTransferRepository rightsTransferRepository;
    private final UserRepository userRepository;

    @Autowired
    public RightsService(DigitalContentRepository digitalContentRepository,
                         ContentRightsRepository contentRightsRepository,
                         RightsTransferRepository rightsTransferRepository,
                         UserRepository userRepository) {
        this.digitalContentRepository = digitalContentRepository;
        this.contentRightsRepository = contentRightsRepository;
        this.rightsTransferRepository = rightsTransferRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getActiveRights(Long contentId) {
        DigitalContent content = digitalContentRepository.findById(contentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found"));

        return contentRightsRepository.findByDigitalContentAndRightsStatus(content, ContentRights.RightsStatus.ACTIVE).stream()
                .map(r -> Map.<String, Object>of(
                        "ownerName",  r.getRightsOwner().getName(),
                        "ownerEmail", r.getRightsOwner().getEmail(),
                        "percentage", r.getOwnershipPercentage(),
                        "status",     r.getRightsStatus().name().toLowerCase()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTransferHistory(Long contentId) {
        DigitalContent content = digitalContentRepository.findById(contentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found"));

        return rightsTransferRepository.findByDigitalContentOrderByTransferDateDesc(content).stream()
                .map(t -> Map.<String, Object>of(
                        "id",               t.getId(),
                        "fromName",         t.getPreviousOwner().getName(),
                        "fromEmail",        t.getPreviousOwner().getEmail(),
                        "toName",           t.getNewOwner().getName(),
                        "toEmail",          t.getNewOwner().getEmail(),
                        "percentage",       t.getTransferPercentage(),
                        "date",             t.getTransferDate().toLocalDate().toString()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> transferRights(Long contentId, Long fromUserId, String toEmail, BigDecimal percentage) {
        DigitalContent content = digitalContentRepository.findById(contentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found"));

        User fromUser = userRepository.findById(fromUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

        User toUser = userRepository.findByEmail(toEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found with email: " + toEmail));

        if (fromUser.getRole() != User.Role.CREATOR || toUser.getRole() != User.Role.CREATOR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rights can only be transferred between creators");
        }

        if (percentage == null || percentage.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transfer percentage must be greater than zero");
        }

        if (percentage.compareTo(new BigDecimal("100")) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transfer percentage cannot exceed 100");
        }

        if (fromUser.getId().equals(toUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot transfer rights to yourself");
        }

        ContentRights senderRights = contentRightsRepository.findByDigitalContentAndRightsOwnerAndRightsStatus(
                content, fromUser, ContentRights.RightsStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sender does not own rights for this content"));

        if (senderRights.getOwnershipPercentage().compareTo(percentage) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient ownership percentage. Available: " + senderRights.getOwnershipPercentage());
        }

        
        BigDecimal remainingPercentage = senderRights.getOwnershipPercentage().subtract(percentage);
        senderRights.setOwnershipPercentage(remainingPercentage);
        if (remainingPercentage.compareTo(BigDecimal.ZERO) == 0) {
            senderRights.setRightsStatus(ContentRights.RightsStatus.TRANSFERRED);
            senderRights.setRightsEndDate(LocalDateTime.now());
        }
        contentRightsRepository.save(senderRights);

        
        ContentRights recipientRights = contentRightsRepository.findByDigitalContentAndRightsOwnerAndRightsStatus(
                content, toUser, ContentRights.RightsStatus.ACTIVE)
                .orElseGet(() -> {
                    LocalDateTime now = LocalDateTime.now();
                    return ContentRights.builder()
                            .digitalContent(content)
                            .rightsOwner(toUser)
                            .ownershipPercentage(BigDecimal.ZERO)
                            .rightsStartDate(now)
                            .rightsEndDate(now.plusYears(1))
                            .rightsStatus(ContentRights.RightsStatus.ACTIVE)
                            .build();
                });

        recipientRights.setOwnershipPercentage(recipientRights.getOwnershipPercentage().add(percentage));
        contentRightsRepository.save(recipientRights);

        
        RightsTransfer transfer = RightsTransfer.builder()
                .digitalContent(content)
                .previousOwner(fromUser)
                .newOwner(toUser)
                .transferPercentage(percentage)
                .transferDate(LocalDateTime.now())
                .build();

        rightsTransferRepository.save(transfer);

        return Map.of(
                "success", true,
                "fromName", fromUser.getName(),
                "toName", toUser.getName(),
                "percentage", percentage,
                "remainingPercentage", remainingPercentage
        );
    }
}
