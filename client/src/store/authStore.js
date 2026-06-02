import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('learnhub_user') || 'null'),
  token: localStorage.getItem('learnhub_token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
    localStorage.removeItem('token');
    const { data } = await authAPI.login({
      email: String(email).trim().toLowerCase(),
      password,
    });
    localStorage.setItem('learnhub_token', data.token);
    localStorage.setItem('learnhub_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, loading: false });
    return data;
  },

  register: async (form) => {
    set({ loading: true });
    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
    localStorage.removeItem('token');
    const { data } = await authAPI.register({
      ...form,
      email: String(form.email).trim().toLowerCase(),
    });
    if (data.token) {
      localStorage.setItem('learnhub_token', data.token);
      localStorage.setItem('learnhub_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
    } else {
      set({ loading: false });
    }
    return data;
  },

  verifyEmail: async (email, otp) => {
    set({ loading: true });
    const { data } = await authAPI.verifyEmail({
      email: String(email).trim().toLowerCase(),
      otp: String(otp).trim(),
    });
    localStorage.setItem('learnhub_token', data.token);
    localStorage.setItem('learnhub_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, loading: false });
    return data;
  },

  resendOtp: async (email) => {
    set({ loading: true });
    const { data } = await authAPI.resendOtp({ email: String(email).trim().toLowerCase() });
    set({ loading: false });
    return data;
  },

  logout: async ({ notify = true } = {}) => {
    const token = localStorage.getItem('learnhub_token');
    const logoutEmailPromise = notify && token
      ? authAPI.logout(token).catch((error) => {
          console.warn('Logout email could not be sent:', error.response?.data?.message || error.message);
        })
      : Promise.resolve();

    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
    localStorage.removeItem('token');
    window.__learnhubRedirecting = false;
    set({ user: null, token: null });

    await logoutEmailPromise;
  },

  updateUser: (user) => {
    localStorage.setItem('learnhub_user', JSON.stringify(user));
    set({ user });
  },

  isAuthenticated: () => !!localStorage.getItem('learnhub_token'),
}));
