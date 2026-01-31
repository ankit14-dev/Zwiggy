package com.ankit14.fooddeliverybackend.service;

import com.ankit14.fooddeliverybackend.dto.analytics.*;
import com.ankit14.fooddeliverybackend.model.Order;
import com.ankit14.fooddeliverybackend.model.OrderStatus;
import com.ankit14.fooddeliverybackend.model.Payment;
import com.ankit14.fooddeliverybackend.model.PaymentStatus;
import com.ankit14.fooddeliverybackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for analytics and reporting.
 */
@Service
@RequiredArgsConstructor
public class AnalyticsService {

        private final OrderRepository orderRepository;
        private final UserRepository userRepository;
        private final RestaurantRepository restaurantRepository;
        private final MenuItemRepository menuItemRepository;

        @Transactional(readOnly = true)
        public DashboardStatsResponse getDashboardStats() {
                List<Order> allOrders = orderRepository.findAll();

                long totalOrders = allOrders.size();
                long pendingOrders = allOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.PLACED
                                                || o.getStatus() == OrderStatus.CONFIRMED)
                                .count();
                long completedOrders = allOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                                .count();
                long cancelledOrders = allOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                                .count();

                BigDecimal totalRevenue = allOrders.stream()
                                .filter(o -> o.getPayment() != null
                                                && o.getPayment().getStatus() == PaymentStatus.SUCCESS)
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                BigDecimal todayRevenue = allOrders.stream()
                                .filter(o -> o.getPayment() != null
                                                && o.getPayment().getStatus() == PaymentStatus.SUCCESS)
                                .filter(o -> o.getCreatedAt().isAfter(todayStart))
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                double avgOrderValue = totalOrders > 0
                                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                                                .doubleValue()
                                : 0.0;

