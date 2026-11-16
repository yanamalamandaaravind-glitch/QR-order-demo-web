package com.spiceroute.dto;

import java.math.BigDecimal;
import java.util.List;

public class PaymentDto {

    public static class CreatePaymentSessionRequest {
        private BigDecimal amount;
        private String customerMobile;
        private String customerName;
        private int tableNumber;
        private List<OrderItemDto> items;

        public CreatePaymentSessionRequest() {}

        public CreatePaymentSessionRequest(BigDecimal amount, String customerMobile, String customerName, int tableNumber, List<OrderItemDto> items) {
            this.amount = amount;
            this.customerMobile = customerMobile;
            this.customerName = customerName;
            this.tableNumber = tableNumber;
            this.items = items;
        }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getCustomerMobile() { return customerMobile; }
        public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public int getTableNumber() { return tableNumber; }
        public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

        public List<OrderItemDto> getItems() { return items; }
        public void setItems(List<OrderItemDto> items) { this.items = items; }
    }

    public static class OrderItemDto {
        private String menuItemId;
        private String name;
        private BigDecimal price;
        private BigDecimal costPrice;
        private int quantity;
        private boolean veg;

        public OrderItemDto() {}

        public OrderItemDto(String menuItemId, String name, BigDecimal price, BigDecimal costPrice, int quantity, boolean veg) {
            this.menuItemId = menuItemId;
            this.name = name;
            this.price = price;
            this.costPrice = costPrice;
            this.quantity = quantity;
            this.veg = veg;
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

    public static class PaymentSessionResponse {
        private String paymentSessionId;
        private String orderId;
        private String mode; // "SANDBOX" or "MOCK"
        private BigDecimal amount;
        private String currency;
        private String message;

        public PaymentSessionResponse() {}

        public PaymentSessionResponse(String paymentSessionId, String orderId, String mode, BigDecimal amount, String currency, String message) {
            this.paymentSessionId = paymentSessionId;
            this.orderId = orderId;
            this.mode = mode;
            this.amount = amount;
            this.currency = currency;
            this.message = message;
        }

        public String getPaymentSessionId() { return paymentSessionId; }
        public void setPaymentSessionId(String paymentSessionId) { this.paymentSessionId = paymentSessionId; }

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }

        public String getMode() { return mode; }
        public void setMode(String mode) { this.mode = mode; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}

