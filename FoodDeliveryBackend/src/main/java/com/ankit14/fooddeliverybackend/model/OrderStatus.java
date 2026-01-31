package com.ankit14.fooddeliverybackend.model;

/**
 * Enum representing order statuses.
 */
public enum OrderStatus {
    PLACED,
    CONFIRMED,
    PREPARING,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}
