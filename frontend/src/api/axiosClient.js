import axios from 'axios';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from './mockData';

// Safely resolve the API Base URL without crashing with "Failed to construct 'URL'"
const getValidBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl !== 'undefined' && envUrl.trim() !== '') {
    const trimmed = envUrl.trim();
    // Ensure protocol is present
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }

  // If in browser on localhost, default to local backend port 8080
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080/api';
  }

  // On production (e.g. Netlify) with no backend configured, use relative /api or dummy
  return '/api';
};

const API_BASE_URL = getValidBaseUrl();

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5s timeout before falling back to demo mock
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sr_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful mock fallback for standalone cloud demos (Netlify)
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const url = error.config?.url || '';
    const method = (error.config?.method || 'get').toLowerCase();

    // Check if running on cloud without backend or if network failed
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('Failed to construct') ||
      error.message?.includes('Mixed Content');

    if (isNetworkError) {
      console.warn(`[SpiceRoute Demo] Backend offline at ${API_BASE_URL}. Providing interactive demo fallback for ${method.toUpperCase()} ${url}`);

      // GET /menu
      if (url.includes('/menu/categories')) {
        return { data: MOCK_CATEGORIES, success: true };
      }
      if (url.includes('/menu')) {
        return { data: MOCK_MENU_ITEMS, success: true };
      }

      // Settings
      if (url.includes('/settings') || url.includes('/admin/settings/public')) {
        return {
          data: {
            restaurantName: 'Spice Route',
            gstPercentage: 5.0,
            tableCount: 20,
          },
          success: true,
        };
      }

      // Customer Auth
      if (url.includes('/auth/customer/send-otp')) {
        return { data: { message: 'Demo OTP is 123456' }, success: true };
      }
      if (url.includes('/auth/customer/verify-otp')) {
        const payload = JSON.parse(error.config?.data || '{}');
        const user = {
          id: 'cust-demo-1',
          name: payload.name || 'Demo Customer',
          usernameOrMobile: payload.mobile || '9876543210',
          role: 'CUSTOMER',
        };
        const token = 'demo-jwt-customer-token';
        return { data: { token, user }, success: true };
      }

      // Staff Auth
      if (url.includes('/auth/staff/login')) {
        const payload = JSON.parse(error.config?.data || '{}');
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
      if (url.includes('/payments/create')) {
        return {
          data: {
            orderId: `CF-MOCK-${Date.now().toString().slice(-6)}`,
            paymentSessionId: `sess_mock_${Date.now()}`,
            mode: 'MOCK',
          },
          success: true,
        };
      }

      // Order Create & Management
      if (url.includes('/orders') && method === 'post') {
        const payload = JSON.parse(error.config?.data || '{}');
        const tokenNum = String(Math.floor(100 + Math.random() * 900));
        const order = {
          id: `ord-${Date.now()}`,
          orderNumber: `SR-${tokenNum}`,
          customerName: payload.customerName || 'Guest',
          customerMobile: payload.customerMobile || '9876543210',
          items: payload.items || [],
          status: 'PLACED',
          paymentStatus: 'PAID',
          paymentMethod: payload.paymentMethod || 'Cashfree Mock',
          subtotal: payload.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 349,
          gstPercentage: 5.0,
          gstAmount: 17.45,
          grandTotal: 366.45,
          createdAt: new Date().toISOString(),
        };

        // Persist order in localStorage for tracking & kitchen screens
        const existing = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
        existing.unshift(order);
        localStorage.setItem('sr_mock_orders', JSON.stringify(existing));
        return { data: order, success: true };
      }

      if (url.includes('/kitchen/orders')) {
        const saved = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
        return { data: saved, success: true };
      }

      if (url.includes('/orders/my')) {
        const saved = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
        return { data: saved, success: true };
      }

      if (url.match(/\/orders\/[a-zA-Z0-9_-]+/)) {
        const id = url.split('/').pop();
        const saved = JSON.parse(localStorage.getItem('sr_mock_orders') || '[]');
        const found = saved.find((o) => o.id === id);
        if (found) return { data: found, success: true };
        // Fallback active order
        return {
          data: {
            id,
            orderNumber: `SR-1061`,
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

      if (url.includes('/admin/stats')) {
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
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
