package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // TODO: Replace with AdminService.getDashboardStats()
        return ResponseEntity.ok(Map.of(
                "platformRevenue", 15000,
                "activeCreators", 2,
                "pendingRequests", 2
        ));
    }

    @GetMapping("/creators")
    public ResponseEntity<List<Map<String, Object>>> getCreators() {
        // TODO: Replace with AdminService.getAllCreators()
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "name", "sai", "email", "Rithinsai@example.com", "status", "active", "totalRevenue", 50000, "joined", "2023-01-10"),
                Map.of("id", 2, "name", "Rithin", "email", "PamerlaRithin@example.com", "status", "active", "totalRevenue", 30000, "joined", "2023-03-22")
        ));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<Map<String, Object>>> getRequests() {
        // TODO: Replace with AdminService.getPendingRequests()
        return ResponseEntity.ok(List.of(
                Map.of("id", 4, "contentTitle", "Frontend Basics", "creatorName", "sai", "type", "article", "date", "2023-10-10", "status", "pending"),
                Map.of("id", 5, "contentTitle", "Advanced Hooks", "creatorName", "Rithin", "type", "course", "date", "2023-10-11", "status", "pending")
        ));
    }
}
