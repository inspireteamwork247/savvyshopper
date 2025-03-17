
import { apiRequest } from './apiClient';
import { CrawlerConfig, SelectorSchema } from '@/types/admin';

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

// Add the missing functions below
export const generateSelectorSchemaLocal = (htmlElement: string): SelectorSchema => {
  // In a real implementation, this would call an API endpoint
  // For now, we're generating a simple schema based on common selectors
  return {
    name: "Product Information",
    baseSelector: "div.mod-article-tile",
    fields: [
      {
        name: "name",
        selector: "span.mod-article-tile__title",
        type: "text"
      },
      {
        name: "price",
        selector: "span.price__wrapper",
        type: "text"
      },
      {
        name: "image",
        selector: "img.img-responsive",
        type: "attr",
        attr: "src"
      },
      {
        name: "brand",
        selector: "span.mod-article-tile__brand",
        type: "text"
      },
      {
        name: "product_id",
        selector: "div.mod-article-tile",
        type: "attr",
        attr: "id"
      }
    ]
  };
};

export const generateSampleProduct = (htmlElement: string, schema: SelectorSchema): any => {
  // In a real implementation, this would apply the schema to the HTML
  // For now, we're returning a mock product
  return {
    "productID": "0276",
    "productName": "Fruchtschorlen",
    "brand": "WIESGART",
    "priceWithTax": 3.49,
    "quantity": 1,
    "unitDetails": {
      "packageSize": "6 x 0,5-Liter-Flasche",
      "basePrice": "Liter = 1.16",
      "deposit": "Zzgl. Pfand 6 x 0.25 = 1.50"
    },
    "inPromotion": false,
    "productCategory": {
      "primaryCategory": "Unsere Marken",
      "subCategory1": "WIESGART",
      "subCategory2": "n/a"
    },
    "image": {
      "url": "https://example.com/image.png",
      "alt": "Product image",
      "width": 288,
      "height": 288
    }
  };
};
