package com.ankit14.fooddeliverybackend.repository;

import com.ankit14.fooddeliverybackend.model.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for MenuItem entity.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);

    List<MenuItem> findByRestaurantId(Long restaurantId);

    Page<MenuItem> findByRestaurantId(Long restaurantId, Pageable pageable);

    List<MenuItem> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    @Query("SELECT m FROM MenuItem m WHERE m.restaurant.id = :restaurantId AND m.isVeg = true AND m.isAvailable = true")
    List<MenuItem> findVegItemsByRestaurant(@Param("restaurantId") Long restaurantId);

    @Query("SELECT m FROM MenuItem m WHERE m.restaurant.id = :restaurantId AND m.isBestseller = true AND m.isAvailable = true")
    List<MenuItem> findBestsellersByRestaurant(@Param("restaurantId") Long restaurantId);

    @Query("SELECT m FROM MenuItem m WHERE m.isAvailable = true AND " +
            "LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<MenuItem> searchMenuItems(@Param("search") String search, Pageable pageable);
}
