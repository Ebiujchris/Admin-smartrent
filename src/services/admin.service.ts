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
      console.log('[ADMIN-FRONTEND] Calling /admin/messages with params:', params);
      const res = await api.get('/admin/messages', { params });
      console.log('[ADMIN-FRONTEND] Response status:', res.status);
      console.log('[ADMIN-FRONTEND] Full Response object:', JSON.stringify(res.data));
      
      // The response might be wrapped by the TransformInterceptor
      let data = res.data;
      
      // If response is wrapped in a data property, unwrap it
      if (data && typeof data === 'object' && 'data' in data && !('messages' in data)) {
        data = data.data;
      }
      
      console.log('[ADMIN-FRONTEND] Processed data:', JSON.stringify(data));
      
      // Ensure response has messages array
      if (!data || !data.messages) {
        console.error('[ADMIN-FRONTEND] Response missing messages array:', data);
        return { messages: [], pagination: {} };
      }
      
      return data;
    } catch (error: any) {
      console.error('[ADMIN-FRONTEND] Error fetching messages:', error);
      console.error('[ADMIN-FRONTEND] Error response:', error.response?.data);
      console.error('[ADMIN-FRONTEND] Error status:', error.response?.status);
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
