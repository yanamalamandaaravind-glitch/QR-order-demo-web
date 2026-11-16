// Complete Seed Data for Cloud Demo & Standalone Showcase
export const MOCK_MENU_ITEMS = [
  // Biryani
  {
    id: "item-bir-01",
    name: "Hyderabadi Dum Biryani",
    description: "Fragrant long-grain basmati rice layered with spiced tender chicken and saffron milk, slow-cooked in traditional dum handi.",
    category: "Biryani",
    price: 349,
    costPrice: 135,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 20
  },
  {
    id: "item-bir-02",
    name: "Lucknowi Mutton Biryani",
    description: "Melt-in-mouth tender goat meat infused with delicate Awadhi spices, rose water, and golden fried onions.",
    category: "Biryani",
    price: 449,
    costPrice: 210,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 25
  },
  {
    id: "item-bir-03",
    name: "Paneer Tikka Dum Biryani",
    description: "Char-grilled paneer cubes simmered in tandoori marinade layered over fragrant spiced aromatic rice.",
    category: "Biryani",
    price: 299,
    costPrice: 105,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 18
  },
  {
    id: "item-bir-04",
    name: "Royal Egg Dum Biryani",
    description: "Golden shallow-fried eggs spiced with star anise, caramelized onions, and dum basmati rice.",
    category: "Biryani",
    price: 269,
    costPrice: 90,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 15
  },

  // Starters
  {
    id: "item-str-01",
    name: "Tandoori Paneer Tikka",
    description: "Fresh cottage cheese cubes marinated in Kashmiri chili, ajwain yogurt, and grilled in the clay oven.",
    category: "Starters",
    price: 259,
    costPrice: 90,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 15
  },
  {
    id: "item-str-02",
    name: "Tandoori Murgh (Half)",
    description: "Classic bone-in chicken marinated for 12 hours in spiced hung curd, charred to smoky perfection in tandoor.",
    category: "Starters",
    price: 319,
    costPrice: 125,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 20
  },
  {
    id: "item-str-03",
    name: "Hara Bhara Kabab",
    description: "Pan-seared spinach, green peas, and fresh mint patties stuffed with spiced cottage cheese.",
    category: "Starters",
    price: 229,
    costPrice: 75,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 12
  },
  {
    id: "item-str-04",
    name: "Crispy Corn Salt & Pepper",
    description: "Crunchy sweet corn kernels tossed with crushed black pepper, spring onions, and garlic herbs.",
    category: "Starters",
    price: 199,
    costPrice: 60,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 10
  },

  // Chicken
  {
    id: "item-chk-01",
    name: "Butter Chicken Delicacy",
    description: "Smoked tandoori chicken cooked in rich velvety satin tomato gravy, finished with butter and dried fenugreek.",
    category: "Chicken",
    price: 369,
    costPrice: 145,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 18
  },
  {
    id: "item-chk-02",
    name: "Kadai Chicken Masala",
    description: "Chicken chunks cooked in wok with bell peppers, crushed coriander seeds, and rustic roasted gravy.",
    category: "Chicken",
    price: 349,
    costPrice: 135,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 18
  },
  {
    id: "item-chk-03",
    name: "Spicy Chicken Chettinad",
    description: "Authentic South Indian specialty with roasted coconut, black pepper, poppy seeds, and curry leaves.",
    category: "Chicken",
    price: 359,
    costPrice: 140,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 20
  },

  // Puffs
  {
    id: "item-puf-01",
    name: "Chicken Tikka Puff",
    description: "Flaky golden multi-layered puff pastry loaded with smoky spiced chicken tikka morsels.",
    category: "Puffs",
    price: 89,
    costPrice: 28,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 8
  },
  {
    id: "item-puf-02",
    name: "Masala Egg Puff",
    description: "Crispy bakery crust filled with boiled egg halves and savory caramelised onion pepper masala.",
    category: "Puffs",
    price: 69,
    costPrice: 22,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 8
  },
  {
    id: "item-puf-03",
    name: "Crispy Veggie Puff",
    description: "Buttery pastry shell filled with seasoned potatoes, green peas, carrots, and cumin.",
    category: "Puffs",
    price: 59,
    costPrice: 18,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 8
  },

  // Lollipops
  {
    id: "item-lop-01",
    name: "Chicken Lollipop Masala",
    description: "6 pieces of succulent chicken winglets frenched, fried crisp, and tossed in spicy tangy Indo-Chinese gravy.",
    category: "Lollipops",
    price: 289,
    costPrice: 105,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 15
  },
  {
    id: "item-lop-02",
    name: "Schezwan Crispy Lollipop",
    description: "Crunchy fried chicken drummettes glazed with fiery homemade Schezwan sauce and scallions.",
    category: "Lollipops",
    price: 299,
    costPrice: 110,
    veg: false,
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 15
  },

  // Main Course
  {
    id: "item-mnc-01",
    name: "Dal Makhani Bukhara",
    description: "Whole black lentils slow-simmered overnight over charcoal embers, enriched with fresh butter and cream.",
    category: "Main Course",
    price: 279,
    costPrice: 85,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 15
  },
  {
    id: "item-mnc-02",
    name: "Paneer Butter Masala",
    description: "Soft cottage cheese simmered in buttery makhani gravy with rich cashew paste and kasuri methi.",
    category: "Main Course",
    price: 299,
    costPrice: 95,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 15
  },
  {
    id: "item-mnc-03",
    name: "Garlic Butter Naan Basket",
    description: "Fresh tandoor-baked leavened bread brushed generously with garlic butter and fresh coriander.",
    category: "Main Course",
    price: 69,
    costPrice: 18,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1626777553635-be319b221051?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 8
  },

  // Drinks
  {
    id: "item-drk-01",
    name: "Royal Mango Lassi",
    description: "Thick chilled churned yogurt blended with Alphonso mango pulp, cardamom, and roasted pistachio slivers.",
    category: "Drinks",
    price: 119,
    costPrice: 35,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 5
  },
  {
    id: "item-drk-02",
    name: "Fresh Mint Lime Soda",
    description: "Zesty freshly squeezed key limes, crushed mint leaves, rock salt, and sparkling club soda.",
    category: "Drinks",
    price: 89,
    costPrice: 20,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 5
  },
  {
    id: "item-drk-03",
    name: "Karak Masala Chai",
    description: "Brewed strong Assam tea leaves with crushed ginger, green cardamom, cinnamon, and whole milk.",
    category: "Drinks",
    price: 59,
    costPrice: 12,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 5
  },

  // Desserts
  {
    id: "item-des-01",
    name: "Gulab Jamun with Rabdi",
    description: "Warm deep-fried golden khoya dumplings served with chilled thickened saffron cardamom rabdi.",
    category: "Desserts",
    price: 149,
    costPrice: 45,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 5
  },
  {
    id: "item-des-02",
    name: "Royal Rasmalai (2 Pcs)",
    description: "Spongy cottage cheese discs soaked in clotted saffron milk, garnished with sliced almonds and pistachios.",
    category: "Desserts",
    price: 159,
    costPrice: 50,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1605197586566-a3206c9a7fc3?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 5
  },

  // Ice Creams
  {
    id: "item-ice-01",
    name: "Kesar Pista Shahi Kulfi",
    description: "Dense traditional pot kulfi made with reduced milk, Kashmiri saffron, and crushed green pistachios.",
    category: "Ice Creams",
    price: 129,
    costPrice: 38,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: true,
    preparationTimeMinutes: 4
  },
  {
    id: "item-ice-02",
    name: "Belgian Dark Chocolate Scoop",
    description: "Rich velvety double dark chocolate artisan ice cream with gourmet crunchy chocolate shavings.",
    category: "Ice Creams",
    price: 139,
    costPrice: 42,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 4
  },
  {
    id: "item-ice-03",
    name: "Alphonso Mango Swirl",
    description: "Creamy sunshine mango gelato churned with real Ratnagiri alphonso chunks and cream.",
    category: "Ice Creams",
    price: 139,
    costPrice: 40,
    veg: true,
    imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80",
    available: true,
    popular: false,
    preparationTimeMinutes: 4
  }
];

