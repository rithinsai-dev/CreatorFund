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
}
