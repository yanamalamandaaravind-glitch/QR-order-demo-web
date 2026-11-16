import axios from 'axios';
import {
  MOCK_MENU_ITEMS,
  MOCK_CATEGORIES,
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_ADMIN_STATS,
} from './mockData';

// Check if running on localhost with Spring Boot backend
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = isLocalhost ? 'http://localhost:8080/api' : '';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3500,
});

// Storage keys for persistent demo state across reloads
const STORAGE_MENU = 'sr_demo_menu';
const STORAGE_ORDERS = 'sr_demo_orders';
const STORAGE_SETTINGS = 'sr_demo_settings';

// Bump this when the shape of stored demo data changes so browsers holding
// data from an older deploy start fresh instead of crashing.
const STORAGE_VERSION_KEY = 'sr_demo_version';
const STORAGE_VERSION = '2';
try {
  if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_VERSION_KEY) !== STORAGE_VERSION) {
    [STORAGE_MENU, STORAGE_ORDERS, STORAGE_SETTINGS, 'sr_cart', 'sr_last_order_id'].forEach((k) =>
      localStorage.removeItem(k)
    );
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  }
} catch (e) {
  // Storage unavailable (e.g. blocked cookies) – ignore
}

const getStoredMenu = () => {
  const saved = localStorage.getItem(STORAGE_MENU);
  if (!saved) {
    localStorage.setItem(STORAGE_MENU, JSON.stringify(MOCK_MENU_ITEMS));
    return MOCK_MENU_ITEMS;
  }
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed.filter((m) => m && typeof m === 'object');
  } catch (e) {
    // fall through
  }
  localStorage.setItem(STORAGE_MENU, JSON.stringify(MOCK_MENU_ITEMS));
  return MOCK_MENU_ITEMS;
};

const getStoredOrders = () => {
  const saved = localStorage.getItem(STORAGE_ORDERS);
  if (!saved) {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(MOCK_ORDERS));
    return MOCK_ORDERS;
  }
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed.filter((o) => o && typeof o === 'object');
  } catch (e) {
    // fall through
  }
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(MOCK_ORDERS));
  return MOCK_ORDERS;
};

const getStoredSettings = () => {
  const saved = localStorage.getItem(STORAGE_SETTINGS);
  if (!saved) {
    const initial = { restaurantName: 'Spice Route', gstPercentage: 5.0, tableCount: 20 };
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    return { restaurantName: 'Spice Route', gstPercentage: 5.0, tableCount: 20 };
  } catch (e) {
    return { restaurantName: 'Spice Route', gstPercentage: 5.0, tableCount: 20 };
  }
};

