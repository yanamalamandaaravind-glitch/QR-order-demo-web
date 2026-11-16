package com.spiceroute.controller;

import com.spiceroute.dto.ApiResponse;
import com.spiceroute.dto.OrderDto;
import com.spiceroute.model.Order;
import com.spiceroute.security.UserPrincipal;
import com.spiceroute.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody OrderDto.CreateOrderRequest request) {
        UserPrincipal principal = getCurrentUserPrincipal();
        Order created = orderService.createOrder(request, principal);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", created));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable String id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(ApiResponse.ok(order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/orders/my")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders() {
        UserPrincipal principal = getCurrentUserPrincipal();
        if (principal == null || principal.getUsernameOrMobile() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Customer authentication required"));
        }
        List<Order> orders = orderService.getOrdersByCustomerMobile(principal.getUsernameOrMobile());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody OrderDto.UpdateStatusRequest request) {
        UserPrincipal principal = getCurrentUserPrincipal();
        try {
            Order updated = orderService.updateOrderStatus(id, request.getStatus(), principal);
            return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/kitchen/orders")
    @PreAuthorize("hasAnyRole('KITCHEN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getKitchenOrders() {
        List<Order> orders = orderService.getKitchenOrders();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    private UserPrincipal getCurrentUserPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof UserPrincipal principal) {
            return principal;
        }
        return null;
    }
}

