package com.spiceroute.dto;

import com.spiceroute.model.OrderStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class OrderDto {

    public static class CreateOrderRequest {
        @NotNull(message = "Table number is required")
        private Integer tableNumber;

        private String customerMobile;
        private String customerName;

        @NotEmpty(message = "Order must contain at least one item")
        private List<OrderItemRequest> items;

        private String note;
        private String paymentMethod;
        private String paymentSessionId;
        private String cashfreeOrderId;

        public CreateOrderRequest() {}

        public Integer getTableNumber() { return tableNumber; }
        public void setTableNumber(Integer tableNumber) { this.tableNumber = tableNumber; }

        public String getCustomerMobile() { return customerMobile; }
        public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getPaymentSessionId() { return paymentSessionId; }
        public void setPaymentSessionId(String paymentSessionId) { this.paymentSessionId = paymentSessionId; }

        public String getCashfreeOrderId() { return cashfreeOrderId; }
        public void setCashfreeOrderId(String cashfreeOrderId) { this.cashfreeOrderId = cashfreeOrderId; }
    }

    public static class OrderItemRequest {
        private String menuItemId;
        private String name;
        private BigDecimal price;
        private BigDecimal costPrice;
        private int quantity;
        private boolean veg;

        public OrderItemRequest() {}

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

    public static class UpdateStatusRequest {
        @NotNull(message = "Status is required")
        private OrderStatus status;

        public UpdateStatusRequest() {}
        public UpdateStatusRequest(OrderStatus status) { this.status = status; }

        public OrderStatus getStatus() { return status; }
        public void setStatus(OrderStatus status) { this.status = status; }
    }
}

