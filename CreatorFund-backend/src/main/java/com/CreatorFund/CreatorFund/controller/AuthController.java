package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Typically you'll configure CORS globally, but this is helpful for testing
public class AuthController {

    // Helper records for requests and responses
    public record LoginRequest(String email, String password, String role) {}
    public record RegisterRequest(String name, String email, String password, String role) {}

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        // TODO: Call AuthService to authenticate user
        System.out.println("Processing login for: " + request.email());
        
        Map<String, Object> response = Map.of("name", "Test User", "email", request.email(), "role", request.role());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        // TODO: Call AuthService to register user
        System.out.println("Processing registration for: " + request.email());

        Map<String, Object> response = Map.of("name", request.name(), "email", request.email(), "role", request.role());
        return ResponseEntity.ok(response);
    }
}
