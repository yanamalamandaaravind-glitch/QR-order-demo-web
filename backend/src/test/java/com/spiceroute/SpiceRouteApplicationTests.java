package com.spiceroute;

import com.spiceroute.dto.ApiResponse;
import com.spiceroute.dto.AuthDto;
import com.spiceroute.model.MenuItem;
import com.spiceroute.model.Role;
import com.spiceroute.service.AuthService;
import com.spiceroute.service.MenuService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class SpiceRouteApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private MenuService menuService;

    @Test
    void contextLoads() {
        Assertions.assertNotNull(authService);
        Assertions.assertNotNull(menuService);
    }

    @Test
    void testMenuSeeded() {
        List<MenuItem> items = menuService.getAllMenuItems(false);
        Assertions.assertTrue(items.size() >= 25, "At least 25 items should be seeded");
    }

    @Test
    void testCustomerOtpFlow() {
        String msg = authService.sendOtp("9876543210");
        Assertions.assertNotNull(msg);

        AuthDto.VerifyOtpRequest req = new AuthDto.VerifyOtpRequest("9876543210", "123456", "Test User");
        AuthDto.AuthResponse resp = authService.verifyOtp(req);
        Assertions.assertNotNull(resp.getToken());
        Assertions.assertEquals(Role.CUSTOMER, resp.getUser().getRole());
    }

    @Test
    void testStaffLoginFlow() {
        // Kitchen staff
        AuthDto.StaffLoginRequest kitchenReq = new AuthDto.StaffLoginRequest("kitchen", "Kitchen@123");
        AuthDto.AuthResponse kitchenResp = authService.staffLogin(kitchenReq);
        Assertions.assertNotNull(kitchenResp.getToken());
        Assertions.assertEquals(Role.KITCHEN, kitchenResp.getUser().getRole());

        // Admin staff
        AuthDto.StaffLoginRequest adminReq = new AuthDto.StaffLoginRequest("admin", "Admin@123");
        AuthDto.AuthResponse adminResp = authService.staffLogin(adminReq);
        Assertions.assertNotNull(adminResp.getToken());
        Assertions.assertEquals(Role.ADMIN, adminResp.getUser().getRole());
    }
}

