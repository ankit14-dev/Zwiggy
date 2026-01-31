package com.ankit14.fooddeliverybackend.repository;

import com.ankit14.fooddeliverybackend.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Restaurant entity with filtering support.
 */
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {

    Page<Restaurant> findByIsActiveTrue(Pageable pageable);

    Page<Restaurant> findByIsActiveTrueAndIsOpenTrue(Pageable pageable);

    Page<Restaurant> findByCuisineContainingIgnoreCaseAndIsActiveTrue(String cuisine, Pageable pageable);

    Page<Restaurant> findByCityContainingIgnoreCaseAndIsActiveTrue(String city, Pageable pageable);

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND r.rating >= :rating")
    Page<Restaurant> findByMinRating(@Param("rating") Double rating, Pageable pageable);

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND " +
            "(LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Restaurant> searchRestaurants(@Param("search") String search, Pageable pageable);

    List<Restaurant> findByOwnerId(Long ownerId);

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true ORDER BY r.rating DESC")
    List<Restaurant> findTopRatedRestaurants(Pageable pageable);
}
