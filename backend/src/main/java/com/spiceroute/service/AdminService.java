package com.spiceroute.service;

import com.spiceroute.dto.AdminDto;
import com.spiceroute.model.Order;
import com.spiceroute.model.OrderItem;
import com.spiceroute.model.OrderStatus;
import com.spiceroute.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final OrderRepository orderRepository;

    public AdminService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public AdminDto.AdminStatsResponse getStats(String range) {
        String cleanRange = range != null ? range.toLowerCase().trim() : "month";
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime;

        switch (cleanRange) {
            case "today":
                startTime = now.toLocalDate().atStartOfDay();
                break;
            case "week":
                startTime = now.minusDays(7).toLocalDate().atStartOfDay();
                break;
            case "month":
            default:
                startTime = now.minusDays(30).toLocalDate().atStartOfDay();
                break;
        }

        List<Order> allOrders = orderRepository.findAll();
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startTime))
                .toList();

        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal totalGst = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        long totalOrders = filteredOrders.size();

        Map<String, AdminDto.TopItemStat> itemAgg = new HashMap<>();
        Map<Integer, int[]> hourlyAgg = new HashMap<>(); // [count, salesCents]
        Map<String, BigDecimal[]> dateTrendAgg = new TreeMap<>(); // dateStr -> [sales, profit, count]

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM");

        for (Order o : filteredOrders) {
            BigDecimal grandTotal = o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO;
            BigDecimal gst = o.getGstAmount() != null ? o.getGstAmount() : BigDecimal.ZERO;
            BigDecimal profit = o.getProfit() != null ? o.getProfit() : BigDecimal.ZERO;

            totalSales = totalSales.add(grandTotal);
            totalGst = totalGst.add(gst);
            totalProfit = totalProfit.add(profit);

            // Hourly stats
            int hour = o.getCreatedAt().getHour();
            int[] hData = hourlyAgg.computeIfAbsent(hour, k -> new int[2]);
            hData[0] += 1;
            hData[1] += grandTotal.intValue();

            // Date trend
            String dateLabel = o.getCreatedAt().format(dateFormatter);
            BigDecimal[] dData = dateTrendAgg.computeIfAbsent(dateLabel, k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO});
            dData[0] = dData[0].add(grandTotal);
            dData[1] = dData[1].add(profit);
            dData[2] = dData[2].add(BigDecimal.ONE);

            // Items breakdown
            if (o.getItems() != null) {
                for (OrderItem item : o.getItems()) {
                    String name = item.getName();
                    AdminDto.TopItemStat stat = itemAgg.computeIfAbsent(name, k -> new AdminDto.TopItemStat(name, "", 0, BigDecimal.ZERO));
                    stat.setQuantity(stat.getQuantity() + item.getQuantity());
                    BigDecimal itemRev = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    stat.setRevenue(stat.getRevenue().add(itemRev));
                }
            }
        }

        BigDecimal aov = totalOrders > 0
                ? totalSales.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Sort Top Items by Quantity Descending
        List<AdminDto.TopItemStat> topItems = itemAgg.values().stream()
                .sorted(Comparator.comparing(AdminDto.TopItemStat::getQuantity, Comparator.reverseOrder()))
                .limit(8)
                .toList();

        // Build Trend list
        List<AdminDto.SalesTrendPoint> salesTrend = dateTrendAgg.entrySet().stream()
                .map(e -> new AdminDto.SalesTrendPoint(e.getKey(), e.getValue()[0], e.getValue()[2].intValue(), e.getValue()[1]))
                .toList();

        // Build Peak Hours (11 AM to 11 PM or all active)
        List<AdminDto.PeakHourStat> peakHours = new ArrayList<>();
        for (int h = 11; h <= 23; h++) {
            int[] hData = hourlyAgg.getOrDefault(h, new int[]{0, 0});
            String label = (h == 12 ? "12 PM" : (h > 12 ? (h - 12) + " PM" : h + " AM"));
            peakHours.add(new AdminDto.PeakHourStat(h, label, hData[0], BigDecimal.valueOf(hData[1])));
        }

        return new AdminDto.AdminStatsResponse(
                cleanRange,
                totalSales.setScale(2, RoundingMode.HALF_UP),
                totalOrders,
                aov,
                totalGst.setScale(2, RoundingMode.HALF_UP),
                totalProfit.setScale(2, RoundingMode.HALF_UP),
                salesTrend,
                topItems,
                peakHours
        );
    }

    public List<AdminDto.CustomerStatDto> getCustomers() {
        List<Order> orders = orderRepository.findAll();
        Map<String, AdminDto.CustomerStatDto> customerMap = new HashMap<>();

        for (Order o : orders) {
            String mobile = o.getCustomerMobile();
            if (mobile == null || mobile.isBlank()) continue;

            AdminDto.CustomerStatDto stat = customerMap.computeIfAbsent(mobile, k ->
                    new AdminDto.CustomerStatDto(o.getCustomerName(), mobile, 0, BigDecimal.ZERO, o.getCreatedAt())
            );

            stat.setTotalOrders(stat.getTotalOrders() + 1);
            BigDecimal orderTotal = o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO;
            stat.setTotalSpent(stat.getTotalSpent().add(orderTotal));

            if (stat.getLastOrderDate() == null || (o.getCreatedAt() != null && o.getCreatedAt().isAfter(stat.getLastOrderDate()))) {
                stat.setLastOrderDate(o.getCreatedAt());
                if (o.getCustomerName() != null && !o.getCustomerName().isBlank()) {
                    stat.setCustomerName(o.getCustomerName());
                }
            }
        }

        return customerMap.values().stream()
                .sorted(Comparator.comparing(AdminDto.CustomerStatDto::getTotalSpent, Comparator.reverseOrder()))
                .toList();
    }

    public List<Order> getFilteredOrders(String range, String status, String search) {
        List<Order> all = orderRepository.findAll();

        return all.stream()
                .filter(o -> {
                    // Range filter
                    if (range != null && !range.isBlank() && !range.equalsIgnoreCase("all")) {
                        LocalDateTime start;
                        if ("today".equalsIgnoreCase(range)) {
                            start = LocalDate.now().atStartOfDay();
                        } else if ("week".equalsIgnoreCase(range)) {
                            start = LocalDate.now().minusDays(7).atStartOfDay();
                        } else {
                            start = LocalDate.now().minusDays(30).atStartOfDay();
                        }
                        if (o.getCreatedAt() != null && o.getCreatedAt().isBefore(start)) {
                            return false;
                        }
                    }

                    // Status filter
                    if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
                        if (!status.equalsIgnoreCase(o.getStatus().name())) {
                            return false;
                        }
                    }

                    // Search keyword
                    if (search != null && !search.isBlank()) {
                        String q = search.toLowerCase().trim();
                        boolean matchesNum = o.getOrderNumber() != null && o.getOrderNumber().toLowerCase().contains(q);
                        boolean matchesName = o.getCustomerName() != null && o.getCustomerName().toLowerCase().contains(q);
                        boolean matchesMobile = o.getCustomerMobile() != null && o.getCustomerMobile().contains(q);
                        if (!matchesNum && !matchesName && !matchesMobile) return false;
                    }

                    return true;
                })
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }
}

