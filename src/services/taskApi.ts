
import { apiRequest } from './apiClient';
import { CrawlerTask } from '@/types/admin';

export const getTasks = async (): Promise<CrawlerTask[]> => {
  return await apiRequest<CrawlerTask[]>('tasks');
};

export const getTasksByStore = async (storeId: string): Promise<CrawlerTask[]> => {
  return await apiRequest<CrawlerTask[]>(`stores/${storeId}/tasks`);
};

export const getTask = async (id: string): Promise<CrawlerTask> => {
  return await apiRequest<CrawlerTask>(`tasks/${id}`);
};

export const createTask = async (task: Partial<CrawlerTask>): Promise<CrawlerTask> => {
  return await apiRequest<CrawlerTask>('tasks', 'POST', task);
};

export const updateTask = async (id: string, task: Partial<CrawlerTask>): Promise<CrawlerTask> => {
  return await apiRequest<CrawlerTask>(`tasks/${id}`, 'PUT', task);
};

export const deleteTask = async (id: string): Promise<void> => {
  return await apiRequest<void>(`tasks/${id}`, 'DELETE');
};

export const runTask = async (id: string): Promise<CrawlerTask> => {
  return await apiRequest<CrawlerTask>(`tasks/${id}/run`, 'POST');
};
