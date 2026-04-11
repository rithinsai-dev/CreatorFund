package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.controller.CreatorController.SubmitContentRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CreatorService {

    public Map<String, Object> getStats() {
        // TODO: Database aggregation
        return Map.of(
                "totalViews", 12500,
                "totalSales", 350,
                "earnings", 45000
        );
    }

    public List<Map<String, Object>> getCreatorContent() {
        // TODO: Fetch content from Repository
        return List.of(
                Map.of("id", 1, "title", "Learn React Hooks", "type", "course", "price", 999, "status", "active", "salesCount", 50, "targetQty", 100),
                Map.of("id", 4, "title", "Frontend Basics", "type", "article", "price", 99, "status", "pending", "salesCount", 0, "targetQty", 50)
        );
    }

    public Map<String, Object> submitContent(SubmitContentRequest request) {
        // TODO: Save to Repository
        System.out.println("Service: Saving new content: " + request.title());
        return Map.of("success", true);
    }
}
