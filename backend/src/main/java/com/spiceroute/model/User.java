package com.spiceroute.model;

import java.time.LocalDateTime;

public class User {
    private String id;
    private String usernameOrMobile;
    private String password;
    private String name;
    private Role role;
    private LocalDateTime createdAt;

    public User() {}

    public User(String id, String usernameOrMobile, String password, String name, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.usernameOrMobile = usernameOrMobile;
        this.password = password;
        this.name = name;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String usernameOrMobile;
        private String password;
        private String name;
        private Role role;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder usernameOrMobile(String usernameOrMobile) { this.usernameOrMobile = usernameOrMobile; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, usernameOrMobile, password, name, role, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsernameOrMobile() { return usernameOrMobile; }
    public void setUsernameOrMobile(String usernameOrMobile) { this.usernameOrMobile = usernameOrMobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
