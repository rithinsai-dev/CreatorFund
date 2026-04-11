package com.CreatorFund.CreatorFund.repository;

import com.CreatorFund.CreatorFund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
    List<User> findByRole(User.Role role);
    long countByRole(User.Role role);
}
