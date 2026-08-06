import api from '@/lib/api';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },
  
  getUserGrowthData: async () => {
    const res = await api.get('/admin/dashboard/user-growth');
    return res.data;
  },

  // Users
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  getUserById: async (id: string) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },

  suspendUser: async (id: string) => {
    const res = await api.patch(`/admin/users/${id}/suspend`);
    return res.data;
  },

  unsuspendUser: async (id: string) => {
    const res = await api.patch(`/admin/users/${id}/unsuspend`);
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  // Subscriptions
  getSubscriptions: async (params?: { page?: number; limit?: number; plan?: string; status?: string }) => {
    const res = await api.get('/admin/subscriptions', { params });
    return res.data;
  },

  updateSubscription: async (userId: string, data: any) => {
    const res = await api.patch(`/admin/subscriptions/${userId}`, data);
    return res.data;
  },

  // Messages
  getMessages: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    try {
      console.log('[ADMIN-FRONTEND] === STARTING getMessages ===');
      console.log('[ADMIN-FRONTEND] Params:', params);
      
      const res = await api.get('/admin/messages', { params });
      
      console.log('[ADMIN-FRONTEND] Response received');
      console.log('[ADMIN-FRONTEND] res.status:', res.status);
      console.log('[ADMIN-FRONTEND] res.data type:', typeof res.data);
      console.log('[ADMIN-FRONTEND] res.data:', res.data);
      console.log('[ADMIN-FRONTEND] res.data keys:', Object.keys(res.data || {}));
      console.log('[ADMIN-FRONTEND] res.data.messages exists:', !!res.data?.messages);
      console.log('[ADMIN-FRONTEND] res.data.messages is array:', Array.isArray(res.data?.messages));
      console.log('[ADMIN-FRONTEND] res.data.messages length:', res.data?.messages?.length);
      
      // The backend returns { messages: [...], pagination: {...} }
      if (!res.data) {
        console.error('[ADMIN-FRONTEND] res.data is null/undefined');
        return { messages: [], pagination: {} };
      }
      
      if (!Array.isArray(res.data.messages)) {
        console.error('[ADMIN-FRONTEND] res.data.messages is not an array:', res.data.messages);
        return { messages: [], pagination: {} };
      }
      
      console.log('[ADMIN-FRONTEND] === SUCCESS: Got messages, count:', res.data.messages.length);
      return res.data;
    } catch (error: any) {
      console.error('[ADMIN-FRONTEND] === ERROR THROWN ===');
      console.error('[ADMIN-FRONTEND] Error message:', error.message);
      if (error.response) {
        console.error('[ADMIN-FRONTEND] Error response status:', error.response.status);
        console.error('[ADMIN-FRONTEND] Error response data:', error.response.data);
      }
      throw error;
    }
  },

  markMessageAsRead: async (id: string) => {
    const res = await api.patch(`/admin/messages/${id}/read`);
    return res.data;
  },

  replyToMessage: async (id: string, content: string, subject?: string) => {
    const res = await api.post(`/admin/messages/${id}/reply`, { content, subject });
    return res.data;
  },

  // Properties
  getProperties: async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await api.get('/admin/properties', { params });
    return res.data;
  },

  // Payments
  getPayments: async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await api.get('/admin/payments', { params });
    return res.data;
  },

  // Activity Log
  getActivityLog: async (limit?: number) => {
    const res = await api.get('/admin/activity-log', { params: { limit } });
    return res.data;
  }
};
