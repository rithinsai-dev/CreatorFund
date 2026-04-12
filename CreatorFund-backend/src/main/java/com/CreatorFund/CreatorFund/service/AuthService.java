package com.CreatorFund.CreatorFund.service;

import com.CreatorFund.CreatorFund.entity.User;
import com.CreatorFund.CreatorFund.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User.Role parseRole(String role) {
        try {
            return User.Role.valueOf(role.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }
    }

    public Map<String, Object> login(String email, String password, String role) {
        User.Role requestedRole = parseRole(role);
        User user = userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (user.getRole() != requestedRole) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid role for this account");
        }

        return Map.of(
                "id",    user.getId(),
                "name",  user.getName(),
                "email", user.getEmail(),
                "organizationName", user.getOrganizationName(),
                "role",  user.getRole().name()
        );
    }

    public Map<String, Object> register(String name, String email, String password, String role, String organizationName) {
        User.Role requestedRole = parseRole(role);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        if (password == null || password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }

        if (organizationName == null || organizationName.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Organization name is required");
        }

        User newUser = User.builder()
                .name(name.trim())
                .email(email.trim().toLowerCase(Locale.ROOT))
                .password(password)
                .organizationName(organizationName.trim())
                .role(requestedRole)
                .build();

        User saved = userRepository.save(newUser);

        return Map.of(
                "id",    saved.getId(),
                "name",  saved.getName(),
                "email", saved.getEmail(),
                "organizationName", saved.getOrganizationName(),
                "role",  saved.getRole().name()
        );
    }
}
