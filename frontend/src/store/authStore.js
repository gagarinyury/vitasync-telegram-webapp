import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (initData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.telegramAuth(initData);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return response;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      checkAuth: async () => {
        const token = get().token;
        
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const response = await authService.verifyToken(token);
          
          if (response.valid) {
            set({
              user: response.user,
              isAuthenticated: true,
            });
            return true;
          } else {
            get().logout();
            return false;
          }
        } catch (error) {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'vitasync-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);