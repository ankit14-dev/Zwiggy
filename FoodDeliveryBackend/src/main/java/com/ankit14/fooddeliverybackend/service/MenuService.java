package com.ankit14.fooddeliverybackend.service;

import com.ankit14.fooddeliverybackend.dto.menu.MenuItemRequest;
import com.ankit14.fooddeliverybackend.dto.menu.MenuItemResponse;
import com.ankit14.fooddeliverybackend.exception.ResourceNotFoundException;
import com.ankit14.fooddeliverybackend.model.Category;
import com.ankit14.fooddeliverybackend.model.MenuItem;
import com.ankit14.fooddeliverybackend.model.Restaurant;
import com.ankit14.fooddeliverybackend.repository.CategoryRepository;
import com.ankit14.fooddeliverybackend.repository.MenuItemRepository;
import com.ankit14.fooddeliverybackend.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for menu item operations.
 */
@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMenuItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAllMenuItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getVegItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findVegItemsByRestaurant(restaurantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getBestsellersByRestaurant(Long restaurantId) {
        return menuItemRepository.findBestsellersByRestaurant(restaurantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> searchMenuItems(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MenuItem> items = menuItemRepository.searchMenuItems(query, pageable);
        return items.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        return mapToResponse(menuItem);
    }

    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        MenuItem menuItem = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(category)
                .restaurant(restaurant)
                .isAvailable(true)
                .isVeg(request.getIsVeg() != null ? request.getIsVeg() : false)
                .isBestseller(request.getIsBestseller() != null ? request.getIsBestseller() : false)
                .preparationTime(request.getPreparationTime())
                .build();

        menuItem = menuItemRepository.save(menuItem);
        return mapToResponse(menuItem);
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            menuItem.setCategory(category);
        }

        if (request.getIsVeg() != null)
            menuItem.setIsVeg(request.getIsVeg());
        if (request.getIsBestseller() != null)
            menuItem.setIsBestseller(request.getIsBestseller());
        if (request.getPreparationTime() != null)
            menuItem.setPreparationTime(request.getPreparationTime());

        menuItem = menuItemRepository.save(menuItem);
        return mapToResponse(menuItem);
    }

    @Transactional
    public void toggleAvailability(Long id, boolean isAvailable) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        menuItem.setIsAvailable(isAvailable);
        menuItemRepository.save(menuItem);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("MenuItem", "id", id);
        }
        menuItemRepository.deleteById(id);
    }

    private MenuItemResponse mapToResponse(MenuItem menuItem) {
        return MenuItemResponse.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .imageUrl(menuItem.getImageUrl())
                .categoryId(menuItem.getCategory() != null ? menuItem.getCategory().getId() : null)
                .categoryName(menuItem.getCategory() != null ? menuItem.getCategory().getName() : null)
                .restaurantId(menuItem.getRestaurant().getId())
                .restaurantName(menuItem.getRestaurant().getName())
                .isAvailable(menuItem.getIsAvailable())
                .isVeg(menuItem.getIsVeg())
                .isBestseller(menuItem.getIsBestseller())
                .preparationTime(menuItem.getPreparationTime())
                .build();
    }
}
