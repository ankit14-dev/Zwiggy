package com.ankit14.fooddeliverybackend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Restaurant performance analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantStatsResponse {
    private List<RestaurantStats> restaurants;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RestaurantStats {
        private Long restaurantId;
        private String name;
        private Long totalOrders;
        private BigDecimal totalRevenue;
        private Double averageRating;
        private Long menuItemCount;
        private Boolean isOpen;
    }
}
