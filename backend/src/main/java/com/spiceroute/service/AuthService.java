package com.spiceroute.service;

import com.spiceroute.dto.AuthDto;
import com.spiceroute.model.Role;
import com.spiceroute.model.User;
import com.spiceroute.repository.UserRepository;
import com.spiceroute.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public static final String DEMO_OTP = "123456";

    public AuthService(UserRepository userRepository, JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public String sendOtp(String mobile) {
        log.info("Sending OTP for customer mobile: {}. Demo OTP is: {}", mobile, DEMO_OTP);
        return "OTP sent successfully. Demo OTP is " + DEMO_OTP;
    }

    public AuthDto.AuthResponse verifyOtp(AuthDto.VerifyOtpRequest request) {
        if (!DEMO_OTP.equals(request.getOtp().trim())) {
            throw new IllegalArgumentException("Invalid OTP. Please use demo OTP: " + DEMO_OTP);
        }

        String mobile = request.getMobile().trim();
        User user = userRepository.findByUsernameOrMobile(mobile)
                .orElseGet(() -> {
                    String defaultName = request.getName() != null && !request.getName().isBlank()
                            ? request.getName().trim()
                            : "Guest (" + mobile.substring(Math.max(0, mobile.length() - 4)) + ")";
                    User newUser = User.builder()
                            .usernameOrMobile(mobile)
                            .name(defaultName)
                            .role(Role.CUSTOMER)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return userRepository.save(newUser);
                });

        if (request.getName() != null && !request.getName().isBlank() && !request.getName().equals(user.getName())) {
            user.setName(request.getName().trim());
            userRepository.save(user);
        }

        String token = tokenProvider.generateToken(user.getId(), user.getUsernameOrMobile(), user.getName(), user.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(AuthDto.UserInfo.builder()
                        .id(user.getId())
                        .usernameOrMobile(user.getUsernameOrMobile())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public AuthDto.AuthResponse staffLogin(AuthDto.StaffLoginRequest request) {
        String username = request.getUsername().trim();
        User user = userRepository.findByUsernameOrMobile(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (user.getRole() != Role.ADMIN && user.getRole() != Role.KITCHEN) {
            throw new IllegalArgumentException("Access denied for this role");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) &&
                !request.getPassword().equals(user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getUsernameOrMobile(), user.getName(), user.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(AuthDto.UserInfo.builder()
                        .id(user.getId())
                        .usernameOrMobile(user.getUsernameOrMobile())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
}
