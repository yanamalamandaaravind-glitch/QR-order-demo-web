package com.spiceroute.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class MenuItemDto {
    private String id;

    @NotBlank(message = "Item name is required")
    private String name;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    private BigDecimal costPrice;

    private boolean veg;
    private String imageUrl;
    private boolean available = true;
    private boolean popular = false;
    private int preparationTimeMinutes = 15;

    public MenuItemDto() {}

    public MenuItemDto(String id, String name, String description, String category, BigDecimal price,
                       BigDecimal costPrice, boolean veg, String imageUrl, boolean available,
                       boolean popular, int preparationTimeMinutes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.costPrice = costPrice;
        this.veg = veg;
        this.imageUrl = imageUrl;
        this.available = available;
        this.popular = popular;
        this.preparationTimeMinutes = preparationTimeMinutes;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String description;
        private String category;
        private BigDecimal price;
        private BigDecimal costPrice;
        private boolean veg;
        private String imageUrl;
        private boolean available = true;
        private boolean popular = false;
        private int preparationTimeMinutes = 15;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder costPrice(BigDecimal costPrice) { this.costPrice = costPrice; return this; }
        public Builder veg(boolean veg) { this.veg = veg; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder available(boolean available) { this.available = available; return this; }
        public Builder popular(boolean popular) { this.popular = popular; return this; }
        public Builder preparationTimeMinutes(int minutes) { this.preparationTimeMinutes = minutes; return this; }

        public MenuItemDto build() {
            return new MenuItemDto(id, name, description, category, price, costPrice, veg, imageUrl, available, popular, preparationTimeMinutes);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }

    public boolean isVeg() { return veg; }
    public void setVeg(boolean veg) { this.veg = veg; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public boolean isPopular() { return popular; }
    public void setPopular(boolean popular) { this.popular = popular; }

    public int getPreparationTimeMinutes() { return preparationTimeMinutes; }
    public void setPreparationTimeMinutes(int preparationTimeMinutes) { this.preparationTimeMinutes = preparationTimeMinutes; }
}
