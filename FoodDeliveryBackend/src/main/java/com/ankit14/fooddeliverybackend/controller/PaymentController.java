package com.ankit14.fooddeliverybackend.controller;

import com.ankit14.fooddeliverybackend.dto.common.ApiResponse;
import com.ankit14.fooddeliverybackend.dto.payment.PaymentResponse;
import com.ankit14.fooddeliverybackend.dto.payment.VerifyPaymentRequest;
import com.ankit14.fooddeliverybackend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for payment endpoints (Razorpay integration).
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Payment processing APIs (Razorpay)")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create/{orderId}")
    @Operation(summary = "Create a Razorpay payment order")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPaymentOrder(@PathVariable Long orderId) {
        PaymentResponse response = paymentService.createPaymentOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", response));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment by order ID")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentResponse response = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook endpoint")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        log.info("Received Razorpay webhook");
        try {
            paymentService.handleWebhook(payload, signature);
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            log.error("Webhook processing failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Webhook processing failed");
        }
    }
}