export const MOCK_CATEGORIES = [
  "Biryani",
  "Starters",
  "Chicken",
  "Puffs",
  "Lollipops",
  "Main Course",
  "Drinks",
  "Desserts",
  "Ice Creams"
];

export const MOCK_CUSTOMERS = [
  { id: "cust-1", name: "Rahul Sharma", mobile: "9876543210", totalOrders: 6, totalSpent: 4890, lastOrderDate: "2026-11-15T19:30:00" },
  { id: "cust-2", name: "Priya Patel", mobile: "9823456789", totalOrders: 5, totalSpent: 4120, lastOrderDate: "2026-11-14T20:15:00" },
  { id: "cust-3", name: "Amit Verma", mobile: "9712345678", totalOrders: 4, totalSpent: 3450, lastOrderDate: "2026-11-12T13:45:00" },
  { id: "cust-4", name: "Sneha Reddy", mobile: "9654321870", totalOrders: 5, totalSpent: 4320, lastOrderDate: "2026-11-13T21:00:00" },
  { id: "cust-5", name: "Vikram Singh", mobile: "9543216789", totalOrders: 4, totalSpent: 3890, lastOrderDate: "2026-11-11T19:50:00" },
  { id: "cust-6", name: "Ananya Iyer", mobile: "9432167890", totalOrders: 3, totalSpent: 2650, lastOrderDate: "2026-11-10T14:20:00" },
  { id: "cust-7", name: "Rohan Gupta", mobile: "9321654987", totalOrders: 4, totalSpent: 3100, lastOrderDate: "2026-11-09T20:40:00" },
  { id: "cust-8", name: "Pooja Mehta", mobile: "9216549873", totalOrders: 3, totalSpent: 2450, lastOrderDate: "2026-11-08T13:10:00" },
  { id: "cust-9", name: "Karthik Nair", mobile: "9123456780", totalOrders: 4, totalSpent: 3780, lastOrderDate: "2026-11-07T20:25:00" },
  { id: "cust-10", name: "Divya Joshi", mobile: "9012345678", totalOrders: 3, totalSpent: 2890, lastOrderDate: "2026-11-06T19:15:00" },
  { id: "cust-11", name: "Siddharth Rao", mobile: "9811223344", totalOrders: 4, totalSpent: 3560, lastOrderDate: "2026-11-05T21:30:00" },
  { id: "cust-12", name: "Neha Kapoor", mobile: "9877665544", totalOrders: 5, totalSpent: 4210, lastOrderDate: "2026-11-04T13:50:00" },
  { id: "cust-13", name: "Arjun Deshmukh", mobile: "9766554433", totalOrders: 3, totalSpent: 2790, lastOrderDate: "2026-11-03T20:10:00" },
  { id: "cust-14", name: "Meera Choudhary", mobile: "9655443322", totalOrders: 4, totalSpent: 3340, lastOrderDate: "2026-11-02T19:45:00" },
  { id: "cust-15", name: "Kunal Bansal", mobile: "9544332211", totalOrders: 3, totalSpent: 2950, lastOrderDate: "2026-11-01T14:15:00" }
];

