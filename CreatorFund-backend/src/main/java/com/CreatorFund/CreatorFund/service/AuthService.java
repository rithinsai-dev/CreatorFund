package com.CreatorFund.CreatorFund.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    public Map<String, Object> login(String email, String password, String role) {
        // TODO: Validate against Repository
        System.out.println("Service: Authenticating " + email);
        return Map.of("name", "Test User", "email", email, "role", role);
    }

    public Map<String, Object> register(String name, String email, String password, String role) {
        // TODO: Save to Repository
        System.out.println("Service: Registering " + email);
        return Map.of("name", name, "email", email, "role", role);
    }
}
