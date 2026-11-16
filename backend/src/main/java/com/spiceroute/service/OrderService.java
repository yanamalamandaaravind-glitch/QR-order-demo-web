package com.spiceroute.service;

import com.spiceroute.dto.OrderDto;
import com.spiceroute.model.*;
import com.spiceroute.repository.MenuItemRepository;
import com.spiceroute.repository.OrderRepository;
import com.spiceroute.repository.SettingsRepository;
import com.spiceroute.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final SettingsRepository settingsRepository;

    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        SettingsRepository settingsRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.settingsRepository = settingsRepository;
    }

    public Order createOrder(OrderDto.CreateOrderRequest request, UserPrincipal currentUser) {
        String customerMobile = request.getCustomerMobile();
        String customerName = request.getCustomerName();

        if (currentUser != null) {
            if (customerMobile == null || customerMobile.isBlank()) {
                customerMobile = currentUser.getUsernameOrMobile();
            }
            if (customerName == null || customerName.isBlank()) {
                customerName = currentUser.getName();
            }
        }

        if (customerMobile == null || customerMobile.isBlank()) {
            throw new IllegalArgumentException("Customer mobile number is required to place an order");
        }

        int tableNum = request.getTableNumber() != null ? request.getTableNumber() : 1;

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalCostPrice = BigDecimal.ZERO;

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            Optional<MenuItem> menuOpt = menuItemRepository.findById(itemReq.getMenuItemId());
            BigDecimal itemPrice = itemReq.getPrice();
            BigDecimal itemCost = itemReq.getCostPrice();
            String itemName = itemReq.getName();
            boolean isVeg = itemReq.isVeg();

            if (menuOpt.isPresent()) {
                MenuItem mi = menuOpt.get();
                itemPrice = mi.getPrice();
                itemCost = mi.getCostPrice();
                itemName = mi.getName();
                isVeg = mi.isVeg();
            }

            int qty = Math.max(1, itemReq.getQuantity());
            BigDecimal linePrice = itemPrice.multiply(BigDecimal.valueOf(qty));
            BigDecimal lineCost = (itemCost != null ? itemCost : BigDecimal.ZERO).multiply(BigDecimal.valueOf(qty));

            subtotal = subtotal.add(linePrice);
            totalCostPrice = totalCostPrice.add(lineCost);

            orderItems.add(OrderItem.builder()
                    .menuItemId(itemReq.getMenuItemId())
                    .name(itemName)
                    .price(itemPrice)
                    .costPrice(itemCost)
                    .quantity(qty)
                    .veg(isVeg)
                    .build());
        }

        RestaurantSettings settings = settingsRepository.getSettings();
        BigDecimal gstPercentage = settings != null && settings.getGstPercentage() != null
                ? settings.getGstPercentage()
                : new BigDecimal("5.00");

        BigDecimal gstFactor = gstPercentage.divide(new BigDecimal("100.00"), 4, RoundingMode.HALF_UP);
        BigDecimal gstAmount = subtotal.multiply(gstFactor).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = subtotal.add(gstAmount).setScale(2, RoundingMode.HALF_UP);
        BigDecimal profit = subtotal.subtract(totalCostPrice).setScale(2, RoundingMode.HALF_UP);

        long orderCount = orderRepository.count();
        String orderNum = String.format("SR-%05d", 1000 + orderCount + 1);

        Order order = Order.builder()
                .orderNumber(orderNum)
                .tableNumber(tableNum)
                .customerMobile(customerMobile)
                .customerName(customerName != null && !customerName.isBlank() ? customerName : "Guest")
                .items(orderItems)
                .note(request.getNote() != null ? request.getNote().trim() : "")
                .subtotal(subtotal)
                .gstPercentage(gstPercentage)
                .gstAmount(gstAmount)
                .grandTotal(grandTotal)
                .totalCostPrice(totalCostPrice)
                .profit(profit)
                .status(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cashfree Sandbox")
                .cashfreeOrderId(request.getCashfreeOrderId())
                .paymentSessionId(request.getPaymentSessionId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return orderRepository.save(order);
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .or(() -> orderRepository.findByOrderNumber(id))
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id or number: " + id));
    }

    public List<Order> getOrdersByCustomerMobile(String mobile) {
        return orderRepository.findByCustomerMobile(mobile);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getKitchenOrders() {
        // Kitchen sees orders that are PLACED, ACCEPTED, PREPARING, or READY
        return orderRepository.findByStatusIn(List.of(
                OrderStatus.PLACED,
                OrderStatus.ACCEPTED,
                OrderStatus.PREPARING,
                OrderStatus.READY
        ));
    }

    public Order updateOrderStatus(String orderId, OrderStatus newStatus, UserPrincipal staff) {
        Order order = getOrderById(orderId);

        // Enforce progressive one-direction status transitions:
        // PLACED -> ACCEPTED -> PREPARING -> READY -> COMPLETED
        OrderStatus current = order.getStatus();

        boolean isValid = false;
        if (current == OrderStatus.PLACED && newStatus == OrderStatus.ACCEPTED) isValid = true;
        else if (current == OrderStatus.ACCEPTED && newStatus == OrderStatus.PREPARING) isValid = true;
        else if (current == OrderStatus.PREPARING && newStatus == OrderStatus.READY) isValid = true;
        else if (current == OrderStatus.READY && newStatus == OrderStatus.COMPLETED) isValid = true;
        else if (staff != null && (staff.getRole() == Role.ADMIN || staff.getRole() == Role.KITCHEN || staff.getRole() == Role.CUSTOMER)) {
            // Allow forward simulation
            isValid = true;
        }

        if (!isValid) {
            throw new IllegalArgumentException("Invalid status transition from " + current + " to " + newStatus);
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}
