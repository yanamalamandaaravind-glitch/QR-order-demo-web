package com.spiceroute.repository;

import com.spiceroute.model.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    List<User> findAll();
    Optional<User> findById(String id);
    Optional<User> findByUsernameOrMobile(String usernameOrMobile);
    User save(User user);
    boolean existsByUsernameOrMobile(String usernameOrMobile);
    long count();
}

