package com.ankit14.fooddeliverybackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodDeliveryBackendApplication {

    public static void main(String[] args) {
        System.out.println("Loading .env file...");
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
                System.out.println("Loaded property: " + entry.getKey());
            });
            System.out.println("JWT_SECRET set: " + (System.getProperty("JWT_SECRET") != null));
        } catch (Exception e) {
            System.err.println("Failed to load .env: " + e.getMessage());
            e.printStackTrace();
        }

        SpringApplication.run(FoodDeliveryBackendApplication.class, args);
    }

}
