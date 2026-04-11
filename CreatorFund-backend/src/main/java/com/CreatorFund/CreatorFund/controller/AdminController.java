package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.CreatorFund.CreatorFund.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/creators")
    public ResponseEntity<List<Map<String, Object>>> getCreators() {
        return ResponseEntity.ok(adminService.getAllCreators());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<Map<String, Object>>> getRequests() {
        return ResponseEntity.ok(adminService.getPendingRequests());
    }

    @PostMapping("/approve-content")
    public ResponseEntity<Map<String, Object>> approveContent(@RequestParam Long contentId) {
        boolean success = adminService.approveContent(contentId);
        return ResponseEntity.ok(Map.of("success", success));
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<Map<String, Object>>> getRevenue() {
        return ResponseEntity.ok(adminService.getCreatorRevenueStats());
    }

    @PostMapping("/payout")
    public ResponseEntity<Map<String, Object>> processPayout(@RequestParam Long creatorId) {
        return ResponseEntity.ok(adminService.processPayout(creatorId));
    }
}
