package com.spiceroute.service;

import com.spiceroute.dto.PaymentDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Value("${cashfree.app-id:TEST_APP_ID_PLACEHOLDER}")
    private String appId;

    @Value("${cashfree.secret-key:TEST_SECRET_KEY_PLACEHOLDER}")
    private String secretKey;

    @Value("${cashfree.api-version:2023-08-01}")
    private String apiVersion;

    @Value("${cashfree.base-url:https://sandbox.cashfree.com/pg}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public PaymentDto.PaymentSessionResponse createOrderSession(PaymentDto.CreatePaymentSessionRequest request) {
        String generatedOrderId = "CF_ORD_" + System.currentTimeMillis();
        BigDecimal amount = request.getAmount() != null ? request.getAmount() : BigDecimal.valueOf(100.00);

        // Check if Cashfree keys are real or placeholders
        boolean isPlaceholder = appId == null || appId.isBlank() || appId.contains("PLACEHOLDER") ||
                secretKey == null || secretKey.isBlank() || secretKey.contains("PLACEHOLDER");

        if (isPlaceholder) {
            log.info("Cashfree keys are placeholder/missing. Falling back to Mock Payment Gateway mode.");
            String mockSessionId = "session_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            return new PaymentDto.PaymentSessionResponse(
                    mockSessionId,
                    generatedOrderId,
                    "MOCK",
                    amount,
                    "INR",
                    "Cashfree Sandbox placeholder mode: Using simulated payment gateway."
            );
        }

        // Real Cashfree Sandbox request
        try {
            String url = baseUrl + "/orders";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", appId);
            headers.set("x-client-secret", secretKey);
            headers.set("x-api-version", apiVersion);

            Map<String, Object> body = new HashMap<>();
            body.put("order_id", generatedOrderId);
            body.put("order_amount", amount.doubleValue());
            body.put("order_currency", "INR");

            Map<String, Object> customerDetails = new HashMap<>();
            String customerId = request.getCustomerMobile() != null ? "CUST_" + request.getCustomerMobile() : "CUST_" + UUID.randomUUID().toString().substring(0, 8);
            customerDetails.put("customer_id", customerId);
            customerDetails.put("customer_phone", request.getCustomerMobile() != null ? request.getCustomerMobile() : "9876543210");
            customerDetails.put("customer_name", request.getCustomerName() != null ? request.getCustomerName() : "Valued Customer");
            body.put("customer_details", customerDetails);

            Map<String, Object> orderMeta = new HashMap<>();
            orderMeta.put("return_url", "http://localhost:5173/order/" + generatedOrderId);
            body.put("order_meta", orderMeta);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String paymentSessionId = (String) response.getBody().get("payment_session_id");
                String orderId = (String) response.getBody().get("order_id");
                return new PaymentDto.PaymentSessionResponse(
                        paymentSessionId,
                        orderId,
                        "SANDBOX",
                        amount,
                        "INR",
                        "Cashfree Sandbox session created successfully"
                );
            }
        } catch (Exception e) {
            log.warn("Cashfree Sandbox API call failed: {}. Falling back to Mock Pay.", e.getMessage());
        }

        // Fallback if network or sandbox auth fails
        String mockSessionId = "session_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        return new PaymentDto.PaymentSessionResponse(
                mockSessionId,
                generatedOrderId,
                "MOCK",
                amount,
                "INR",
                "Cashfree Sandbox unreachable or invalid keys. Fallback to Mock Pay simulation."
        );
    }
}

