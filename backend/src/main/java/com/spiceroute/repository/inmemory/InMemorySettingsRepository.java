package com.spiceroute.repository.inmemory;

import com.spiceroute.model.RestaurantSettings;
import com.spiceroute.repository.SettingsRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;

@Repository
public class InMemorySettingsRepository implements SettingsRepository {

    private final AtomicReference<RestaurantSettings> settingsRef = new AtomicReference<>(
            RestaurantSettings.builder()
                    .restaurantName("Spice Route")
                    .gstPercentage(new BigDecimal("5.00"))
                    .tableCount(20)
                    .build()
    );

    @Override
    public RestaurantSettings getSettings() {
        return settingsRef.get();
    }

    @Override
    public RestaurantSettings save(RestaurantSettings settings) {
        settingsRef.set(settings);
        return settings;
    }
}

