package com.spiceroute.model;

import java.math.BigDecimal;

public class RestaurantSettings {
    private String restaurantName;
    private BigDecimal gstPercentage;
    private int tableCount;

    public RestaurantSettings() {}

    public RestaurantSettings(String restaurantName, BigDecimal gstPercentage, int tableCount) {
        this.restaurantName = restaurantName;
        this.gstPercentage = gstPercentage;
        this.tableCount = tableCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String restaurantName;
        private BigDecimal gstPercentage;
        private int tableCount;

        public Builder restaurantName(String restaurantName) { this.restaurantName = restaurantName; return this; }
        public Builder gstPercentage(BigDecimal gstPercentage) { this.gstPercentage = gstPercentage; return this; }
        public Builder tableCount(int tableCount) { this.tableCount = tableCount; return this; }

        public RestaurantSettings build() {
            return new RestaurantSettings(restaurantName, gstPercentage, tableCount);
        }
    }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public BigDecimal getGstPercentage() { return gstPercentage; }
    public void setGstPercentage(BigDecimal gstPercentage) { this.gstPercentage = gstPercentage; }

    public int getTableCount() { return tableCount; }
    public void setTableCount(int tableCount) { this.tableCount = tableCount; }
}
