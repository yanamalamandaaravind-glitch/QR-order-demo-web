package com.spiceroute.repository;

import com.spiceroute.model.RestaurantSettings;

public interface SettingsRepository {
    RestaurantSettings getSettings();
    RestaurantSettings save(RestaurantSettings settings);
}

