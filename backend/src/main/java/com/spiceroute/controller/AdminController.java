package com.spiceroute.controller;

import com.spiceroute.dto.AdminDto;
import com.spiceroute.dto.ApiResponse;
import com.spiceroute.model.Order;
import com.spiceroute.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDto.AdminStatsResponse>> getStats(
            @RequestParam(required = false, defaultValue = "month") String range) {
        AdminDto.AdminStatsResponse stats = adminService.getStats(range);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<AdminDto.CustomerStatDto>>> getCustomers() {
        List<AdminDto.CustomerStatDto> customers = adminService.getCustomers();
        return ResponseEntity.ok(ApiResponse.ok(customers));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getOrders(
            @RequestParam(required = false, defaultValue = "all") String range,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Order> orders = adminService.getFilteredOrders(range, status, search);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }
}

