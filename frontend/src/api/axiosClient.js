import axios from 'axios';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from './mockData';

// Safely resolve the API Base URL without crashing
const getValidBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl !== 'undefined' && envUrl.trim() !== '') {
    const trimmed = envUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }

  // If in browser on localhost, default to local Spring Boot port 8080
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080/api';
  }

  return '';
};

const API_BASE_URL = getValidBaseUrl();
const isCloudStandalone = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Helper for standalone cloud demo responses
const getMockResponse = (url = '', method = 'get', requestData = null) => {
  const lowerUrl = url.toLowerCase();
  const lowerMethod = method.toLowerCase();

  // Menu categories
  if (lowerUrl.includes('/menu/categories')) {
    return { data: MOCK_CATEGORIES, success: true };
  }

  // Menu items
  if (lowerUrl.includes('/menu')) {
    return { data: MOCK_MENU_ITEMS, success: true };
  }

  // Settings
  if (lowerUrl.includes('/settings')) {
    return {
      data: {
        restaurantName: 'Spice Route',
        gstPercentage: 5.0,
        tableCount: 20,
      },
      success: true,
    };
  }

  // Customer OTP send
  if (lowerUrl.includes('/auth/customer/send-otp')) {
    return { data: { message: 'Demo OTP is 123456' }, success: true };
  }

  // Customer OTP verify
  if (lowerUrl.includes('/auth/customer/verify-otp')) {
    let payload = {};
    try { payload = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {}); } catch (e) {}
    const user = {
      id: 'cust-demo-1',
      name: payload.name || 'Demo Customer',
      usernameOrMobile: payload.mobile || '9876543210',
      role: 'CUSTOMER',
    };
    return { data: { token: 'demo-jwt-customer-token', user }, success: true };
  }

  // Staff Login
  if (lowerUrl.includes('/auth/staff/login')) {
    let payload = {};
    try { payload = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {}); } catch (e) {}
    const isKitchen = payload.username?.toLowerCase() === 'kitchen';
    const user = {
      id: isKitchen ? 'user-kitchen-01' : 'user-admin-01',
      name: isKitchen ? 'Head Chef' : 'Restaurant Admin',
      usernameOrMobile: payload.username,
      role: isKitchen ? 'KITCHEN' : 'ADMIN',
    };
    return { data: { token: 'demo-jwt-staff-token', user }, success: true };
  }

  // Payment Create
  if (lowerUrl.includes('/payments/create')) {
    return {
      data: {
        orderId: `CF-MOCK-${Date.now().toString().slice(-6)}`,
        paymentSessionId: `sess_mock_${Date.now()}`,
        mode: 'MOCK',
      },
      success: true,
    };
  }

  // Order Create
  if (lowerUrl.includes('/orders') && lowerMethod === 'post') {
    let payload = {};
    try { payload = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {}); } catch (e) {}
    const tokenNum = String(Math.floor(100 + Math.random() * 900));
    const order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SR-${tokenNum}`,
      customerName: payload.customerName || 'Guest',
      customerMobile: payload.customerMobile || '9876543210',
      items: payload.items || [MOCK_MENU_ITEMS[0]],
      status: 'PLACED',
      paymentStatus: 'PAID',
      paymentMethod: payload.paymentMethod || 'Cashfree Mock',
      subtotal: payload.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 349,
      gstPercentage: 5.0,
      gstAmount: 17.45,
      grandTotal: 366.45,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('sr_mock_orders', JSON.stringify(existing));
    return { data: order, success: true };
  }

  // Kitchen Orders List
  if (lowerUrl.includes('/kitchen/orders')) {
    const saved = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
    return { data: saved, success: true };
  }

  // Customer Order History
  if (lowerUrl.includes('/orders/my')) {
    const saved = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
    return { data: saved, success: true };
  }

  // Single Order Status Tracking
  if (lowerUrl.match(/\/orders\/[a-zA-Z0-9_-]+/)) {
    const id = url.split('/').pop();
    const saved = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
    const found = saved.find((o) => o.id === id);
    if (found) return { data: found, success: true };
    return {
      data: {
        id,
        orderNumber: 'SR-1061',
        customerName: 'Demo Patron',
        status: 'PREPARING',
        subtotal: 349,
        gstPercentage: 5.0,
        gstAmount: 17.45,
        grandTotal: 366.45,
        items: [MOCK_MENU_ITEMS[0]],
        createdAt: new Date().toISOString(),
      },
      success: true,
    };
  }

  // Admin Stats
  if (lowerUrl.includes('/admin/stats')) {
    return {
      data: {
        totalSales: 48250,
        totalOrders: 60,
        averageOrderValue: 804.16,
        totalGst: 2412.50,
        netProfit: 26500,
        salesTrend: [
          { label: 'Week 1', sales: 11200, profit: 6100, orders: 14 },
          { label: 'Week 2', sales: 12450, profit: 6800, orders: 15 },
          { label: 'Week 3', sales: 11800, profit: 6400, orders: 15 },
          { label: 'Week 4', sales: 12800, profit: 7200, orders: 16 },
        ],
        topSellingItems: [
          { name: 'Hyderabadi Dum Biryani', quantity: 42, revenue: 14658 },
          { name: 'Butter Chicken Delicacy', quantity: 38, revenue: 14022 },
          { name: 'Tandoori Murgh', quantity: 29, revenue: 9251 },
        ],
        peakHours: [
          { hour: '1:00 PM', orders: 18 },
          { hour: '8:00 PM', orders: 24 },
          { hour: '9:00 PM', orders: 20 },
        ],
      },
      success: true,
    };
  }

  return { data: [], success: true };
};

// Request interceptor: if standalone cloud, intercept and fulfill immediately
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sr_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // In standalone cloud mode without backend, resolve immediately via custom adapter
    if (isCloudStandalone) {
      config.adapter = async () => {
        const mockResult = getMockResponse(config.url, config.method, config.data);
        return {
          data: mockResult,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful error fallback
axiosClient.interceptors.response.use(
  (response) => {
    // If Netlify SPA rewrite returned HTML instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      return getMockResponse(response.config?.url, response.config?.method, response.config?.data);
    }
    return response.data;
  },
  async (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method || 'get';
    return getMockResponse(url, method, error.config?.data);
  }
);

export default axiosClient;
