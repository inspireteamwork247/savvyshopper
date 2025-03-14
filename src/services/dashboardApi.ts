
import { apiRequest } from './apiClient';

interface DashboardStats {
  totalRetailers: number;
  totalStores: number;
  totalBranches: number;
  totalTasks: number;
  tasksByStatus: {
    PENDING: number;
    RUNNING: number;
    SUCCESS: number;
    FAILURE: number;
  };
  storesByCountry: Record<string, number>;
  branchesByCity: Record<string, number>;
  recentTaskRuns: Array<{
    id: string;
    store_name: string;
    scraper_type: string;
    status: string;
    last_run: string;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return await apiRequest<DashboardStats>('dashboard/stats');
};
