package com.ankit14.fooddeliverybackend.service;

import com.ankit14.fooddeliverybackend.dto.common.PagedResponse;
import com.ankit14.fooddeliverybackend.dto.restaurant.RestaurantRequest;
import com.ankit14.fooddeliverybackend.dto.restaurant.RestaurantResponse;
import com.ankit14.fooddeliverybackend.exception.ResourceNotFoundException;
import com.ankit14.fooddeliverybackend.model.Restaurant;
import com.ankit14.fooddeliverybackend.model.User;
import com.ankit14.fooddeliverybackend.repository.RestaurantRepository;
import com.ankit14.fooddeliverybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for restaurant operations.
 */
@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<RestaurantResponse> getAllRestaurants(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Restaurant> restaurants = restaurantRepository.findByIsActiveTrue(pageable);
        return buildPagedResponse(restaurants);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RestaurantResponse> searchRestaurants(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantRepository.searchRestaurants(query, pageable);
        return buildPagedResponse(restaurants);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RestaurantResponse> getRestaurantsByCuisine(String cuisine, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantRepository.findByCuisineContainingIgnoreCaseAndIsActiveTrue(cuisine,
                pageable);
        return buildPagedResponse(restaurants);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RestaurantResponse> getRestaurantsByCity(String city, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantRepository.findByCityContainingIgnoreCaseAndIsActiveTrue(city,
                pageable);
        return buildPagedResponse(restaurants);
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getTopRatedRestaurants(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return restaurantRepository.findTopRatedRestaurants(pageable).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
        return mapToResponse(restaurant);
    }

    @Transactional
    public RestaurantResponse createRestaurant(RestaurantRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .cuisine(request.getCuisine())
                .imageUrl(request.getImageUrl())
                .address(request.getAddress())
                .city(request.getCity())
                .phone(request.getPhone())
                .deliveryTime(request.getDeliveryTime())
                .minOrder(request.getMinOrder() != null ? request.getMinOrder() : 0.0)
                .deliveryFee(request.getDeliveryFee() != null ? request.getDeliveryFee() : 0.0)
                .owner(owner)
                .isOpen(true)
                .isActive(true)
                .build();

        restaurant = restaurantRepository.save(restaurant);
        return mapToResponse(restaurant);
    }

    @Transactional
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setAddress(request.getAddress());
        restaurant.setCity(request.getCity());
        restaurant.setPhone(request.getPhone());
        restaurant.setDeliveryTime(request.getDeliveryTime());
        if (request.getMinOrder() != null)
            restaurant.setMinOrder(request.getMinOrder());
        if (request.getDeliveryFee() != null)
            restaurant.setDeliveryFee(request.getDeliveryFee());

        restaurant = restaurantRepository.save(restaurant);
        return mapToResponse(restaurant);
    }

    @Transactional
    public void toggleRestaurantStatus(Long id, boolean isOpen) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
        restaurant.setIsOpen(isOpen);
        restaurantRepository.save(restaurant);
    }

    @Transactional
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
        restaurant.setIsActive(false);
        restaurantRepository.save(restaurant);
    }

    private RestaurantResponse mapToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .cuisine(restaurant.getCuisine())
                .rating(restaurant.getRating())
                .totalRatings(restaurant.getTotalRatings())
                .imageUrl(restaurant.getImageUrl())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .phone(restaurant.getPhone())
                .isOpen(restaurant.getIsOpen())
                .deliveryTime(restaurant.getDeliveryTime())
                .minOrder(restaurant.getMinOrder())
                .deliveryFee(restaurant.getDeliveryFee())
                .ownerId(restaurant.getOwner() != null ? restaurant.getOwner().getId() : null)
                .ownerName(restaurant.getOwner() != null ? restaurant.getOwner().getName() : null)
                .createdAt(restaurant.getCreatedAt())
                .build();
    }

    private PagedResponse<RestaurantResponse> buildPagedResponse(Page<Restaurant> page) {
        List<RestaurantResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<RestaurantResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
