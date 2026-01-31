package com.ankit14.fooddeliverybackend.repository;

import com.ankit14.fooddeliverybackend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Category entity.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    List<Category> findByIsActiveTrue();

    boolean existsByNameIgnoreCase(String name);
}
