package com.ankit14.fooddeliverybackend.service;

import com.ankit14.fooddeliverybackend.dto.common.PagedResponse;
import com.ankit14.fooddeliverybackend.dto.order.OrderItemRequest;
import com.ankit14.fooddeliverybackend.dto.order.OrderRequest;
import com.ankit14.fooddeliverybackend.dto.order.OrderResponse;
import com.ankit14.fooddeliverybackend.exception.BadRequestException;
import com.ankit14.fooddeliverybackend.exception.ResourceNotFoundException;
import com.ankit14.fooddeliverybackend.model.*;
import com.ankit14.fooddeliverybackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for order operations.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.05"); // 5% tax

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User customer = getCurrentUser();

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));

        if (!restaurant.getIsOpen()) {
            throw new BadRequestException("Restaurant is currently closed");
        }

        Address deliveryAddress = addressRepository.findById(request.getDeliveryAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getDeliveryAddressId()));

        // Create order
        Order order = Order.builder()
                .customer(customer)
                .restaurant(restaurant)
                .deliveryAddress(deliveryAddress)
                .deliveryInstructions(request.getDeliveryInstructions())
                .status(OrderStatus.PLACED)
                .deliveryFee(BigDecimal.valueOf(restaurant.getDeliveryFee()))
                .build();

        // Calculate subtotal and add items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemRequest.getMenuItemId()));

            if (!menuItem.getIsAvailable()) {
                throw new BadRequestException("Item is not available: " + menuItem.getName());
            }

            if (!menuItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new BadRequestException("Item does not belong to selected restaurant");
            }

            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .totalPrice(menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())))
                    .specialInstructions(itemRequest.getSpecialInstructions())
                    .build();

            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }

        // Check minimum order
        if (subtotal.compareTo(BigDecimal.valueOf(restaurant.getMinOrder())) < 0) {
            throw new BadRequestException("Minimum order amount is ₹" + restaurant.getMinOrder());
        }

        order.setSubtotal(subtotal);
        order.setTax(subtotal.multiply(TAX_RATE));
        order.setTotalAmount(subtotal.add(order.getTax()).add(order.getDeliveryFee()));
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(45));

        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getCustomerOrders(int page, int size) {
        User customer = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByCustomerId(customer.getId(), pageable);
        return buildPagedResponse(orders);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getRestaurantOrders(Long restaurantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByRestaurantId(restaurantId, pageable);
        return buildPagedResponse(orders);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }

        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (order.getStatus() != OrderStatus.PLACED && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled at this stage");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse assignDeliveryPartner(Long orderId, Long deliveryPartnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User deliveryPartner = userRepository.findById(deliveryPartnerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", deliveryPartnerId));

        if (deliveryPartner.getRole() != Role.DELIVERY_PARTNER) {
            throw new BadRequestException("User is not a delivery partner");
        }

        order.setDeliveryPartner(deliveryPartner);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        boolean valid = switch (current) {
            case PLACED -> next == OrderStatus.CONFIRMED || next == OrderStatus.CANCELLED;
            case CONFIRMED -> next == OrderStatus.PREPARING || next == OrderStatus.CANCELLED;
            case PREPARING -> next == OrderStatus.OUT_FOR_DELIVERY;
            case OUT_FOR_DELIVERY -> next == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };

        if (!valid) {
            throw new BadRequestException("Invalid status transition from " + current + " to " + next);
        }
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItem().getId())
                        .menuItemName(item.getMenuItem().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .specialInstructions(item.getSpecialInstructions())
                        .build())
                .collect(Collectors.toList());

        OrderResponse.PaymentInfo paymentInfo = null;
        if (order.getPayment() != null) {
            Payment payment = order.getPayment();
            paymentInfo = OrderResponse.PaymentInfo.builder()
                    .id(payment.getId())
                    .razorpayOrderId(payment.getRazorpayOrderId())
                    .razorpayPaymentId(payment.getRazorpayPaymentId())
                    .amount(payment.getAmount())
                    .status(payment.getStatus().name())
                    .build();
        }

        String deliveryAddressStr = order.getDeliveryAddress() != null
                ? String.format("%s, %s, %s - %s",
                        order.getDeliveryAddress().getStreet(),
                        order.getDeliveryAddress().getCity(),
                        order.getDeliveryAddress().getState(),
                        order.getDeliveryAddress().getPincode())
                : null;

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .items(items)
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .tax(order.getTax())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(deliveryAddressStr)
                .deliveryInstructions(order.getDeliveryInstructions())
                .deliveryPartnerId(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getId() : null)
                .deliveryPartnerName(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getName() : null)
                .payment(paymentInfo)
                .estimatedDeliveryTime(order.getEstimatedDeliveryTime())
                .actualDeliveryTime(order.getActualDeliveryTime())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private PagedResponse<OrderResponse> buildPagedResponse(Page<Order> page) {
        List<OrderResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<OrderResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
