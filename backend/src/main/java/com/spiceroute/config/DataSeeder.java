package com.spiceroute.config;

import com.spiceroute.model.*;
import com.spiceroute.repository.MenuItemRepository;
import com.spiceroute.repository.OrderRepository;
import com.spiceroute.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      MenuItemRepository menuItemRepository,
                      OrderRepository orderRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        List<MenuItem> menuItems = seedMenuItems();
        seedOrders(menuItems);
        log.info("DataSeeder completed successfully. Seeded {} menu items and {} orders.",
                menuItemRepository.count(), orderRepository.count());
    }

    private void seedUsers() {
        if (!userRepository.existsByUsernameOrMobile("admin")) {
            userRepository.save(User.builder()
                    .id("user-admin-01")
                    .usernameOrMobile("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .name("Restaurant Admin")
                    .role(Role.ADMIN)
                    .createdAt(LocalDateTime.now().minusDays(60))
                    .build());
            log.info("Seeded Admin user: username=admin");
        }

        if (!userRepository.existsByUsernameOrMobile("kitchen")) {
            userRepository.save(User.builder()
                    .id("user-kitchen-01")
                    .usernameOrMobile("kitchen")
                    .password(passwordEncoder.encode("Kitchen@123"))
                    .name("Head Chef")
                    .role(Role.KITCHEN)
                    .createdAt(LocalDateTime.now().minusDays(60))
                    .build());
            log.info("Seeded Kitchen user: username=kitchen");
        }
    }

    private List<MenuItem> seedMenuItems() {
        if (menuItemRepository.count() > 0) {
            return menuItemRepository.findAll();
        }

        List<MenuItem> items = Arrays.asList(
                // Biryani
                item("item-bir-01", "Hyderabadi Dum Biryani", "Fragrant long-grain basmati rice layered with spiced tender chicken and saffron milk, slow-cooked in traditional dum handi.", "Biryani", 349, 135, false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", true, 20),
                item("item-bir-02", "Lucknowi Mutton Biryani", "Melt-in-mouth tender goat meat infused with delicate Awadhi spices, rose water, and golden fried onions.", "Biryani", 449, 210, false, "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", true, 25),
                item("item-bir-03", "Paneer Tikka Dum Biryani", "Char-grilled paneer cubes simmered in tandoori marinade layered over fragrant spiced aromatic rice.", "Biryani", 299, 105, true, "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop&q=80", false, 18),
                item("item-bir-04", "Royal Egg Dum Biryani", "Golden shallow-fried eggs spiced with star anise, caramelized onions, and dum basmati rice.", "Biryani", 269, 90, false, "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80", false, 15),

                // Starters
                item("item-str-01", "Tandoori Paneer Tikka", "Fresh cottage cheese cubes marinated in Kashmiri chili, ajwain yogurt, and grilled in the clay oven.", "Starters", 259, 90, true, "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", true, 15),
                item("item-str-02", "Tandoori Murgh (Half)", "Classic bone-in chicken marinated for 12 hours in spiced hung curd, charred to smoky perfection in tandoor.", "Starters", 319, 125, false, "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80", true, 20),
                item("item-str-03", "Hara Bhara Kabab", "Pan-seared spinach, green peas, and fresh mint patties stuffed with spiced cottage cheese.", "Starters", 229, 75, true, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", false, 12),
                item("item-str-04", "Crispy Corn Salt & Pepper", "Crunchy sweet corn kernels tossed with crushed black pepper, spring onions, and garlic herbs.", "Starters", 199, 60, true, "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format&fit=crop&q=80", false, 10),

                // Chicken
                item("item-chk-01", "Butter Chicken Delicacy", "Smoked tandoori chicken cooked in rich velvety satin tomato gravy, finished with butter and dried fenugreek.", "Chicken", 369, 145, false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80", true, 18),
                item("item-chk-02", "Kadai Chicken Masala", "Chicken chunks cooked in wok with bell peppers, crushed coriander seeds, and rustic roasted gravy.", "Chicken", 349, 135, false, "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", false, 18),
                item("item-chk-03", "Spicy Chicken Chettinad", "Authentic South Indian specialty with roasted coconut, black pepper, poppy seeds, and curry leaves.", "Chicken", 359, 140, false, "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop&q=80", false, 20),

                // Puffs
                item("item-puf-01", "Chicken Tikka Puff", "Flaky golden golden-baked multi-layered puff pastry loaded with smoky spiced chicken tikka morsels.", "Puffs", 89, 28, false, "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop&q=80", true, 8),
                item("item-puf-02", "Masala Egg Puff", "Crispy bakery crust filled with boiled egg halves and savory caramelised onion pepper masala.", "Puffs", 69, 22, false, "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80", false, 8),
                item("item-puf-03", "Crispy Veggie Puff", "Buttery pastry shell filled with seasoned potatoes, green peas, carrots, and cumin.", "Puffs", 59, 18, true, "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80", false, 8),

                // Lollipops
                item("item-lop-01", "Chicken Lollipop Masala", "6 pieces of succulent chicken winglets frenched, fried crisp, and tossed in spicy tangy Indo-Chinese gravy.", "Lollipops", 289, 105, false, "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80", true, 15),
                item("item-lop-02", "Schezwan Crispy Lollipop", "Crunchy fried chicken drummettes glazed with fiery homemade Schezwan sauce and scallions.", "Lollipops", 299, 110, false, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80", false, 15),

                // Main Course
                item("item-mnc-01", "Dal Makhani Bukhara", "Whole black lentils slow-simmered overnight over charcoal embers, enriched with fresh butter and cream.", "Main Course", 279, 85, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", true, 15),
                item("item-mnc-02", "Paneer Butter Masala", "Soft cottage cheese simmered in buttery makhani gravy with rich cashew paste and kasuri methi.", "Main Course", 299, 95, true, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", true, 15),
                item("item-mnc-03", "Garlic Butter Naan Basket", "Fresh tandoor-baked leavened bread brushed generously with garlic butter and fresh coriander.", "Main Course", 69, 18, true, "https://images.unsplash.com/photo-1626777553635-be319b221051?w=600&auto=format&fit=crop&q=80", false, 8),

                // Drinks
                item("item-drk-01", "Royal Mango Lassi", "Thick chilled churned yogurt blended with Alphonso mango pulp, cardamom, and roasted pistachio slivers.", "Drinks", 119, 35, true, "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80", true, 5),
                item("item-drk-02", "Fresh Mint Lime Soda", "Zesty freshly squeezed key limes, crushed mint leaves, rock salt, and sparkling club soda.", "Drinks", 89, 20, true, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80", false, 5),
                item("item-drk-03", "Karak Masala Chai", "Brewed strong Assam tea leaves with crushed ginger, green cardamom, cinnamon, and whole milk.", "Drinks", 59, 12, true, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80", false, 5),

                // Desserts
                item("item-des-01", "Gulab Jamun with Rabdi", "Warm deep-fried golden khoya dumplings served with chilled thickened saffron cardamom rabdi.", "Desserts", 149, 45, true, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", true, 5),
                item("item-des-02", "Royal Rasmalai (2 Pcs)", "Spongy cottage cheese discs soaked in clotted saffron milk, garnished with sliced almonds and pistachios.", "Desserts", 159, 50, true, "https://images.unsplash.com/photo-1605197586566-a3206c9a7fc3?w=600&auto=format&fit=crop&q=80", true, 5),

                // Ice Creams
                item("item-ice-01", "Kesar Pista Shahi Kulfi", "Dense traditional pot kulfi made with reduced milk, Kashmiri saffron, crushed green pistachios.", "Ice Creams", 129, 38, true, "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80", true, 4),
                item("item-ice-02", "Belgian Dark Chocolate Scoop", "Rich velvety double dark chocolate artisan ice cream with gourmet crunchy chocolate shavings.", "Ice Creams", 139, 42, true, "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80", false, 4),
                item("item-ice-03", "Alphonso Mango Swirl", "Creamy sunshine mango gelato churned with real Ratnagiri alphonso chunks and cream.", "Ice Creams", 139, 40, true, "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80", false, 4)
        );

        for (MenuItem item : items) {
            menuItemRepository.save(item);
        }
        return items;
    }

    private MenuItem item(String id, String name, String desc, String cat, double price, double cost, boolean veg, String img, boolean popular, int prepTime) {
        return MenuItem.builder()
                .id(id)
                .name(name)
                .description(desc)
                .category(cat)
                .price(BigDecimal.valueOf(price))
                .costPrice(BigDecimal.valueOf(cost))
                .veg(veg)
                .imageUrl(img)
                .available(true)
                .popular(popular)
                .preparationTimeMinutes(prepTime)
                .build();
    }

    private void seedOrders(List<MenuItem> menuItems) {
        if (orderRepository.count() > 0 || menuItems.isEmpty()) {
            return;
        }

        String[][] customers = {
                {"Rahul Sharma", "9876543210"},
                {"Priya Patel", "9823456789"},
                {"Amit Verma", "9712345678"},
                {"Sneha Reddy", "9654321870"},
                {"Vikram Singh", "9543216789"},
                {"Ananya Iyer", "9432167890"},
                {"Rohan Gupta", "9321654987"},
                {"Pooja Mehta", "9216549873"},
                {"Karthik Nair", "9123456780"},
                {"Divya Joshi", "9012345678"},
                {"Siddharth Rao", "9811223344"},
                {"Neha Kapoor", "9877665544"},
                {"Arjun Deshmukh", "9766554433"},
                {"Meera Choudhary", "9655443322"},
                {"Kunal Bansal", "9544332211"}
        };

        for (String[] cust : customers) {
            if (!userRepository.existsByUsernameOrMobile(cust[1])) {
                userRepository.save(User.builder()
                        .usernameOrMobile(cust[1])
                        .name(cust[0])
                        .role(Role.CUSTOMER)
                        .createdAt(LocalDateTime.now().minusDays(50))
                        .build());
            }
        }

        Random rand = new Random(42);
        int totalOrdersToSeed = 60;
        BigDecimal gstRate = new BigDecimal("0.05");

        for (int i = 1; i <= totalOrdersToSeed; i++) {
            String[] cust = customers[rand.nextInt(customers.length)];
            int daysAgo = rand.nextInt(45);
            int hour;
            if (rand.nextBoolean()) {
                hour = 12 + rand.nextInt(4);
            } else {
                hour = 19 + rand.nextInt(4);
            }
            int minute = rand.nextInt(60);
            LocalDateTime orderTime = LocalDateTime.now()
                    .minusDays(daysAgo)
                    .withHour(hour)
                    .withMinute(minute);

            int tableNum = 1 + rand.nextInt(20);

            int itemCount = 2 + rand.nextInt(3);
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal subtotal = BigDecimal.ZERO;
            BigDecimal totalCost = BigDecimal.ZERO;

            Set<Integer> chosenIdxs = new HashSet<>();
            while (chosenIdxs.size() < itemCount) {
                chosenIdxs.add(rand.nextInt(menuItems.size()));
            }

            for (int idx : chosenIdxs) {
                MenuItem mi = menuItems.get(idx);
                int qty = 1 + rand.nextInt(2);
                BigDecimal linePrice = mi.getPrice().multiply(BigDecimal.valueOf(qty));
                BigDecimal lineCost = mi.getCostPrice().multiply(BigDecimal.valueOf(qty));

                subtotal = subtotal.add(linePrice);
                totalCost = totalCost.add(lineCost);

                orderItems.add(OrderItem.builder()
                        .menuItemId(mi.getId())
                        .name(mi.getName())
                        .price(mi.getPrice())
                        .costPrice(mi.getCostPrice())
                        .quantity(qty)
                        .veg(mi.isVeg())
                        .build());
            }

            BigDecimal gstAmount = subtotal.multiply(gstRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal grandTotal = subtotal.add(gstAmount).setScale(2, RoundingMode.HALF_UP);
            BigDecimal profit = subtotal.subtract(totalCost).setScale(2, RoundingMode.HALF_UP);

            OrderStatus status = OrderStatus.COMPLETED;
            if (daysAgo == 0) {
                int r = rand.nextInt(4);
                if (r == 0) status = OrderStatus.PLACED;
                else if (r == 1) status = OrderStatus.ACCEPTED;
                else if (r == 2) status = OrderStatus.PREPARING;
                else status = OrderStatus.READY;
            }

            String orderNum = String.format("SR-%05d", 1000 + i);

            Order order = Order.builder()
                    .id("order-seed-" + i)
                    .orderNumber(orderNum)
                    .tableNumber(tableNum)
                    .customerMobile(cust[1])
                    .customerName(cust[0])
                    .items(orderItems)
                    .note(rand.nextBoolean() ? "Please make it medium spicy" : "")
                    .subtotal(subtotal)
                    .gstPercentage(new BigDecimal("5.00"))
                    .gstAmount(gstAmount)
                    .grandTotal(grandTotal)
                    .totalCostPrice(totalCost)
                    .profit(profit)
                    .status(status)
                    .paymentStatus(PaymentStatus.PAID)
                    .paymentMethod("Cashfree Sandbox")
                    .cashfreeOrderId("CF_" + orderNum)
                    .paymentSessionId("session_" + orderNum)
                    .createdAt(orderTime)
                    .updatedAt(orderTime.plusMinutes(25))
                    .build();

            orderRepository.save(order);
        }
    }
}
