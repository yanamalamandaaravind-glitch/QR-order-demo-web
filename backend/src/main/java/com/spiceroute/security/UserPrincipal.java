package com.spiceroute.security;

import com.spiceroute.model.Role;

public class UserPrincipal {
    private String userId;
    private String usernameOrMobile;
    private String name;
    private Role role;

    public UserPrincipal() {}

    public UserPrincipal(String userId, String usernameOrMobile, String name, Role role) {
        this.userId = userId;
        this.usernameOrMobile = usernameOrMobile;
        this.name = name;
        this.role = role;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsernameOrMobile() { return usernameOrMobile; }
    public void setUsernameOrMobile(String usernameOrMobile) { this.usernameOrMobile = usernameOrMobile; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
