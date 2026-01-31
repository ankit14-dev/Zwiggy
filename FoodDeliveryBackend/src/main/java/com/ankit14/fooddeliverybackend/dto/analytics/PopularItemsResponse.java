package com.ankit14.fooddeliverybackend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Popular menu items response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopularItemsResponse {
    private List<PopularItem> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PopularItem {
        private Long menuItemId;
        private String name;
        private String restaurantName;
        private BigDecimal price;
        private Long orderCount;
        private BigDecimal totalRevenue;
        private String imageUrl;
    }
}