export const MOCK_ORDERS = [
  {
    id: "ord-seed-01",
    orderNumber: "SR-1061",
    customerName: "Rahul Sharma",
    customerMobile: "9876543210",
    status: "PLACED",
    paymentStatus: "PAID",
    paymentMethod: "Cashfree UPI",
    items: [
      { menuItemId: "item-bir-01", name: "Hyderabadi Dum Biryani", price: 349, costPrice: 135, quantity: 2, veg: false },
      { menuItemId: "item-str-02", name: "Tandoori Murgh (Half)", price: 319, costPrice: 125, quantity: 1, veg: false },
      { menuItemId: "item-drk-01", name: "Royal Mango Lassi", price: 119, costPrice: 35, quantity: 2, veg: true }
    ],
    note: "Extra spicy salan please",
    subtotal: 1255,
    gstPercentage: 5.0,
    gstAmount: 62.75,
    grandTotal: 1317.75,
    profit: 760,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: "ord-seed-02",
    orderNumber: "SR-1060",
    customerName: "Priya Patel",
    customerMobile: "9823456789",
    status: "ACCEPTED",
    paymentStatus: "PAID",
    paymentMethod: "Cashfree Cards",
    items: [
      { menuItemId: "item-chk-01", name: "Butter Chicken Delicacy", price: 369, costPrice: 145, quantity: 1, veg: false },
      { menuItemId: "item-mnc-03", name: "Garlic Butter Naan Basket", price: 69, costPrice: 18, quantity: 3, veg: true },
      { menuItemId: "item-des-01", name: "Gulab Jamun with Rabdi", price: 149, costPrice: 45, quantity: 2, veg: true }
    ],
    note: "Less butter on naans",
    subtotal: 874,
    gstPercentage: 5.0,
    gstAmount: 43.70,
    grandTotal: 917.70,
    profit: 520,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: "ord-seed-03",
    orderNumber: "SR-1059",
    customerName: "Amit Verma",
    customerMobile: "9712345678",
    status: "PREPARING",
    paymentStatus: "PAID",
    paymentMethod: "Cashfree UPI",
    items: [
      { menuItemId: "item-bir-02", name: "Lucknowi Mutton Biryani", price: 449, costPrice: 210, quantity: 2, veg: false },
      { menuItemId: "item-lop-01", name: "Chicken Lollipop Masala", price: 289, costPrice: 105, quantity: 1, veg: false }
    ],
    note: "Piping hot",
    subtotal: 1187,
    gstPercentage: 5.0,
    gstAmount: 59.35,
    grandTotal: 1246.35,
    profit: 657,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString()
  },
  {
    id: "ord-seed-04",
    orderNumber: "SR-1058",
    customerName: "Sneha Reddy",
    customerMobile: "9654321870",
    status: "READY",
    paymentStatus: "PAID",
    paymentMethod: "Cashfree NetBanking",
    items: [
      { menuItemId: "item-bir-03", name: "Paneer Tikka Dum Biryani", price: 299, costPrice: 105, quantity: 1, veg: true },
      { menuItemId: "item-str-01", name: "Tandoori Paneer Tikka", price: 259, costPrice: 90, quantity: 1, veg: true },
      { menuItemId: "item-ice-01", name: "Kesar Pista Shahi Kulfi", price: 129, costPrice: 38, quantity: 2, veg: true }
    ],
    note: "",
    subtotal: 816,
    gstPercentage: 5.0,
    gstAmount: 40.80,
    grandTotal: 856.80,
    profit: 545,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: "ord-seed-05",
    orderNumber: "SR-1057",
    customerName: "Vikram Singh",
    customerMobile: "9543216789",
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "Cashfree UPI",
    items: [
      { menuItemId: "item-chk-02", name: "Kadai Chicken Masala", price: 349, costPrice: 135, quantity: 1, veg: false },
      { menuItemId: "item-mnc-03", name: "Garlic Butter Naan Basket", price: 69, costPrice: 18, quantity: 2, veg: true }
    ],
    note: "",
    subtotal: 487,
    gstPercentage: 5.0,
    gstAmount: 24.35,
    grandTotal: 511.35,
    profit: 316,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
  }
];

