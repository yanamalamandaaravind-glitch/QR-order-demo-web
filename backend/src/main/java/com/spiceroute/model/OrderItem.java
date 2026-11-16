package com.spiceroute.model;

import java.math.BigDecimal;

public class OrderItem {
    private String menuItemId;
    private String name;
    private BigDecimal price;
    private BigDecimal costPrice;
    private int quantity;
    private boolean veg;

    public OrderItem() {}

    public OrderItem(String menuItemId, String name, BigDecimal price, BigDecimal costPrice, int quantity, boolean veg) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.price = price;
        this.costPrice = costPrice;
        this.quantity = quantity;
        this.veg = veg;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String menuItemId;
        private String name;
        private BigDecimal price;
        private BigDecimal costPrice;
        private int quantity;
        private boolean veg;

        public Builder menuItemId(String menuItemId) { this.menuItemId = menuItemId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder costPrice(BigDecimal costPrice) { this.costPrice = costPrice; return this; }
        public Builder quantity(int quantity) { this.quantity = quantity; return this; }
        public Builder veg(boolean veg) { this.veg = veg; return this; }

        public OrderItem build() {
            return new OrderItem(menuItemId, name, price, costPrice, quantity, veg);
        }
    }

    public String getMenuItemId() { return menuItemId; }
    public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public boolean isVeg() { return veg; }
    public void setVeg(boolean veg) { this.veg = veg; }
}
