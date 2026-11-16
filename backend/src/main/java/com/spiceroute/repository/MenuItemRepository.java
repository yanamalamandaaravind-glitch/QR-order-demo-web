package com.spiceroute.repository;

import com.spiceroute.model.MenuItem;
import java.util.List;
import java.util.Optional;

public interface MenuItemRepository {
    List<MenuItem> findAll();
    Optional<MenuItem> findById(String id);
    List<MenuItem> findByAvailableTrue();
    List<MenuItem> findByCategory(String category);
    MenuItem save(MenuItem menuItem);
    void deleteById(String id);
    boolean existsById(String id);
    long count();
}

