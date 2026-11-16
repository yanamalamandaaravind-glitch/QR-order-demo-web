package com.spiceroute.repository;

import com.spiceroute.model.Order;
import com.spiceroute.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    List<Order> findAll();
    Optional<Order> findById(String id);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerMobile(String customerMobile);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusIn(List<OrderStatus> statuses);
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    Order save(Order order);
    long count();
}

