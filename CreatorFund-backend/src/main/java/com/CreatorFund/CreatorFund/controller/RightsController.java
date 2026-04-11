package com.CreatorFund.CreatorFund.controller;

import com.CreatorFund.CreatorFund.service.RightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rights")
@CrossOrigin(origins = "*")
public class RightsController {

    private final RightsService rightsService;

    @Autowired
    public RightsController(RightsService rightsService) {
        this.rightsService = rightsService;
    }

    @GetMapping("/content/{id}")
    public ResponseEntity<List<Map<String, Object>>> getActiveRights(@PathVariable Long id) {
        return ResponseEntity.ok(rightsService.getActiveRights(id));
    }

    @GetMapping("/content/{id}/history")
    public ResponseEntity<List<Map<String, Object>>> getTransferHistory(@PathVariable Long id) {
        return ResponseEntity.ok(rightsService.getTransferHistory(id));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> transferRights(
            @RequestParam Long contentId,
            @RequestParam Long fromUserId,
            @RequestParam String toEmail,
            @RequestParam BigDecimal percentage) {
        try {
            Map<String, Object> result = rightsService.transferRights(contentId, fromUserId, toEmail, percentage);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
