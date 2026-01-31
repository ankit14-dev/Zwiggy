package com.ankit14.fooddeliverybackend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Order statistics by status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatsResponse {
    private Long totalOrders;
    private Map<String, Long> ordersByStatus;
    private Map<String, Long> ordersByPaymentStatus;
    private Double averageOrderValue;
    private Long todayOrders;
    private Long weekOrders;
    private Long monthOrders;
}
