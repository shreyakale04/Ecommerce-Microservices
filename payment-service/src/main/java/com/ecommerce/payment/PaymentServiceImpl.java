package com.ecommerce.payment;

import com.ecommerce.payment.client.OrderClient;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.entity.PaymentStatus;
import com.ecommerce.payment.exception.ResourceNotFoundException;
import com.ecommerce.payment.repository.PaymentRepository;
import com.ecommerce.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    @Override
    public Payment processPayment(Payment payment) {

        payment.setStatus(PaymentStatus.SUCCESS);

        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with ID: " + id
                        ));
    }
    @Override
    public Payment getPaymentByOrderId(Long orderId) {

        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found for order ID: "
                                        + orderId
                        ));
    }

    @Override
    public Payment refundPayment(Long id) {

        Payment payment = getPaymentById(id);

        payment.setStatus(PaymentStatus.REFUNDED);

        Payment savedPayment =
                paymentRepository.save(payment);

        // Update corresponding order
        orderClient.updateOrderStatus(
                payment.getOrderId(),
                "REFUNDED"
        );

        return savedPayment;
    }

}
