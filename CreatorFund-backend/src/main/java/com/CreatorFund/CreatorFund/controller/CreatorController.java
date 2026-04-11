package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/creator")
@CrossOrigin(origins = "*")
public class CreatorController {

    public record SubmitContentRequest(String title, String type, String price) {}

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCreatorStats() {
        // TODO: Access actual SecurityContext to get the logged-in user
        // Replace with CreatorService.getStats(userId)
        return ResponseEntity.ok(Map.of(
                "totalViews", 12500,
                "totalSales", 350,
                "earnings", 45000
        ));
    }

    @GetMapping("/content")
    public ResponseEntity<List<Map<String, Object>>> getCreatorContent() {
        // TODO: Replace with CreatorService.getContentForCreator(userId)
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "title", "Learn React Hooks", "type", "course", "price", 999, "status", "active", "salesCount", 50, "targetQty", 100),
                Map.of("id", 4, "title", "Frontend Basics", "type", "article", "price", 99, "status", "pending", "salesCount", 0, "targetQty", 50)
        ));
    }

    @PostMapping("/content")
    public ResponseEntity<Map<String, Object>> submitContent(@RequestBody SubmitContentRequest request) {
        // TODO: Replace with CreatorService.submitContent(request, userId)
        System.out.println("Received content submission: " + request.title());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