                return DashboardStatsResponse.builder()
                                .totalOrders(totalOrders)
                                .pendingOrders(pendingOrders)
                                .completedOrders(completedOrders)
                                .cancelledOrders(cancelledOrders)
                                .totalRevenue(totalRevenue)
                                .todayRevenue(todayRevenue)
                                .totalUsers(userRepository.count())
                                .totalRestaurants(restaurantRepository.count())
                                .totalMenuItems(menuItemRepository.count())
                                .averageOrderValue(avgOrderValue)
                                .build();
        }

        @Transactional(readOnly = true)
        public OrderStatsResponse getOrderStats() {
                List<Order> allOrders = orderRepository.findAll();

                Map<String, Long> ordersByStatus = allOrders.stream()
                                .collect(Collectors.groupingBy(
                                                o -> o.getStatus().name(),
                                                Collectors.counting()));

                Map<String, Long> ordersByPaymentStatus = allOrders.stream()
                                .filter(o -> o.getPayment() != null)
                                .collect(Collectors.groupingBy(
                                                o -> o.getPayment().getStatus().name(),
                                                Collectors.counting()));

                BigDecimal totalAmount = allOrders.stream()
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                double avgOrderValue = !allOrders.isEmpty()
                                ? totalAmount.divide(BigDecimal.valueOf(allOrders.size()), 2, RoundingMode.HALF_UP)
                                                .doubleValue()
                                : 0.0;

                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime weekStart = LocalDate.now().minusDays(7).atStartOfDay();
                LocalDateTime monthStart = LocalDate.now().minusDays(30).atStartOfDay();

                long todayOrders = allOrders.stream().filter(o -> o.getCreatedAt().isAfter(todayStart)).count();
                long weekOrders = allOrders.stream().filter(o -> o.getCreatedAt().isAfter(weekStart)).count();
                long monthOrders = allOrders.stream().filter(o -> o.getCreatedAt().isAfter(monthStart)).count();

                return OrderStatsResponse.builder()
                                .totalOrders((long) allOrders.size())
                                .ordersByStatus(ordersByStatus)
                                .ordersByPaymentStatus(ordersByPaymentStatus)
                                .averageOrderValue(avgOrderValue)
                                .todayOrders(todayOrders)
                                .weekOrders(weekOrders)
                                .monthOrders(monthOrders)
                                .build();
        }

        @Transactional(readOnly = true)
        public RevenueStatsResponse getRevenueStats() {
                List<Order> paidOrders = orderRepository.findAll().stream()
                                .filter(o -> o.getPayment() != null
                                                && o.getPayment().getStatus() == PaymentStatus.SUCCESS)
                                .toList();

                BigDecimal totalRevenue = paidOrders.stream()
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime weekStart = LocalDate.now().minusDays(7).atStartOfDay();
                LocalDateTime monthStart = LocalDate.now().minusDays(30).atStartOfDay();

                BigDecimal todayRevenue = paidOrders.stream()
                                .filter(o -> o.getCreatedAt().isAfter(todayStart))
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal weeklyRevenue = paidOrders.stream()
                                .filter(o -> o.getCreatedAt().isAfter(weekStart))
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal monthlyRevenue = paidOrders.stream()
                                .filter(o -> o.getCreatedAt().isAfter(monthStart))
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Daily revenue for last 7 days
                List<RevenueStatsResponse.DailyRevenue> dailyRevenues = new ArrayList<>();
                for (int i = 6; i >= 0; i--) {
                        LocalDate date = LocalDate.now().minusDays(i);
                        LocalDateTime dayStart = date.atStartOfDay();
                        LocalDateTime dayEnd = date.atTime(LocalTime.MAX);

                        List<Order> dayOrders = paidOrders.stream()
                                        .filter(o -> o.getCreatedAt().isAfter(dayStart)
                                                        && o.getCreatedAt().isBefore(dayEnd))
                                        .toList();

                        BigDecimal dayRevenue = dayOrders.stream()
                                        .map(Order::getTotalAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        dailyRevenues.add(RevenueStatsResponse.DailyRevenue.builder()
                                        .date(date)
                                        .revenue(dayRevenue)
                                        .orderCount((long) dayOrders.size())
                                        .build());
                }

                return RevenueStatsResponse.builder()
                                .totalRevenue(totalRevenue)
                                .monthlyRevenue(monthlyRevenue)
                                .weeklyRevenue(weeklyRevenue)
                                .todayRevenue(todayRevenue)
                                .dailyRevenues(dailyRevenues)
                                .build();
        }

        @Transactional(readOnly = true)
        public PopularItemsResponse getPopularItems(int limit) {
                List<Order> completedOrders = orderRepository.findAll().stream()
                                .filter(o -> o.getPayment() != null
                                                && o.getPayment().getStatus() == PaymentStatus.SUCCESS)
                                .toList();

                // Count orders per menu item
                Map<Long, Long> itemOrderCounts = new HashMap<>();
                Map<Long, BigDecimal> itemRevenues = new HashMap<>();

                for (Order order : completedOrders) {
                        for (var item : order.getItems()) {
                                Long itemId = item.getMenuItem().getId();
                                itemOrderCounts.merge(itemId, (long) item.getQuantity(), Long::sum);
                                BigDecimal itemTotal = item.getUnitPrice()
                                                .multiply(BigDecimal.valueOf(item.getQuantity()));
                                itemRevenues.merge(itemId, itemTotal, BigDecimal::add);
                        }
                }

                // Sort by order count and take top items
                List<PopularItemsResponse.PopularItem> popularItems = itemOrderCounts.entrySet().stream()
                                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                                .limit(limit)
                                .map(entry -> {
                                        var menuItem = menuItemRepository.findById(entry.getKey()).orElse(null);
                                        if (menuItem == null)
                                                return null;

                                        return PopularItemsResponse.PopularItem.builder()
                                                        .menuItemId(menuItem.getId())
                                                        .name(menuItem.getName())
                                                        .restaurantName(menuItem.getRestaurant().getName())
                                                        .price(menuItem.getPrice())
                                                        .orderCount(entry.getValue())
                                                        .totalRevenue(itemRevenues.getOrDefault(entry.getKey(),
                                                                        BigDecimal.ZERO))
                                                        .imageUrl(menuItem.getImageUrl())
                                                        .build();
                                })
                                .filter(Objects::nonNull)
                                .toList();

                return PopularItemsResponse.builder()
                                .items(popularItems)
                                .build();
        }

        @Transactional(readOnly = true)
        public RestaurantStatsResponse getRestaurantStats() {
                var restaurants = restaurantRepository.findAll();
                List<Order> allOrders = orderRepository.findAll();

                List<RestaurantStatsResponse.RestaurantStats> stats = restaurants.stream()
                                .map(restaurant -> {
                                        List<Order> restaurantOrders = allOrders.stream()
                                                        .filter(o -> o.getRestaurant().getId()
                                                                        .equals(restaurant.getId()))
                                                        .toList();

                                        BigDecimal revenue = restaurantOrders.stream()
                                                        .filter(o -> o.getPayment() != null
                                                                        && o.getPayment()
                                                                                        .getStatus() == PaymentStatus.SUCCESS)
                                                        .map(Order::getTotalAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        return RestaurantStatsResponse.RestaurantStats.builder()
                                                        .restaurantId(restaurant.getId())
                                                        .name(restaurant.getName())
                                                        .totalOrders((long) restaurantOrders.size())
                                                        .totalRevenue(revenue)
                                                        .averageRating(restaurant.getRating())
                                                        .menuItemCount((long) restaurant.getMenuItems().size())
                                                        .isOpen(restaurant.getIsOpen())
                                                        .build();
                                })
                                .sorted((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()))
                                .toList();

                return RestaurantStatsResponse.builder()
                                .restaurants(stats)
                                .build();
        }
}
