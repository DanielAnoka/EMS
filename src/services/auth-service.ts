import axiosInstance from "../utils/axiosInstance";
import { storage } from "../utils/storage";
import type { LoginPayload, User } from "../types/auth";
import { useMutation } from "@tanstack/react-query";
import { type RegisterPayload } from "../types/auth";

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeToken();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await axiosInstance.post("/login", payload);
    const { token, user } = response.data;
    storage.setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      storage.removeToken();
    }
  },

  me: async (): Promise<User> => {
    const response = await axiosInstance.get("/me");
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await axiosInstance.post("/forgot-password", { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await axiosInstance.post("/reset-password", { token, password });
  },
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await axiosInstance.post("/register", payload);
      return response.data;
    },
  });
};
