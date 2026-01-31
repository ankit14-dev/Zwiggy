package com.ankit14.fooddeliverybackend.dto.menu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for menu item response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Long restaurantId;
    private String restaurantName;
    private Boolean isAvailable;
    private Boolean isVeg;
    private Boolean isBestseller;
    private Integer preparationTime;
}
