package com.spiceroute.repository.inmemory;

import com.spiceroute.model.MenuItem;
import com.spiceroute.repository.MenuItemRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class InMemoryMenuItemRepository implements MenuItemRepository {

    private final Map<String, MenuItem> items = new ConcurrentHashMap<>();

    @Override
    public List<MenuItem> findAll() {
        return new ArrayList<>(items.values());
    }

    @Override
    public Optional<MenuItem> findById(String id) {
        return Optional.ofNullable(items.get(id));
    }

    @Override
    public List<MenuItem> findByAvailableTrue() {
        return items.values().stream()
                .filter(MenuItem::isAvailable)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItem> findByCategory(String category) {
        return items.values().stream()
                .filter(i -> i.getCategory() != null && i.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    @Override
    public MenuItem save(MenuItem menuItem) {
        if (menuItem.getId() == null || menuItem.getId().isBlank()) {
            menuItem.setId(UUID.randomUUID().toString());
        }
        items.put(menuItem.getId(), menuItem);
        return menuItem;
    }

    @Override
    public void deleteById(String id) {
        items.remove(id);
    }

    @Override
    public boolean existsById(String id) {
        return items.containsKey(id);
    }

    @Override
    public long count() {
        return items.size();
    }
}

