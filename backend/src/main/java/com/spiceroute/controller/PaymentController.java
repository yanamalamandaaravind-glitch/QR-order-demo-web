package com.spiceroute.controller;

import com.spiceroute.dto.ApiResponse;
import com.spiceroute.dto.PaymentDto;
import com.spiceroute.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentDto.PaymentSessionResponse>> createPaymentSession(
            @RequestBody PaymentDto.CreatePaymentSessionRequest request) {
        PaymentDto.PaymentSessionResponse response = paymentService.createOrderSession(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment session initiated", response));
    }
}
