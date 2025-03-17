
export type IntegrationType = 'API' | 'SCRAPER' | 'MANUAL';
export type ScraperType = 'INDEXER' | 'SCRAPE_PRODUCT_CSS' | 'SCRAPE_PRODUCT_LLM';
export type TaskStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';
export type CrawlerFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'HOURLY';
export type SelectorType = 'text' | 'attr' | 'json' | 'html';

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

export interface SelectorField {
  name: string;
  selector: string;
  type: SelectorType;
  attr?: string;
  jsonPath?: string;
}

export interface SelectorSchema {
  name: string;
  baseSelector: string;
  fields: SelectorField[];
}

export interface CrawlerConfig {
  id: string;
  retailer_id: string;
  store_id: string;
  retailer_name: string;
  frequency: CrawlerFrequency;
  last_run?: string;
  scheduled_run_times?: string[];
  product_css_selector_schema?: SelectorSchema;
  crawler_type: 'CSS_PRODUCT_CRAWLER' | 'LLM_PRODUCT_CRAWLER' | 'INDEXER';
  name: string;
  html_element?: string;
  sample_url?: string;
  created_at: string;
  updated_at: string;
}
