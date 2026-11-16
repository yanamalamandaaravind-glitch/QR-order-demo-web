package com.spiceroute.controller;

import com.spiceroute.dto.ApiResponse;
import com.spiceroute.model.RestaurantSettings;
import com.spiceroute.repository.SettingsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
public class SettingsController {

    private final SettingsRepository settingsRepository;

    public SettingsController(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<RestaurantSettings>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.ok(settingsRepository.getSettings()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantSettings>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok(settingsRepository.getSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantSettings>> updateSettings(@RequestBody RestaurantSettings settings) {
        RestaurantSettings saved = settingsRepository.save(settings);
        return ResponseEntity.ok(ApiResponse.ok("Settings updated successfully", saved));
    }
}
