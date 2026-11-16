package com.spiceroute.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminDto {

    public static class AdminStatsResponse {
        private String range;
        private BigDecimal totalSales;
        private long totalOrders;
        private BigDecimal averageOrderValue;
        private BigDecimal totalGstCollected;
        private BigDecimal totalProfit;
        private List<SalesTrendPoint> salesTrend;
        private List<TopItemStat> topSellingItems;
        private List<PeakHourStat> peakHours;

        public AdminStatsResponse() {}

        public AdminStatsResponse(String range, BigDecimal totalSales, long totalOrders,
                                  BigDecimal averageOrderValue, BigDecimal totalGstCollected,
                                  BigDecimal totalProfit, List<SalesTrendPoint> salesTrend,
                                  List<TopItemStat> topSellingItems, List<PeakHourStat> peakHours) {
            this.range = range;
            this.totalSales = totalSales;
            this.totalOrders = totalOrders;
            this.averageOrderValue = averageOrderValue;
            this.totalGstCollected = totalGstCollected;
            this.totalProfit = totalProfit;
            this.salesTrend = salesTrend;
            this.topSellingItems = topSellingItems;
            this.peakHours = peakHours;
        }

        public String getRange() { return range; }
        public void setRange(String range) { this.range = range; }

        public BigDecimal getTotalSales() { return totalSales; }
        public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

        public long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

        public BigDecimal getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

        public BigDecimal getTotalGstCollected() { return totalGstCollected; }
        public void setTotalGstCollected(BigDecimal totalGstCollected) { this.totalGstCollected = totalGstCollected; }

        public BigDecimal getTotalProfit() { return totalProfit; }
        public void setTotalProfit(BigDecimal totalProfit) { this.totalProfit = totalProfit; }

        public List<SalesTrendPoint> getSalesTrend() { return salesTrend; }
        public void setSalesTrend(List<SalesTrendPoint> salesTrend) { this.salesTrend = salesTrend; }

        public List<TopItemStat> getTopSellingItems() { return topSellingItems; }
        public void setTopSellingItems(List<TopItemStat> topSellingItems) { this.topSellingItems = topSellingItems; }

        public List<PeakHourStat> getPeakHours() { return peakHours; }
        public void setPeakHours(List<PeakHourStat> peakHours) { this.peakHours = peakHours; }
    }

    public static class SalesTrendPoint {
        private String label; // "14 Nov" or "12 PM"
        private BigDecimal sales;
        private int orders;
        private BigDecimal profit;

        public SalesTrendPoint() {}
        public SalesTrendPoint(String label, BigDecimal sales, int orders, BigDecimal profit) {
            this.label = label;
            this.sales = sales;
            this.orders = orders;
            this.profit = profit;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public BigDecimal getSales() { return sales; }
        public void setSales(BigDecimal sales) { this.sales = sales; }
        public int getOrders() { return orders; }
        public void setOrders(int orders) { this.orders = orders; }
        public BigDecimal getProfit() { return profit; }
        public void setProfit(BigDecimal profit) { this.profit = profit; }
    }

    public static class TopItemStat {
        private String name;
        private String category;
        private int quantity;
        private BigDecimal revenue;

        public TopItemStat() {}
        public TopItemStat(String name, String category, int quantity, BigDecimal revenue) {
            this.name = name;
            this.category = category;
            this.quantity = quantity;
            this.revenue = revenue;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public static class PeakHourStat {
        private int hour;
        private String hourLabel; // "1 PM"
        private int orderCount;
        private BigDecimal sales;

        public PeakHourStat() {}
        public PeakHourStat(int hour, String hourLabel, int orderCount, BigDecimal sales) {
            this.hour = hour;
            this.hourLabel = hourLabel;
            this.orderCount = orderCount;
            this.sales = sales;
        }

        public int getHour() { return hour; }
        public void setHour(int hour) { this.hour = hour; }
        public String getHourLabel() { return hourLabel; }
        public void setHourLabel(String hourLabel) { this.hourLabel = hourLabel; }
        public int getOrderCount() { return orderCount; }
        public void setOrderCount(int orderCount) { this.orderCount = orderCount; }
        public BigDecimal getSales() { return sales; }
        public void setSales(BigDecimal sales) { this.sales = sales; }
    }

    public static class CustomerStatDto {
        private String customerName;
        private String customerMobile;
        private int totalOrders;
        private BigDecimal totalSpent;
        private LocalDateTime lastOrderDate;

        public CustomerStatDto() {}
        public CustomerStatDto(String customerName, String customerMobile, int totalOrders, BigDecimal totalSpent, LocalDateTime lastOrderDate) {
            this.customerName = customerName;
            this.customerMobile = customerMobile;
            this.totalOrders = totalOrders;
            this.totalSpent = totalSpent;
            this.lastOrderDate = lastOrderDate;
        }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerMobile() { return customerMobile; }
        public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }
        public int getTotalOrders() { return totalOrders; }
        public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }
        public BigDecimal getTotalSpent() { return totalSpent; }
        public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }
        public LocalDateTime getLastOrderDate() { return lastOrderDate; }
        public void setLastOrderDate(LocalDateTime lastOrderDate) { this.lastOrderDate = lastOrderDate; }
    }
}

