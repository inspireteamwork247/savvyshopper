
import { apiRequest } from './apiClient';
import { CrawlerConfig } from '@/types/admin';

export const getCrawlerConfigs = async (): Promise<CrawlerConfig[]> => {
  return await apiRequest<CrawlerConfig[]>('crawler-configs');
};

export const getCrawlerConfig = async (id: string): Promise<CrawlerConfig> => {
  return await apiRequest<CrawlerConfig>(`crawler-configs/${id}`);
};

export const createCrawlerConfig = async (config: Partial<CrawlerConfig>): Promise<CrawlerConfig> => {
  return await apiRequest<CrawlerConfig>('crawler-configs', 'POST', config);
};

export const updateCrawlerConfig = async (id: string, config: Partial<CrawlerConfig>): Promise<CrawlerConfig> => {
  return await apiRequest<CrawlerConfig>(`crawler-configs/${id}`, 'PUT', config);
};

export const deleteCrawlerConfig = async (id: string): Promise<void> => {
  return await apiRequest<void>(`crawler-configs/${id}`, 'DELETE');
};

export const validateSelectorSchema = async (
  htmlElement: string, 
  baseSelector: string
): Promise<any> => {
  return await apiRequest<any>('crawler-configs/validate-schema', 'POST', {
    html_element: htmlElement,
    base_selector: baseSelector
  });
};

export const testCrawlerConfig = async (
  id: string,
  sampleUrl: string
): Promise<any> => {
  return await apiRequest<any>(`crawler-configs/${id}/test`, 'POST', {
    sample_url: sampleUrl
  });
};

export const runCrawlerConfig = async (id: string): Promise<any> => {
  return await apiRequest<any>(`crawler-configs/${id}/run`, 'POST');
};
