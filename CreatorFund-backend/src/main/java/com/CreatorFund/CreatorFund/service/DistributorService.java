package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.controller.DistributorController.PurchaseRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DistributorService {

    public Map<String, Object> getDashboardStats() {
        // TODO: Database lookup
        return Map.of(
                "totalSpent", 1498,
                "purchaseCount", 2,
                "availableContentCount", 3,
                "ownedLicensesCount", 2
        );
    }

    public List<Map<String, Object>> getPurchases() {
        // TODO: Database lookup
        return List.of(
                Map.of("id", 101, "contentTitle", "Learn React Hooks", "type", "course", "amount", 999, "status", "completed", "date", "2023-10-01", "licenseKey", "LIC-1234"),
                Map.of("id", 102, "contentTitle", "Tech Review Video", "type", "video", "amount", 499, "status", "completed", "date", "2023-10-05", "licenseKey", "LIC-5678")
        );
    }

    public List<Map<String, Object>> getMarketplace() {
        // TODO: Database lookup
        return List.of(
                Map.of("id", 1, "title", "Learn React Hooks", "type", "course", "price", 999999999, "status", "active", "creatorName", "Alice", "salesCount", 50, "targetQty", 100),
                Map.of("id", 2, "title", "Tech Review Video", "type", "video", "price", 499, "status", "active", "creatorName", "Bob", "salesCount", 120, "targetQty", 200),
                Map.of("id", 3, "title", "Lo-Fi Beats", "type", "music", "price", 199, "status", "active", "creatorName", "Charlie", "salesCount", 300, "targetQty", 500)
        );
    }

    public Map<String, Object> purchaseContent(PurchaseRequest request) {
        // TODO: Save to database, deduct payment, generate license
        System.out.println("Service: Buying license for content id: " + request.contentId());
        return Map.of("success", true, "licenseKey", "NEW-LIC-123");
    }
}
