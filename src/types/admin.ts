
export type IntegrationType = 'API' | 'SCRAPER' | 'MANUAL';
export type ScraperType = 'INDEXER' | 'SCRAPE_PRODUCT_CSS' | 'SCRAPE_PRODUCT_LLM';
export type TaskStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';

export interface Retailer {
  id: string;
  name: string;
  website?: string;
  countries: string[];
  integration_type: IntegrationType;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  retailer_id: string;
  store_name: string;
  country: string;
  last_updated: string;
  created_at: string;
}

export interface StoreBranch {
  id: string;
  retailer_id: string;
  store_id: string;
  branch_id: string;
  branch_url?: string;
  offers_url?: string;
  country: string;
  city: string;
  street: string;
  house_number?: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  last_updated: string;
  created_at: string;
}

export interface CrawlerTask {
  id: string;
  store_id: string;
  scraper_type: ScraperType;
  url_pattern?: string;
  sitemap_url?: string;
  index_urls?: string[];
  selectors?: Record<string, string>;
  schedule_times?: string[];
  status: TaskStatus;
  last_run?: string;
  created_at: string;
  updated_at: string;
}
