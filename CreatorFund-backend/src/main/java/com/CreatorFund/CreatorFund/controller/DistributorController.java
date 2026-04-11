package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/distributor")
@CrossOrigin(origins = "*")
public class DistributorController {

    public record PurchaseRequest(Long contentId, String paymentDetails) {}

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // TODO: Replace with DistributorService.getDashboardStats(userId)
        return ResponseEntity.ok(Map.of(
                "totalSpent", 1498,
                "purchaseCount", 2,
                "availableContentCount", 3,
                "ownedLicensesCount", 2
        ));
    }

    @GetMapping("/purchases")
    public ResponseEntity<List<Map<String, Object>>> getPurchases() {
        // TODO: Replace with DistributorService.getPurchases(userId)
        return ResponseEntity.ok(List.of(
                Map.of("id", 101, "contentTitle", "Learn React Hooks", "type", "course", "amount", 999, "status", "completed", "date", "2023-10-01", "licenseKey", "LIC-1234"),
                Map.of("id", 102, "contentTitle", "Tech Review Video", "type", "video", "amount", 499, "status", "completed", "date", "2023-10-05", "licenseKey", "LIC-5678")
        ));
    }

    @GetMapping("/marketplace")
    public ResponseEntity<List<Map<String, Object>>> getMarketplace() {
        // TODO: Replace with DistributorService.getAvailableContent()
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "title", "Learn React Hooks", "type", "course", "price", 999, "status", "active", "creatorName", "sai", "salesCount", 50, "targetQty", 100),
                Map.of("id", 2, "title", "Tech Review Video", "type", "video", "price", 499, "status", "active", "creatorName", "Rithin", "salesCount", 120, "targetQty", 200),
                Map.of("id", 3, "title", "Lo-Fi Beats", "type", "music", "price", 199, "status", "active", "creatorName", "idk", "salesCount", 300, "targetQty", 500)
        ));
    }

    @PostMapping("/purchase")
    public ResponseEntity<Map<String, Object>> purchaseContent(@RequestBody PurchaseRequest request) {
        // TODO: Replace with DistributorService.purchaseContent(request.contentId(), userId)
        System.out.println("Processing purchase for content id: " + request.contentId());
        return ResponseEntity.ok(Map.of("success", true, "licenseKey", "NEW-LIC-123"));
    }
}
