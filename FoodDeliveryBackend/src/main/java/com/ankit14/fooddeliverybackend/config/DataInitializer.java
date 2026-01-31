package com.ankit14.fooddeliverybackend.config;

import com.ankit14.fooddeliverybackend.model.*;
import com.ankit14.fooddeliverybackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Data initializer for seeding test data.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // Create admin user
        User admin = User.builder()
                .name("Admin User")
                .email("admin@zwiggy.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("9999999999")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        // Create customer user
        User customer = User.builder()
                .name("Test Customer")
                .email("customer@test.com")
                .password(passwordEncoder.encode("customer123"))
                .phone("9888888888")
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(customer);

        // Create restaurant owner
        User restaurantOwner = User.builder()
                .name("Restaurant Owner")
                .email("restaurant@test.com")
                .password(passwordEncoder.encode("restaurant123"))
                .phone("9777777777")
                .role(Role.RESTAURANT)
                .build();
        userRepository.save(restaurantOwner);

        // Create categories
        Category pizza = categoryRepository
                .save(Category.builder().name("Pizza").description("Italian pizzas").build());
        Category burger = categoryRepository
                .save(Category.builder().name("Burgers").description("Juicy burgers").build());
        Category biryani = categoryRepository
                .save(Category.builder().name("Biryani").description("Aromatic rice dishes").build());
        Category chinese = categoryRepository
                .save(Category.builder().name("Chinese").description("Chinese cuisine").build());
        Category dessert = categoryRepository
                .save(Category.builder().name("Desserts").description("Sweet treats").build());

        // Create restaurants
        Restaurant pizzaPlace = restaurantRepository.save(Restaurant.builder()
                .name("Pizza Palace")
                .description("Best pizzas in town")
                .cuisine("Italian")
                .rating(4.5)
                .address("123 Main Street")
                .city("Mumbai")
                .phone("9111111111")
                .deliveryTime("30-40 mins")
                .minOrder(200.0)
                .deliveryFee(30.0)
                .owner(restaurantOwner)
                .build());

        Restaurant burgerJoint = restaurantRepository.save(Restaurant.builder()
                .name("Burger Barn")
                .description("Gourmet burgers")
                .cuisine("American")
                .rating(4.3)
                .address("456 Park Avenue")
                .city("Mumbai")
                .phone("9222222222")
                .deliveryTime("25-35 mins")
                .minOrder(150.0)
                .deliveryFee(25.0)
                .owner(restaurantOwner)
                .build());

        Restaurant biryaniHouse = restaurantRepository.save(Restaurant.builder()
                .name("Biryani House")
                .description("Authentic Hyderabadi Biryani")
                .cuisine("Indian")
                .rating(4.7)
                .address("789 Food Street")
                .city("Mumbai")
                .phone("9333333333")
                .deliveryTime("35-45 mins")
                .minOrder(250.0)
                .deliveryFee(35.0)
                .owner(restaurantOwner)
                .build());

        // Create menu items for Pizza Palace
        menuItemRepository.saveAll(List.of(
                MenuItem.builder().name("Margherita Pizza").description("Classic tomato and mozzarella")
                        .price(new BigDecimal("299")).category(pizza).restaurant(pizzaPlace).isVeg(true)
                        .isBestseller(true).build(),
                MenuItem.builder().name("Pepperoni Pizza").description("Loaded with pepperoni")
                        .price(new BigDecimal("399")).category(pizza).restaurant(pizzaPlace).isVeg(false)
                        .isBestseller(true).build(),
                MenuItem.builder().name("Veggie Supreme").description("All veg toppings").price(new BigDecimal("349"))
                        .category(pizza).restaurant(pizzaPlace).isVeg(true).build(),
                MenuItem.builder().name("Chocolate Lava Cake").description("Warm chocolate cake")
                        .price(new BigDecimal("149")).category(dessert).restaurant(pizzaPlace).isVeg(true).build()));

        // Create menu items for Burger Barn
        menuItemRepository.saveAll(List.of(
                MenuItem.builder().name("Classic Cheeseburger").description("Beef patty with cheese")
                        .price(new BigDecimal("199")).category(burger).restaurant(burgerJoint).isVeg(false)
                        .isBestseller(true).build(),
                MenuItem.builder().name("Veggie Burger").description("Grilled veggie patty")
                        .price(new BigDecimal("179")).category(burger).restaurant(burgerJoint).isVeg(true).build(),
                MenuItem.builder().name("BBQ Bacon Burger").description("With crispy bacon")
                        .price(new BigDecimal("249")).category(burger).restaurant(burgerJoint).isVeg(false).build(),
                MenuItem.builder().name("Brownie Sundae").description("With vanilla ice cream")
                        .price(new BigDecimal("129")).category(dessert).restaurant(burgerJoint).isVeg(true).build()));

        // Create menu items for Biryani House
        menuItemRepository.saveAll(List.of(
                MenuItem.builder().name("Chicken Biryani").description("Hyderabadi style").price(new BigDecimal("299"))
                        .category(biryani).restaurant(biryaniHouse).isVeg(false).isBestseller(true).build(),
                MenuItem.builder().name("Mutton Biryani").description("Tender mutton pieces")
                        .price(new BigDecimal("399")).category(biryani).restaurant(biryaniHouse).isVeg(false)
                        .isBestseller(true).build(),
                MenuItem.builder().name("Veg Biryani").description("Mixed vegetables").price(new BigDecimal("249"))
                        .category(biryani).restaurant(biryaniHouse).isVeg(true).build(),
                MenuItem.builder().name("Gulab Jamun").description("Sweet dumplings").price(new BigDecimal("99"))
                        .category(dessert).restaurant(biryaniHouse).isVeg(true).build()));

        System.out.println("✅ Sample data seeded successfully!");
        System.out.println("📧 Admin login: admin@zwiggy.com / admin123");
        System.out.println("📧 Customer login: customer@test.com / customer123");
        System.out.println("📧 Restaurant login: restaurant@test.com / restaurant123");
    }
}
