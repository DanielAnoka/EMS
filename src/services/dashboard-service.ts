import axiosInstance from '../utils/axiosInstance';
import type { User } from '../types/auth';

export interface DashboardStats {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
  type: 'payment' | 'registration' | 'maintenance' | 'approval' | 'alert';
}

export interface DashboardData {
  stats: DashboardStats[];
  recentActivity: RecentActivity[];
  welcomeMessage: string;
}

export const dashboardService = {
  getDashboardData: async (user: User): Promise<DashboardData> => {
    const response = await axiosInstance.get(`/dashboard/${user.role_id}`);
    return response.data;
  },

  getSuperAdminStats: async (): Promise<DashboardStats[]> => {
    const response = await axiosInstance.get('/dashboard/super-admin/stats');
    return response.data;
  },

  getAdminStats: async (): Promise<DashboardStats[]> => {
    const response = await axiosInstance.get('/dashboard/admin/stats');
    return response.data;
  },

  getEstateAdminStats: async (estateId?: number): Promise<DashboardStats[]> => {
    const url = estateId 
      ? `/dashboard/estate-admin/stats?estate_id=${estateId}`
      : '/dashboard/estate-admin/stats';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getTenantStats: async (): Promise<DashboardStats[]> => {
    const response = await axiosInstance.get('/dashboard/tenant/stats');
    return response.data;
  },

  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await axiosInstance.get(`/dashboard/activity?limit=${limit}`);
    return response.data;
  },
};
