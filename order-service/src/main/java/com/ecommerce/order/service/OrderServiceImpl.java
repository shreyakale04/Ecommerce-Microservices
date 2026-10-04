package com.ecommerce.order.service;

import com.ecommerce.order.client.InventoryClient;
import com.ecommerce.order.client.InventoryResponse;
import com.ecommerce.order.client.PaymentClient;
import com.ecommerce.order.client.PaymentRequest;
import com.ecommerce.order.client.PaymentResponse;
import com.ecommerce.order.client.ProductClient;
import com.ecommerce.order.client.ProductResponse;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderStatus;
import com.ecommerce.order.exception.BadRequestException;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    private final ProductClient productClient;

    @Override
    public Order createOrder(Order order) {

        // 1. Get product details
        ProductResponse product =
                productClient.getProductById(
                        order.getProductId()
                );

        if (product == null) {
            throw new ResourceNotFoundException(
                    "Product not found with ID: "
                            + order.getProductId()
            );
        }

        // 2. Get product price
        Double productPrice = product.getPrice();
        order.setPrice(productPrice);

        // 3. Check inventory
        InventoryResponse inventory =
                inventoryClient.getInventoryByProductId(
                        order.getProductId()
                );

        if (inventory == null) {
            throw new ResourceNotFoundException(
                    "Inventory not found for product ID: "
                            + order.getProductId()
            );
        }

        // 4. Check stock
        if (inventory.getQuantity() < order.getQuantity()) {
            throw new BadRequestException(
                    "Insufficient stock for product ID: "
                            + order.getProductId()
            );
        }

        // 5. Reduce inventory
        inventoryClient.reduceStock(
                order.getProductId(),
                order.getQuantity()
        );

        // 6. Calculate total amount
        Double totalAmount =
                productPrice * order.getQuantity();

        // 7. Prepare payment request
        PaymentRequest paymentRequest =
                new PaymentRequest(
                        null,
                        totalAmount,
                        "CARD"
                );

        // 8. Save order with CREATED status
        order.setStatus(OrderStatus.CREATED);

        Order savedOrder =
                orderRepository.save(order);

        // 9. Set order ID for payment
        paymentRequest.setOrderId(
                savedOrder.getId()
        );

        // 10. Process payment
        PaymentResponse paymentResponse =
                paymentClient.processPayment(
                        paymentRequest
                );

        // 11. Check payment status
        if ("SUCCESS".equalsIgnoreCase(
                paymentResponse.getStatus())) {

            savedOrder.setStatus(
                    OrderStatus.CONFIRMED
            );

        } else {

            // Payment failed → restore inventory
            inventoryClient.restoreStock(
                    order.getProductId(),
                    order.getQuantity()
            );

            savedOrder.setStatus(
                    OrderStatus.CANCELLED
            );
        }

        // 12. Save final order
        return orderRepository.save(savedOrder);
    }

    @Override
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: " + id
                        )
                );
    }

    @Override
    public List<Order> getOrdersByCustomer(
            String customerEmail) {

        return orderRepository.findByCustomerEmail(
                customerEmail
        );
    }

    @Override
    public Order updateOrderStatus(
            Long id,
            String status) {

        Order order = getOrderById(id);

        try {

            OrderStatus orderStatus =
                    OrderStatus.valueOf(
                            status.toUpperCase()
                    );

            order.setStatus(orderStatus);

            return orderRepository.save(order);

        } catch (IllegalArgumentException e) {

            throw new BadRequestException(
                    "Invalid order status: " + status
            );
        }
    }

    @Override
    public void cancelOrder(Long id) {

        // 1. Get order
        Order order = getOrderById(id);

        // 2. Check whether order can be cancelled
        if (order.getStatus() == OrderStatus.CANCELLED) {

            throw new BadRequestException(
                    "Order is already cancelled"
            );
        }

        if (order.getStatus() == OrderStatus.REFUNDED) {

            throw new BadRequestException(
                    "Refunded order cannot be cancelled"
            );
        }

        // 3. Restore inventory
        inventoryClient.restoreStock(
                order.getProductId(),
                order.getQuantity()
        );

        // 4. Change order status
        order.setStatus(OrderStatus.CANCELLED);

        // 5. Save order
        orderRepository.save(order);
    }
}

