package com.spiceroute.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Order {
    private String id;
    private String orderNumber;
    private int tableNumber;
    private String customerMobile;
    private String customerName;
    private List<OrderItem> items = new ArrayList<>();
    private String note;
    private BigDecimal subtotal;
    private BigDecimal gstPercentage;
    private BigDecimal gstAmount;
    private BigDecimal grandTotal;
    private BigDecimal totalCostPrice;
    private BigDecimal profit;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String cashfreeOrderId;
    private String paymentSessionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Order() {}

    public Order(String id, String orderNumber, int tableNumber, String customerMobile, String customerName,
                 List<OrderItem> items, String note, BigDecimal subtotal, BigDecimal gstPercentage,
                 BigDecimal gstAmount, BigDecimal grandTotal, BigDecimal totalCostPrice, BigDecimal profit,
                 OrderStatus status, PaymentStatus paymentStatus, String paymentMethod, String cashfreeOrderId,
                 String paymentSessionId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.tableNumber = tableNumber;
        this.customerMobile = customerMobile;
        this.customerName = customerName;
        this.items = items != null ? items : new ArrayList<>();
        this.note = note;
        this.subtotal = subtotal;
        this.gstPercentage = gstPercentage;
        this.gstAmount = gstAmount;
        this.grandTotal = grandTotal;
        this.totalCostPrice = totalCostPrice;
        this.profit = profit;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.cashfreeOrderId = cashfreeOrderId;
        this.paymentSessionId = paymentSessionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String orderNumber;
        private int tableNumber;
        private String customerMobile;
        private String customerName;
        private List<OrderItem> items = new ArrayList<>();
        private String note;
        private BigDecimal subtotal;
        private BigDecimal gstPercentage;
        private BigDecimal gstAmount;
        private BigDecimal grandTotal;
        private BigDecimal totalCostPrice;
        private BigDecimal profit;
        private OrderStatus status;
        private PaymentStatus paymentStatus;
        private String paymentMethod;
        private String cashfreeOrderId;
        private String paymentSessionId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public Builder tableNumber(int tableNumber) { this.tableNumber = tableNumber; return this; }
        public Builder customerMobile(String customerMobile) { this.customerMobile = customerMobile; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder items(List<OrderItem> items) { this.items = items; return this; }
        public Builder note(String note) { this.note = note; return this; }
        public Builder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public Builder gstPercentage(BigDecimal gstPercentage) { this.gstPercentage = gstPercentage; return this; }
        public Builder gstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; return this; }
        public Builder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public Builder totalCostPrice(BigDecimal totalCostPrice) { this.totalCostPrice = totalCostPrice; return this; }
        public Builder profit(BigDecimal profit) { this.profit = profit; return this; }
        public Builder status(OrderStatus status) { this.status = status; return this; }
        public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder cashfreeOrderId(String cashfreeOrderId) { this.cashfreeOrderId = cashfreeOrderId; return this; }
        public Builder paymentSessionId(String paymentSessionId) { this.paymentSessionId = paymentSessionId; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Order build() {
            return new Order(id, orderNumber, tableNumber, customerMobile, customerName, items, note,
                    subtotal, gstPercentage, gstAmount, grandTotal, totalCostPrice, profit,
                    status, paymentStatus, paymentMethod, cashfreeOrderId, paymentSessionId, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public int getTableNumber() { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getGstPercentage() { return gstPercentage; }
    public void setGstPercentage(BigDecimal gstPercentage) { this.gstPercentage = gstPercentage; }

    public BigDecimal getGstAmount() { return gstAmount; }
    public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public BigDecimal getTotalCostPrice() { return totalCostPrice; }
    public void setTotalCostPrice(BigDecimal totalCostPrice) { this.totalCostPrice = totalCostPrice; }

    public BigDecimal getProfit() { return profit; }
    public void setProfit(BigDecimal profit) { this.profit = profit; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCashfreeOrderId() { return cashfreeOrderId; }
    public void setCashfreeOrderId(String cashfreeOrderId) { this.cashfreeOrderId = cashfreeOrderId; }

    public String getPaymentSessionId() { return paymentSessionId; }
    public void setPaymentSessionId(String paymentSessionId) { this.paymentSessionId = paymentSessionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
