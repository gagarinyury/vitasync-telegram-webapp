import api from './api';

const authService = {
  telegramAuth: async (initData) => {
    const response = await api.post('/auth/telegram', {
      initData,
      hash: window.Telegram?.WebApp?.initDataUnsafe?.hash || '',
    });
    
    if (response.data.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  },

  verifyToken: async (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.get('/auth/verify');
    return response.data;
  },

  logout: () => {
    delete api.defaults.headers.common['Authorization'];
  },
};

export default authService;