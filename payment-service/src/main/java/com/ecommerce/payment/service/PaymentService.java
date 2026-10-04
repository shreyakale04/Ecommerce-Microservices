package com.ecommerce.payment.service;

import com.ecommerce.payment.entity.Payment;

import java.util.List;

public interface PaymentService {

    Payment processPayment(Payment payment);

    List<Payment> getAllPayments();

    Payment getPaymentById(Long id);

    Payment getPaymentByOrderId(Long orderId);

    Payment refundPayment(Long id);
}
