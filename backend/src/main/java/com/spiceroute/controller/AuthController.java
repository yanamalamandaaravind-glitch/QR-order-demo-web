package com.spiceroute.controller;

import com.spiceroute.dto.ApiResponse;
import com.spiceroute.dto.AuthDto;
import com.spiceroute.security.UserPrincipal;
import com.spiceroute.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/customer/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody AuthDto.SendOtpRequest request) {
        String message = authService.sendOtp(request.getMobile());
        return ResponseEntity.ok(ApiResponse.ok(message, message));
    }

    @PostMapping("/customer/verify-otp")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> verifyOtp(@Valid @RequestBody AuthDto.VerifyOtpRequest request) {
        try {
            AuthDto.AuthResponse response = authService.verifyOtp(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/staff/login")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> staffLogin(@Valid @RequestBody AuthDto.StaffLoginRequest request) {
        try {
            AuthDto.AuthResponse response = authService.staffLogin(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserPrincipal>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof UserPrincipal principal) {
            return ResponseEntity.ok(ApiResponse.ok(principal));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
    }
}