// Comprehensive Client-Side Router for Cloud Demo (Netlify)
const routeMockRequest = (url = '', method = 'get', data = null) => {
  const cleanUrl = url
    .split('?')[0]
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/^\/api/, '');
  const lowerMethod = method.toLowerCase();

  let body = {};
  if (data) {
    try {
      body = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      body = {};
    }
  }

  // 1. MENU CATEGORIES
  if (cleanUrl === '/menu/categories') {
    return { success: true, message: 'Success', data: MOCK_CATEGORIES };
  }

  // 2. MENU LIST & CRUD
  if (cleanUrl === '/menu' && lowerMethod === 'get') {
    const items = getStoredMenu();
    return { success: true, message: 'Success', data: items };
  }

  if (cleanUrl === '/menu' && lowerMethod === 'post') {
    const currentMenu = getStoredMenu();
    const newItem = {
      id: `item-${Date.now()}`,
      name: body.name || 'New Royal Dish',
      description: body.description || '',
      category: body.category || 'Biryani',
      price: Number(body.price) || 299,
      costPrice: Number(body.costPrice) || 120,
      veg: !!body.veg,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
      available: true,
      popular: !!body.popular,
      preparationTimeMinutes: Number(body.preparationTimeMinutes) || 15,
    };
    currentMenu.unshift(newItem);
    localStorage.setItem(STORAGE_MENU, JSON.stringify(currentMenu));
    return { success: true, message: 'Created', data: newItem };
  }

  const menuIdMatch = cleanUrl.match(/^\/menu\/([a-zA-Z0-9_-]+)/);
  if (menuIdMatch) {
    const itemId = menuIdMatch[1];
    const currentMenu = getStoredMenu();

    if (cleanUrl.endsWith('/toggle') && lowerMethod === 'patch') {
      const updated = currentMenu.map((m) =>
        m.id === itemId ? { ...m, available: !m.available } : m
      );
      localStorage.setItem(STORAGE_MENU, JSON.stringify(updated));
      const target = updated.find((m) => m.id === itemId);
      return { success: true, message: 'Toggled', data: target };
    }

    if (lowerMethod === 'put') {
      const updated = currentMenu.map((m) =>
        m.id === itemId ? { ...m, ...body, id: itemId } : m
      );
      localStorage.setItem(STORAGE_MENU, JSON.stringify(updated));
      const target = updated.find((m) => m.id === itemId);
      return { success: true, message: 'Updated', data: target };
    }

    if (lowerMethod === 'delete') {
      const filtered = currentMenu.filter((m) => m.id !== itemId);
      localStorage.setItem(STORAGE_MENU, JSON.stringify(filtered));
      return { success: true, message: 'Deleted', data: null };
    }

    const item = currentMenu.find((m) => m.id === itemId);
    return { success: true, message: 'Success', data: item || currentMenu[0] };
  }

  // 3. AUTHENTICATION (ALL 3 ROLES)
  if (cleanUrl === '/auth/customer/send-otp') {
    return { success: true, message: 'Demo OTP is 123456', data: null };
  }

  if (cleanUrl === '/auth/customer/verify-otp') {
    if (body.otp && body.otp !== '123456') {
      throw new Error('Invalid OTP! Please enter demo OTP: 123456');
    }
    const mobile = body.mobile || '9876543210';
    const user = {
      id: `cust-${mobile.slice(-4)}`,
      name: body.name || 'Demo Customer',
      usernameOrMobile: mobile,
      role: 'CUSTOMER',
    };
    return {
      success: true,
      message: 'Verified',
      data: { token: 'demo-jwt-customer-token', user },
    };
  }

  if (cleanUrl === '/auth/staff/login') {
    const u = (body.username || '').trim().toLowerCase();
    const p = (body.password || '').trim();

    if (u === 'admin' && p === 'Admin@123') {
      const user = {
        id: 'user-admin-01',
        name: 'Restaurant Admin',
        usernameOrMobile: 'admin',
        role: 'ADMIN',
      };
      return {
        success: true,
        message: 'Admin authenticated',
        data: { token: 'demo-jwt-admin-token', user },
      };
    }

    if (u === 'kitchen' && p === 'Kitchen@123') {
      const user = {
        id: 'user-kitchen-01',
        name: 'Head Chef',
        usernameOrMobile: 'kitchen',
        role: 'KITCHEN',
      };
      return {
        success: true,
        message: 'Kitchen staff authenticated',
        data: { token: 'demo-jwt-kitchen-token', user },
      };
    }

    throw new Error('Invalid credentials! Use demo credentials (admin / Admin@123 or kitchen / Kitchen@123)');
  }

  // 4. SETTINGS
  if (cleanUrl === '/admin/settings' || cleanUrl === '/admin/settings/public') {
    if (lowerMethod === 'put') {
      const current = getStoredSettings();
      const updated = { ...current, ...body };
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(updated));
      return { success: true, message: 'Settings saved', data: updated };
    }
    return { success: true, message: 'Success', data: getStoredSettings() };
  }

  // 5. PAYMENT CREATION
  if (cleanUrl === '/payments/create') {
    return {
      success: true,
      message: 'Mock Payment Session Created',
      data: {
        orderId: `CF-MOCK-${Date.now().toString().slice(-6)}`,
        paymentSessionId: `sess_mock_${Date.now()}`,
        mode: 'MOCK',
      },
    };
  }

  // 6. ORDERS MANAGEMENT
  if (cleanUrl === '/orders' && lowerMethod === 'post') {
    const orders = getStoredOrders();
    const nextTokenNum = 1000 + orders.length + 1;
    const items = body.items || [MOCK_MENU_ITEMS[0]];
    const subtotal = items.reduce((s, i) => s + (Number(i.price) * (Number(i.quantity) || 1)), 0);
    const settings = getStoredSettings();
    const gstPct = settings.gstPercentage || 5.0;
    const gstAmt = (subtotal * gstPct) / 100;
    const grandTotal = subtotal + gstAmt;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `SR-${nextTokenNum}`,
      customerName: body.customerName || 'Guest Patron',
      customerMobile: body.customerMobile || '9876543210',
      items,
      note: body.note || '',
      status: 'PLACED',
      paymentStatus: 'PAID',
      paymentMethod: body.paymentMethod || 'Cashfree Sandbox Mock',
      subtotal,
      gstPercentage: gstPct,
      gstAmount: gstAmt,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    return { success: true, message: 'Order created', data: newOrder };
  }

  if (cleanUrl === '/kitchen/orders') {
    const orders = getStoredOrders();
    // Return active kitchen orders (exclude COMPLETED if any, or include all active)
    const active = orders.filter((o) => o.status !== 'COMPLETED');
    return { success: true, message: 'Success', data: active.length > 0 ? active : orders.slice(0, 5) };
  }

  if (cleanUrl === '/orders/my') {
    const orders = getStoredOrders();
    return { success: true, message: 'Success', data: orders };
  }

  const orderStatusMatch = cleanUrl.match(/^\/orders\/([a-zA-Z0-9_-]+)\/status/);
  if (orderStatusMatch && lowerMethod === 'patch') {
    const orderId = orderStatusMatch[1];
    const newStatus = body.status;
    const orders = getStoredOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
    const target = updated.find((o) => o.id === orderId);
    return { success: true, message: 'Status updated', data: target };
  }

  const singleOrderMatch = cleanUrl.match(/^\/orders\/([a-zA-Z0-9_-]+)$/);
  if (singleOrderMatch && lowerMethod === 'get') {
    const orderId = singleOrderMatch[1];
    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      return { success: true, message: 'Success', data: found };
    }
    return {
      success: true,
      message: 'Success',
      data: {
        id: orderId,
        orderNumber: 'SR-1061',
        customerName: 'Demo Customer',
        customerMobile: '9876543210',
        items: [MOCK_MENU_ITEMS[0], MOCK_MENU_ITEMS[4]],
        status: 'PREPARING',
        paymentStatus: 'PAID',
        subtotal: 608,
        gstPercentage: 5.0,
        gstAmount: 30.40,
        grandTotal: 638.40,
        createdAt: new Date().toISOString(),
      },
    };
  }

  // 7. ADMIN EXECUTIVE SUITE
  if (cleanUrl.startsWith('/admin/stats')) {
    return { success: true, message: 'Success', data: MOCK_ADMIN_STATS };
  }

  if (cleanUrl === '/admin/orders') {
    const orders = getStoredOrders();
    return { success: true, message: 'Success', data: orders };
  }

  if (cleanUrl === '/admin/customers') {
    return { success: true, message: 'Success', data: MOCK_CUSTOMERS };
  }

  // Fallback
  return { success: true, message: 'Success', data: [] };
};

// Request Interceptor: Attach token & intercept in Cloud Standalone mode
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sr_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If on Netlify (cloud), fulfill immediately using client-side mock engine
    if (!isLocalhost) {
      config.adapter = async () => {
        try {
          const result = routeMockRequest(config.url, config.method, config.data);
          return {
            data: result,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        } catch (err) {
          const error = new Error(err.message || 'Request failed');
          error.response = {
            data: { success: false, message: err.message },
            status: 400,
          };
          throw error;
        }
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap data or fallback if local backend fails
axiosClient.interceptors.response.use(
  (response) => {
    // If Netlify served HTML by mistake
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      return routeMockRequest(response.config?.url, response.config?.method, response.config?.data);
    }
    return response.data;
  },
  async (error) => {
    // Fallback if local Spring Boot is down
    if (isLocalhost) {
      try {
        return routeMockRequest(error.config?.url, error.config?.method, error.config?.data);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
