package com.ankit14.fooddeliverybackend.service;

import com.ankit14.fooddeliverybackend.config.RazorpayConfig;
import com.ankit14.fooddeliverybackend.dto.payment.PaymentResponse;
import com.ankit14.fooddeliverybackend.dto.payment.VerifyPaymentRequest;
import com.ankit14.fooddeliverybackend.exception.PaymentException;
import com.ankit14.fooddeliverybackend.exception.ResourceNotFoundException;
import com.ankit14.fooddeliverybackend.model.Order;
import com.ankit14.fooddeliverybackend.model.OrderStatus;
import com.ankit14.fooddeliverybackend.model.Payment;
import com.ankit14.fooddeliverybackend.model.PaymentStatus;
import com.ankit14.fooddeliverybackend.repository.OrderRepository;
import com.ankit14.fooddeliverybackend.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.Formatter;

/**
 * Service for Razorpay payment integration.
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    @Transactional
    public PaymentResponse createPaymentOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Check if payment already exists
        if (paymentRepository.existsByOrderIdAndStatus(orderId, PaymentStatus.SUCCESS)) {
            throw new PaymentException("Payment already completed for this order");
        }

        try {
            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue()); // Amount
                                                                                                             // in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderNumber());
            orderRequest.put("notes", new JSONObject().put("orderId", orderId.toString()));

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            // Save payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .amount(order.getTotalAmount())
                    .currency("INR")
                    .status(PaymentStatus.CREATED)
                    .build();

            payment = paymentRepository.save(payment);

            return PaymentResponse.builder()
                    .id(payment.getId())
                    .orderId(order.getId())
                    .orderNumber(order.getOrderNumber())
                    .razorpayOrderId(payment.getRazorpayOrderId())
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .status(payment.getStatus())
                    .razorpayKeyId(razorpayConfig.getKeyId())
                    .customerName(order.getCustomer().getName())
                    .customerEmail(order.getCustomer().getEmail())
                    .customerPhone(order.getCustomer().getPhone())
                    .build();

        } catch (RazorpayException e) {
            throw new PaymentException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public PaymentResponse verifyPayment(VerifyPaymentRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "razorpayOrderId",
                        request.getRazorpayOrderId()));

        // Verify signature
        String generatedSignature = generateSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId());

        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Signature verification failed");
            paymentRepository.save(payment);
            throw new PaymentException("Payment verification failed: Invalid signature");
        }

        // Update payment status
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment = paymentRepository.save(payment);

        // Update order status
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));

        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .orderNumber(payment.getOrder().getOrderNumber())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private String generateSignature(String razorpayOrderId, String razorpayPaymentId) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayConfig.getKeySecret().getBytes(),
                    "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(data.getBytes());
            return byteToHex(hash);
        } catch (Exception e) {
            throw new PaymentException("Failed to generate signature", e);
        }
    }

    private String byteToHex(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    @Transactional
    public void handleWebhook(String payload, String signature) {
        // Verify webhook signature
        if (!verifyWebhookSignature(payload, signature)) {
            throw new PaymentException("Invalid webhook signature");
        }

        JSONObject jsonPayload = new JSONObject(payload);
        String event = jsonPayload.getString("event");
        JSONObject paymentEntity = jsonPayload
                .getJSONObject("payload")
                .getJSONObject("payment")
                .getJSONObject("entity");

        String razorpayPaymentId = paymentEntity.getString("id");
        String razorpayOrderId = paymentEntity.getString("order_id");

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElse(null);

        if (payment == null) {
            return; // Payment not found, might be from a different system
        }

        switch (event) {
            case "payment.captured":
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setStatus(PaymentStatus.SUCCESS);
                paymentRepository.save(payment);

                // Update order status
                Order order = payment.getOrder();
                if (order.getStatus() == OrderStatus.PLACED) {
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order);
                }
                break;

            case "payment.failed":
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setStatus(PaymentStatus.FAILED);
                if (paymentEntity.has("error_description")) {
                    payment.setFailureReason(paymentEntity.getString("error_description"));
                }
                paymentRepository.save(payment);
                break;

            default:
                // Ignore other events
                break;
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayConfig.getWebhookSecret().getBytes(),
                    "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(payload.getBytes());
            String generatedSignature = byteToHex(hash);
            return generatedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
