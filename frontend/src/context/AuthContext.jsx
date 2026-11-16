import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('sr_token'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_user');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      localStorage.removeItem('sr_user');
      return null;
    }
  });
  const [tableNumber, setTableNumber] = useState(() => {
    return localStorage.getItem('sr_table') || '1';
  });
  const [loading, setLoading] = useState(true);

  // Check 2-hour session expiration on mount
  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('sr_login_time');
      const savedUser = localStorage.getItem('sr_user');

      if (loginTime && savedUser) {
        let parsedUser = null;
        try {
          parsedUser = JSON.parse(savedUser);
        } catch (e) {
          parsedUser = null;
        }
        // Only customers expire after 2 hours
        if (parsedUser?.role === 'CUSTOMER') {
          const elapsed = Date.now() - parseInt(loginTime, 10);
          if (elapsed > TWO_HOURS_MS) {
            logout();
            setLoading(false);
            return;
          }
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const saveAuthSession = (authData) => {
    const { token, user } = authData;
    setToken(token);
    setUser(user);
    localStorage.setItem('sr_token', token);
    localStorage.setItem('sr_user', JSON.stringify(user));
    localStorage.setItem('sr_login_time', Date.now().toString());
  };

  const sendOtp = async (mobile) => {
    return await axiosClient.post('/auth/customer/send-otp', { mobile });
  };

  const verifyOtp = async (mobile, otp, name) => {
    const res = await axiosClient.post('/auth/customer/verify-otp', {
      mobile,
      otp,
      name,
    });
    if (res.data) {
      saveAuthSession(res.data);
    }
    return res;
  };

  const staffLogin = async (username, password) => {
    const res = await axiosClient.post('/auth/staff/login', {
      username,
      password,
    });
    if (res.data) {
      saveAuthSession(res.data);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    localStorage.removeItem('sr_login_time');
  };

  const updateTable = (num) => {
    if (num) {
      setTableNumber(num.toString());
      localStorage.setItem('sr_table', num.toString());
    }
  };

  const role = user?.role || null;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated,
        loading,
        tableNumber,
        updateTable,
        sendOtp,
        verifyOtp,
        staffLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

