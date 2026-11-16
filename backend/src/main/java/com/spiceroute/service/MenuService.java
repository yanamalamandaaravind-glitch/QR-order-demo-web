package com.spiceroute.service;

import com.spiceroute.dto.MenuItemDto;
import com.spiceroute.model.MenuItem;
import com.spiceroute.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAllMenuItems(boolean onlyAvailable) {
        if (onlyAvailable) {
            return menuItemRepository.findByAvailableTrue();
        }
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + id));
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    public MenuItem createMenuItem(MenuItemDto dto) {
        MenuItem item = MenuItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .price(dto.getPrice())
                .costPrice(dto.getCostPrice())
                .veg(dto.isVeg())
                .imageUrl(dto.getImageUrl())
                .available(dto.isAvailable())
                .popular(dto.isPopular())
                .preparationTimeMinutes(dto.getPreparationTimeMinutes() > 0 ? dto.getPreparationTimeMinutes() : 15)
                .build();
        return menuItemRepository.save(item);
    }

    public MenuItem updateMenuItem(String id, MenuItemDto dto) {
        MenuItem existing = getMenuItemById(id);
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setPrice(dto.getPrice());
        existing.setCostPrice(dto.getCostPrice());
        existing.setVeg(dto.isVeg());
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            existing.setImageUrl(dto.getImageUrl());
        }
        existing.setAvailable(dto.isAvailable());
        existing.setPopular(dto.isPopular());
        if (dto.getPreparationTimeMinutes() > 0) {
            existing.setPreparationTimeMinutes(dto.getPreparationTimeMinutes());
        }
        return menuItemRepository.save(existing);
    }

    public void deleteMenuItem(String id) {
        if (!menuItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    public MenuItem toggleAvailability(String id) {
        MenuItem item = getMenuItemById(id);
        item.setAvailable(!item.isAvailable());
        return menuItemRepository.save(item);
    }

    public List<String> getStandardCategories() {
        return Arrays.asList(
                "Biryani",
                "Starters",
                "Chicken",
                "Puffs",
                "Lollipops",
                "Main Course",
                "Drinks",
                "Desserts",
                "Ice Creams"
        );
    }
}
