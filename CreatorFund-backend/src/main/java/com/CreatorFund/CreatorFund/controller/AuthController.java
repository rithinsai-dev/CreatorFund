package com.CreatorFund.CreatorFund.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.CreatorFund.CreatorFund.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Typically you'll configure CORS globally, but this is helpful for testing
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Helper records for requests and responses
    public record LoginRequest(String email, String password, String role) {}
    public record RegisterRequest(String name, String email, String password, String role, String organizationName) {}

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = authService.login(request.email(), request.password(), request.role());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> response = authService.register(
                request.name(),
                request.email(),
                request.password(),
                request.role(),
                request.organizationName()
        );
        return ResponseEntity.ok(response);
    }
}
