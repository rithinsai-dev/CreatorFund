package com.CreatorFund.CreatorFund.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    public Map<String, Object> getDashboardStats() {
        // TODO: Aggregate from Repository
        return Map.of(
                "platformRevenue", 15000,
                "activeCreators", 2,
                "pendingRequests", 2
        );
    }

    public List<Map<String, Object>> getAllCreators() {
        // TODO: Fetch from Repository
        return List.of(
                Map.of("id", 1, "name", "Alice", "email", "alice@example.com", "status", "active", "totalRevenue", 50000, "joined", "2023-01-10"),
                Map.of("id", 2, "name", "Bob", "email", "bob@example.com", "status", "active", "totalRevenue", 30000, "joined", "2023-03-22")
        );
    }

    public List<Map<String, Object>> getPendingRequests() {
        // TODO: Fetch from Repository
        return List.of(
                Map.of("id", 4, "contentTitle", "Frontend Basics", "creatorName", "Rithin", "type", "article", "date", "2023-10-10", "status", "pending"),
                Map.of("id", 5, "contentTitle", "Advanced Hooks", "creatorName", "Alice", "type", "course", "date", "2023-10-11", "status", "pending")
        );
    }
}
