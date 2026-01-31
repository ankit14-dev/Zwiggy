package com.ankit14.fooddeliverybackend.controller;

import com.ankit14.fooddeliverybackend.dto.analytics.*;
import com.ankit14.fooddeliverybackend.dto.common.ApiResponse;
import com.ankit14.fooddeliverybackend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Analytics endpoints for admin dashboard.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Admin analytics and reporting APIs")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics", description = "Overview stats including orders, revenue, users")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/orders/stats")
    @Operation(summary = "Get order statistics", description = "Order breakdown by status and time periods")
    public ResponseEntity<ApiResponse<OrderStatsResponse>> getOrderStats() {
        OrderStatsResponse stats = analyticsService.getOrderStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get revenue statistics", description = "Revenue metrics with daily breakdown")
    public ResponseEntity<ApiResponse<RevenueStatsResponse>> getRevenueStats() {
        RevenueStatsResponse stats = analyticsService.getRevenueStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/popular-items")
    @Operation(summary = "Get popular menu items", description = "Top selling items by order count")
    public ResponseEntity<ApiResponse<PopularItemsResponse>> getPopularItems(
            @RequestParam(defaultValue = "10") int limit) {
        PopularItemsResponse stats = analyticsService.getPopularItems(limit);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/restaurants/stats")
    @Operation(summary = "Get restaurant statistics", description = "Performance metrics for all restaurants")
    public ResponseEntity<ApiResponse<RestaurantStatsResponse>> getRestaurantStats() {
        RestaurantStatsResponse stats = analyticsService.getRestaurantStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
