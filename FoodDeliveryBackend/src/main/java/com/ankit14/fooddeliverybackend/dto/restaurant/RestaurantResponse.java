package com.ankit14.fooddeliverybackend.dto.restaurant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for restaurant response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {

    private Long id;
    private String name;
    private String description;
    private String cuisine;
    private Double rating;
    private Integer totalRatings;
    private String imageUrl;
    private String address;
    private String city;
    private String phone;
    private Boolean isOpen;
    private String deliveryTime;
    private Double minOrder;
    private Double deliveryFee;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
