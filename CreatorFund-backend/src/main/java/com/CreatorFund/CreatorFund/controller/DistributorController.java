package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.CreatorFund.CreatorFund.service.DistributorService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/distributor")
@CrossOrigin(origins = "*")
public class DistributorController {

    private final DistributorService distributorService;

    @Autowired
    public DistributorController(DistributorService distributorService) {
        this.distributorService = distributorService;
    }

    public record PurchaseRequest(Long contentId, String paymentDetails, String usageType, Long distributorId) {}

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam(defaultValue = "1") Long distributorId) {
        return ResponseEntity.ok(distributorService.getDashboardStats(distributorId));
    }

    @GetMapping("/purchases")
    public ResponseEntity<List<Map<String, Object>>> getPurchases(
            @RequestParam(defaultValue = "1") Long distributorId) {
        return ResponseEntity.ok(distributorService.getPurchases(distributorId));
    }

    @GetMapping("/marketplace")
    public ResponseEntity<List<Map<String, Object>>> getMarketplace() {
        return ResponseEntity.ok(distributorService.getMarketplace());
    }

    @PostMapping("/purchase")
    public ResponseEntity<Map<String, Object>> purchaseContent(@RequestBody PurchaseRequest request) {
        return ResponseEntity.ok(distributorService.purchaseContent(request));
    }
}
