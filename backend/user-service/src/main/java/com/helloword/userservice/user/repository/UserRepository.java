package com.helloword.userservice.user.repository;

import com.helloword.userservice.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
