import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  const url = config.url || '';
  const isAuthRequest =
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password') ||
    url.includes('/auth/verify-email') ||
    url.includes('/auth/resend-otp');
  if (isAuthRequest) {
    delete config.headers.Authorization;
    return config;
  }
  const token = localStorage.getItem('learnhub_token');
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (
      status === 401 &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/register')
    ) {
      const { useAuthStore } = await import('../store/authStore.js');
      useAuthStore.getState().logout({ notify: false });
      const onLogin = window.location.pathname === '/login';
      if (!onLogin && !window.__learnhubRedirecting) {
        window.__learnhubRedirecting = true;
        const from = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?session=expired&from=${from}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: (token) =>
    api.post(
      '/auth/logout',
      {},
      token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : undefined
    ),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getFeedbacks: (id) => api.get(`/courses/${id}/feedback`),
  submitFeedback: (id, data) => api.post(`/courses/${id}/feedback`, data),
  updateFeedbackSettings: (id, data) => api.patch(`/courses/${id}/feedback/settings`, data),
  updateFeedbackVisibility: (courseId, feedbackId, data) =>
    api.patch(`/courses/${courseId}/feedback/${feedbackId}`, data),
  deleteFeedback: (courseId, feedbackId) => api.delete(`/courses/${courseId}/feedback/${feedbackId}`),
  create: (data) => api.post('/courses', data),
  createWithUpload: (formData, onProgress) =>
    api.post('/courses', formData, {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    }),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  instructorCourses: () => api.get('/courses/instructor/mine'),
};

export const aiAPI = {
  search: (query) => api.post('/ai/search', { query }),
  chat: (messages) => api.post('/ai/chat', { messages }),
  bot: (messages) => api.post('/ai/bot', { messages }),
  mockTest: (data) => api.post('/ai/mock-test', data),
  recommendations: (data) => api.post('/ai/recommendations', data),
  suggestedCourses: (data) => api.post('/ai/suggested-courses', data),
  sentiment: (text) => api.post('/ai/sentiment', { text }),
  extractText: (formData) => api.post('/ai/extract-text', formData),
  convertTextPdf: (formData) =>
    api.post('/ai/convert-text-pdf', formData, {
      responseType: 'blob',
    }),
  status: () => api.get('/ai/status'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getCourses: (slug) => api.get(`/categories/${slug}/courses`),
};

export const enrollmentAPI = {
  my: () => api.get('/enrollments/my'),
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  updateProgress: (courseId, data) => api.patch(`/enrollments/${courseId}/progress`, data),
  certificate: (courseId) => api.get(`/enrollments/${courseId}/certificate`, { responseType: 'blob' }),
};

export const paymentAPI = {
  checkout: (courseIds) => api.post('/payments/checkout', { courseIds }),
  my: () => api.get('/payments/my'),
  receipt: (id) => api.get(`/payments/${id}/receipt`, { responseType: 'blob' }),
};

export const dashboardAPI = {
  student: () => api.get('/dashboard/student'),
  instructor: () => api.get('/dashboard/instructor'),
  admin: () => api.get('/dashboard/admin'),
};

export const communityAPI = {
  // Channels
  getChannels: () => api.get('/community/channels'),
  createChannel: (data) => api.post('/community/channels', data),
  getChannel: (id) => api.get(`/community/channels/${id}`),
  joinChannel: (id) => api.post(`/community/channels/${id}/join`),
  leaveChannel: (id) => api.post(`/community/channels/${id}/leave`),
  // Messages
  getStickers: (params) => api.get('/community/stickers', { params }),
  uploadAttachment: (channelId, data) => api.post(`/community/channels/${channelId}/attachments`, data),
  getMessages: (channelId, params) => api.get(`/community/channels/${channelId}/messages`, { params }),
  createMessage: (channelId, data) => api.post(`/community/channels/${channelId}/messages`, data),
  updateMessage: (id, data) => api.put(`/community/messages/${id}`, data),
  deleteMessage: (id) => api.delete(`/community/messages/${id}`),
  addReaction: (id, data) => api.post(`/community/messages/${id}/reactions`, data),
  // Threads
  getThreads: (params) => api.get('/community/threads', { params }),
  createThread: (data) => api.post('/community/threads', data),
  getThread: (id) => api.get(`/community/threads/${id}`),
  voteThread: (id, data) => api.post(`/community/threads/${id}/vote`, data),
  // Replies
  getReplies: (threadId) => api.get(`/community/threads/${threadId}/replies`),
  createReply: (threadId, data) => api.post(`/community/threads/${threadId}/replies`, data),
  acceptReply: (id) => api.post(`/community/replies/${id}/accept`),
  // Connections
  getConnections: () => api.get('/community/connections'),
  sendConnectionRequest: (data) => api.post('/community/connections', data),
  respondToConnection: (id, data) => api.put(`/community/connections/${id}`, data),
};
