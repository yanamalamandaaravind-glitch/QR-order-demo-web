package com.spiceroute.repository.inmemory;

import com.spiceroute.model.User;
import com.spiceroute.repository.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryUserRepository implements UserRepository {

    private final Map<String, User> users = new ConcurrentHashMap<>();

    @Override
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }

    @Override
    public Optional<User> findById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    @Override
    public Optional<User> findByUsernameOrMobile(String usernameOrMobile) {
        if (usernameOrMobile == null) return Optional.empty();
        return users.values().stream()
                .filter(u -> usernameOrMobile.equalsIgnoreCase(u.getUsernameOrMobile()))
                .findFirst();
    }

    @Override
    public User save(User user) {
        if (user.getId() == null || user.getId().isBlank()) {
            user.setId(UUID.randomUUID().toString());
        }
        users.put(user.getId(), user);
        return user;
    }

    @Override
    public boolean existsByUsernameOrMobile(String usernameOrMobile) {
        return findByUsernameOrMobile(usernameOrMobile).isPresent();
    }

    @Override
    public long count() {
        return users.size();
    }
}

