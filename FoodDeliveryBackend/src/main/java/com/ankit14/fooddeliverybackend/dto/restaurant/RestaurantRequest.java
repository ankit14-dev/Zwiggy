package com.ankit14.fooddeliverybackend.dto.restaurant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for restaurant creation/update request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRequest {

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;

    @NotBlank(message = "Cuisine type is required")
    private String cuisine;

    private String imageUrl;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String phone;

    private String deliveryTime;

    @PositiveOrZero(message = "Minimum order must be positive or zero")
    private Double minOrder;

    @PositiveOrZero(message = "Delivery fee must be positive or zero")
    private Double deliveryFee;
}
