package com.ecommerce.order.service;

import com.ecommerce.order.entity.Order;

import java.util.List;

public interface OrderService {

    Order createOrder(Order order);

    List<Order> getAllOrders();

    Order getOrderById(Long id);

    List<Order> getOrdersByCustomer(String customerEmail);

    Order updateOrderStatus(Long id, String status);

    void cancelOrder(Long id);
}
