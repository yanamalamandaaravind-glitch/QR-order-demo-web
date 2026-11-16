package com.spiceroute.dto;

import com.spiceroute.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AuthDto {

    public static class SendOtpRequest {
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be exactly 10 digits")
        private String mobile;

        public SendOtpRequest() {}
        public SendOtpRequest(String mobile) { this.mobile = mobile; }
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
    }

    public static class VerifyOtpRequest {
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be exactly 10 digits")
        private String mobile;

        @NotBlank(message = "OTP is required")
        private String otp;

        private String name;

        public VerifyOtpRequest() {}
        public VerifyOtpRequest(String mobile, String otp, String name) {
            this.mobile = mobile;
            this.otp = otp;
            this.name = name;
        }
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class StaffLoginRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        public StaffLoginRequest() {}
        public StaffLoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String tokenType;
        private long expiresIn;
        private UserInfo user;

        public AuthResponse() {}
        public AuthResponse(String token, String tokenType, long expiresIn, UserInfo user) {
            this.token = token;
            this.tokenType = tokenType;
            this.expiresIn = expiresIn;
            this.user = user;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String token;
            private String tokenType;
            private long expiresIn;
            private UserInfo user;

            public Builder token(String token) { this.token = token; return this; }
            public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
            public Builder expiresIn(long expiresIn) { this.expiresIn = expiresIn; return this; }
            public Builder user(UserInfo user) { this.user = user; return this; }
            public AuthResponse build() {
                return new AuthResponse(token, tokenType, expiresIn, user);
            }
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }
        public long getExpiresIn() { return expiresIn; }
        public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }
        public UserInfo getUser() { return user; }
        public void setUser(UserInfo user) { this.user = user; }
    }

    public static class UserInfo {
        private String id;
        private String usernameOrMobile;
        private String name;
        private Role role;

        public UserInfo() {}
        public UserInfo(String id, String usernameOrMobile, String name, Role role) {
            this.id = id;
            this.usernameOrMobile = usernameOrMobile;
            this.name = name;
            this.role = role;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String id;
            private String usernameOrMobile;
            private String name;
            private Role role;

            public Builder id(String id) { this.id = id; return this; }
            public Builder usernameOrMobile(String usernameOrMobile) { this.usernameOrMobile = usernameOrMobile; return this; }
            public Builder name(String name) { this.name = name; return this; }
            public Builder role(Role role) { this.role = role; return this; }
            public UserInfo build() {
                return new UserInfo(id, usernameOrMobile, name, role);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getUsernameOrMobile() { return usernameOrMobile; }
        public void setUsernameOrMobile(String usernameOrMobile) { this.usernameOrMobile = usernameOrMobile; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }
}
