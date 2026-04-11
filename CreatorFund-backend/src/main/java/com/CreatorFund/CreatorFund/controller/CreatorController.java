package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.CreatorFund.CreatorFund.service.CreatorService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/creator")
@CrossOrigin(origins = "*")
public class CreatorController {

    private final CreatorService creatorService;

    @Autowired
    public CreatorController(CreatorService creatorService) {
        this.creatorService = creatorService;
    }

    public record SubmitContentRequest(String title, String type, String price, String description, Integer targetQty) {}

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCreatorStats(
            @RequestParam Long creatorId) {
        return ResponseEntity.ok(creatorService.getStats(creatorId));
    }

    @GetMapping("/content")
    public ResponseEntity<List<Map<String, Object>>> getCreatorContent(
            @RequestParam Long creatorId) {
        return ResponseEntity.ok(creatorService.getCreatorContent(creatorId));
    }

    @PostMapping("/content")
    public ResponseEntity<Map<String, Object>> submitContent(
            @RequestBody SubmitContentRequest request,
            @RequestParam Long creatorId) {
        return ResponseEntity.ok(creatorService.submitContent(request, creatorId));
    }

    @GetMapping("/royalties")
    public ResponseEntity<List<Map<String, Object>>> getRoyaltyHistory(
            @RequestParam Long creatorId) {
        return ResponseEntity.ok(creatorService.getRoyaltyHistory(creatorId));
    }
}
