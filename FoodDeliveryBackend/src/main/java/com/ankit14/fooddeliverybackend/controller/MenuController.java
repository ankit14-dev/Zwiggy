package com.ankit14.fooddeliverybackend.controller;

import com.ankit14.fooddeliverybackend.dto.common.ApiResponse;
import com.ankit14.fooddeliverybackend.dto.menu.MenuItemRequest;
import com.ankit14.fooddeliverybackend.dto.menu.MenuItemResponse;
import com.ankit14.fooddeliverybackend.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for menu item endpoints.
 */
@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Tag(name = "Menu", description = "Menu item APIs")
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Get menu items by restaurant")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItemResponse> response = menuService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/restaurant/{restaurantId}/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Get all menu items (including unavailable) by restaurant")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAllMenuByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItemResponse> response = menuService.getAllMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/restaurant/{restaurantId}/veg")
    @Operation(summary = "Get vegetarian items by restaurant")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getVegItems(@PathVariable Long restaurantId) {
        List<MenuItemResponse> response = menuService.getVegItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/restaurant/{restaurantId}/bestsellers")
    @Operation(summary = "Get bestseller items by restaurant")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getBestsellers(@PathVariable Long restaurantId) {
        List<MenuItemResponse> response = menuService.getBestsellersByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    @Operation(summary = "Search menu items")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> searchMenuItems(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<MenuItemResponse> response = menuService.searchMenuItems(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable Long id) {
        MenuItemResponse response = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Create a new menu item")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse response = menuService.createMenuItem(request);
        return ResponseEntity.ok(ApiResponse.success("Menu item created", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Update menu item")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse response = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated", response));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Toggle menu item availability")
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(
            @PathVariable Long id,
            @RequestParam boolean isAvailable) {
        menuService.toggleAvailability(id, isAvailable);
        return ResponseEntity.ok(ApiResponse.success("Availability updated", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT')")
    @Operation(summary = "Delete menu item")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted", null));
    }
}
