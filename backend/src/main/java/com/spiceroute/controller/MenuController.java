package com.spiceroute.controller;

import com.spiceroute.dto.ApiResponse;
import com.spiceroute.dto.MenuItemDto;
import com.spiceroute.model.MenuItem;
import com.spiceroute.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenu(
            @RequestParam(required = false, defaultValue = "false") boolean onlyAvailable,
            @RequestParam(required = false) String category) {
        List<MenuItem> items;
        if (category != null && !category.isBlank()) {
            items = menuService.getMenuItemsByCategory(category);
        } else {
            items = menuService.getAllMenuItems(onlyAvailable);
        }
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getStandardCategories()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> getMenuItem(@PathVariable String id) {
        try {
            MenuItem item = menuService.getMenuItemById(id);
            return ResponseEntity.ok(ApiResponse.ok(item));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@Valid @RequestBody MenuItemDto dto) {
        MenuItem created = menuService.createMenuItem(dto);
        return ResponseEntity.ok(ApiResponse.ok("Menu item created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(
            @PathVariable String id,
            @Valid @RequestBody MenuItemDto dto) {
        try {
            MenuItem updated = menuService.updateMenuItem(id, dto);
            return ResponseEntity.ok(ApiResponse.ok("Menu item updated successfully", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable String id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.ok(ApiResponse.ok("Menu item deleted successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItem>> toggleAvailability(@PathVariable String id) {
        try {
            MenuItem updated = menuService.toggleAvailability(id);
            return ResponseEntity.ok(ApiResponse.ok("Availability updated", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
