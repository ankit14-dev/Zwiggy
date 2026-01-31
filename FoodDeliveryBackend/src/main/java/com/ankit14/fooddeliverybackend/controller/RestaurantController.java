package com.ankit14.fooddeliverybackend.controller;

import com.ankit14.fooddeliverybackend.dto.common.ApiResponse;
import com.ankit14.fooddeliverybackend.dto.common.PagedResponse;
import com.ankit14.fooddeliverybackend.dto.restaurant.RestaurantRequest;
import com.ankit14.fooddeliverybackend.dto.restaurant.RestaurantResponse;
import com.ankit14.fooddeliverybackend.model.User;
import com.ankit14.fooddeliverybackend.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for restaurant endpoints.
 */
@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurants", description = "Restaurant management APIs")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "Get all restaurants with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<RestaurantResponse>>> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<RestaurantResponse> response = restaurantService.getAllRestaurants(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    @Operation(summary = "Search restaurants by name or cuisine")
    public ResponseEntity<ApiResponse<PagedResponse<RestaurantResponse>>> searchRestaurants(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RestaurantResponse> response = restaurantService.searchRestaurants(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/cuisine/{cuisine}")
    @Operation(summary = "Get restaurants by cuisine")
    public ResponseEntity<ApiResponse<PagedResponse<RestaurantResponse>>> getRestaurantsByCuisine(
            @PathVariable String cuisine,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RestaurantResponse> response = restaurantService.getRestaurantsByCuisine(cuisine, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get restaurants by city")
    public ResponseEntity<ApiResponse<PagedResponse<RestaurantResponse>>> getRestaurantsByCity(
            @PathVariable String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RestaurantResponse> response = restaurantService.getRestaurantsByCity(city, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getTopRatedRestaurants(
            @RequestParam(defaultValue = "10") int limit) {
        List<RestaurantResponse> response = restaurantService.getTopRatedRestaurants(limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant by ID")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse response = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Create a new restaurant")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(
            @Valid @RequestBody RestaurantRequest request,
            @AuthenticationPrincipal User user) {
        RestaurantResponse response = restaurantService.createRestaurant(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Restaurant created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Update restaurant")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request) {
        RestaurantResponse response = restaurantService.updateRestaurant(id, request);
        return ResponseEntity.ok(ApiResponse.success("Restaurant updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Toggle restaurant open/closed status")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(
            @PathVariable Long id,
            @RequestParam boolean isOpen) {
        restaurantService.toggleRestaurantStatus(id, isOpen);
        return ResponseEntity.ok(ApiResponse.success("Status updated", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete restaurant (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant deleted", null));
    }
}