export const MOCK_ADMIN_STATS = {
  totalSales: 68450,
  totalOrders: 60,
  averageOrderValue: 1140.83,
  totalGst: 3422.50,
  netProfit: 38620,
  salesTrend: [
    { label: "1 Nov", sales: 2450, profit: 1350, orders: 3 },
    { label: "3 Nov", sales: 3120, profit: 1780, orders: 4 },
    { label: "5 Nov", sales: 2890, profit: 1620, orders: 3 },
    { label: "7 Nov", sales: 4120, profit: 2350, orders: 5 },
    { label: "9 Nov", sales: 3850, profit: 2190, orders: 4 },
    { label: "11 Nov", sales: 4650, profit: 2680, orders: 6 },
    { label: "13 Nov", sales: 5240, profit: 2980, orders: 6 },
    { label: "15 Nov", sales: 5890, profit: 3340, orders: 7 },
    { label: "Today", sales: 6420, profit: 3650, orders: 8 }
  ],
  topSellingItems: [
    { name: "Hyderabadi Dum Biryani", quantity: 54, revenue: 18846 },
    { name: "Butter Chicken Delicacy", quantity: 46, revenue: 16974 },
    { name: "Lucknowi Mutton Biryani", quantity: 38, revenue: 17062 },
    { name: "Tandoori Murgh (Half)", quantity: 35, revenue: 11165 },
    { name: "Royal Mango Lassi", quantity: 48, revenue: 5712 }
  ],
  peakHours: [
    { hour: "12:00 PM", orders: 6 },
    { hour: "1:00 PM", orders: 15 },
    { hour: "2:00 PM", orders: 12 },
    { hour: "7:00 PM", orders: 8 },
    { hour: "8:00 PM", orders: 22 },
    { hour: "9:00 PM", orders: 18 },
    { hour: "10:00 PM", orders: 7 }
  ]
};
