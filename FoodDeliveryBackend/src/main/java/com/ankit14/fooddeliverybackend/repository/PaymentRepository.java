package com.ankit14.fooddeliverybackend.repository;

import com.ankit14.fooddeliverybackend.model.Payment;
import com.ankit14.fooddeliverybackend.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Payment entity.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    boolean existsByOrderIdAndStatus(Long orderId, PaymentStatus status);
}
