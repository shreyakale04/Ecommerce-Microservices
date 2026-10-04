package com.ecommerce.order.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentResponse {

    private Long id;

    private Long orderId;

    private Double amount;

    private String paymentMethod;

    private String status;
}
