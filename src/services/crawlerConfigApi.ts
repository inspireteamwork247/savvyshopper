
import { apiRequest } from './apiClient';
import { CrawlerConfig, SelectorSchema } from '@/types/admin';

export const getCrawlerConfigs = async (): Promise<CrawlerConfig[]> => {
  return await apiRequest<CrawlerConfig[]>('crawler/configs');
};

export const getCrawlerConfigsByStore = async (storeId: string): Promise<CrawlerConfig[]> => {
  return await apiRequest<CrawlerConfig[]>(`stores/${storeId}/crawler/configs`);
};

export const getCrawlerConfig = async (id: string): Promise<CrawlerConfig> => {
  return await apiRequest<CrawlerConfig>(`crawler/configs/${id}`);
};

export const createCrawlerConfig = async (config: Partial<CrawlerConfig>): Promise<CrawlerConfig> => {
  return await apiRequest<CrawlerConfig>('crawler/configs', 'POST', config);
};

export const updateCrawlerConfig = async (id: string, config: Partial<CrawlerConfig>): Promise<CrawlerConfig> => {
  return await apiRequest<CrawlerConfig>(`crawler/configs/${id}`, 'PUT', config);
};

export const deleteCrawlerConfig = async (id: string): Promise<void> => {
  return await apiRequest<void>(`crawler/configs/${id}`, 'DELETE');
};

export const generateSelectorSchema = async (html: string, url: string): Promise<SelectorSchema> => {
  return await apiRequest<SelectorSchema>('crawler/generate-schema', 'POST', {
    html_element: html,
    sample_url: url
  });
};

// Mock function to parse HTML and extract CSS selectors
// In a real implementation, this would be handled by the backend
export const generateSelectorSchemaLocal = (html: string): SelectorSchema => {
  // Simplified schema extraction for demo purposes
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Try to find a base element that might represent a product
  const baseElement = doc.querySelector('div.mod-article-tile') || 
                       doc.querySelector('div.product') || 
                       doc.querySelector('div.item');
  
  if (!baseElement) {
    return {
      name: "Product Information",
      baseSelector: "div.product",
      fields: []
    };
  }
  
  const baseSelector = baseElement.tagName.toLowerCase() + 
    (baseElement.className ? '.' + baseElement.className.split(' ').join('.') : '');
  
  // Try to identify common product fields
  const fields = [];
  
  // Look for product name
  const nameElement = doc.querySelector('span.mod-article-tile__title') || 
                      doc.querySelector('h1.product-name') ||
                      doc.querySelector('h2.product-name');
  if (nameElement) {
    fields.push({
      name: "name",
      selector: nameElement.tagName.toLowerCase() + 
        (nameElement.className ? '.' + nameElement.className.split(' ').join('.') : ''),
      type: "text"
    });
  }
  
  // Look for price
  const priceElement = doc.querySelector('span.price__wrapper') || 
                       doc.querySelector('div.price') ||
                       doc.querySelector('span.price');
  if (priceElement) {
    fields.push({
      name: "price",
      selector: priceElement.tagName.toLowerCase() + 
        (priceElement.className ? '.' + priceElement.className.split(' ').join('.') : ''),
      type: "text"
    });
  }
  
  // Look for image
  const imageElement = doc.querySelector('img.img-responsive') || 
                       doc.querySelector('img.product-image');
  if (imageElement) {
    fields.push({
      name: "image",
      selector: imageElement.tagName.toLowerCase() + 
        (imageElement.className ? '.' + imageElement.className.split(' ').join('.') : ''),
      type: "attr",
      attr: "src"
    });
    
    fields.push({
      name: "image_alt",
      selector: imageElement.tagName.toLowerCase() + 
        (imageElement.className ? '.' + imageElement.className.split(' ').join('.') : ''),
      type: "attr",
      attr: "alt"
    });
  }
  
  // Look for description in json-ld
  const jsonLdElement = doc.querySelector('script[type="application/ld+json"]');
  if (jsonLdElement) {
    fields.push({
      name: "description",
      selector: 'script[type="application/ld+json"]',
      type: "json",
      jsonPath: "$.description"
    });
  }
  
  // Look for brand
  const brandElement = doc.querySelector('span.mod-article-tile__brand') || 
                       doc.querySelector('div.brand') ||
                       doc.querySelector('span.brand');
  if (brandElement) {
    fields.push({
      name: "brand",
      selector: brandElement.tagName.toLowerCase() + 
        (brandElement.className ? '.' + brandElement.className.split(' ').join('.') : ''),
      type: "text"
    });
  }
  
  // Include product ID if the base element has an ID
  if (baseElement.id) {
    fields.push({
      name: "product_id",
      selector: baseSelector,
      type: "attr",
      attr: "id"
    });
  }
  
  // Look for data attributes
  if (baseElement.hasAttribute('data-article')) {
    fields.push({
      name: "primary_category",
      selector: baseSelector,
      type: "attr",
      attr: "data-article",
      jsonPath: "$.productCategory.primaryCategory"
    });
    
    fields.push({
      name: "sub_category_1",
      selector: baseSelector,
      type: "attr",
      attr: "data-article",
      jsonPath: "$.productCategory.subCategory1"
    });
    
    fields.push({
      name: "sub_category_2",
      selector: baseSelector,
      type: "attr",
      attr: "data-article",
      jsonPath: "$.productCategory.subCategory2"
    });
  }
  
  // Look for price_per_liter
  const basePriceElement = doc.querySelector('span.price__base');
  if (basePriceElement) {
    fields.push({
      name: "price_per_liter",
      selector: "span.price__base",
      type: "text"
    });
  }
  
  // Look for deposit info
  const depositElement = doc.querySelector('span.price__info');
  if (depositElement) {
    fields.push({
      name: "deposit_fee",
      selector: "span.price__info",
      type: "text"
    });
  }
  
  // Look for product URL
  const urlElement = doc.querySelector('a.mod-article-tile__action') || 
                     doc.querySelector('a.product-link');
  if (urlElement) {
    fields.push({
      name: "offer_url",
      selector: urlElement.tagName.toLowerCase() + 
        (urlElement.className ? '.' + urlElement.className.split(' ').join('.') : ''),
      type: "attr",
      attr: "href"
    });
  }
  
  return {
    name: "Product Information",
    baseSelector: baseSelector,
    fields: fields
  };
};

// Generate a sample product from the schema and HTML
export const generateSampleProduct = (html: string, schema: SelectorSchema): any => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the base element
    const baseElement = doc.querySelector(schema.baseSelector);
    if (!baseElement) return {};
    
    // Extract values for each field
    const product: Record<string, any> = {};
    
    for (const field of schema.fields) {
      try {
        const element = baseElement.querySelector(field.selector) || doc.querySelector(field.selector);
        
        if (!element) continue;
        
        if (field.type === 'text') {
          product[field.name] = element.textContent?.trim() || '';
        } 
        else if (field.type === 'attr' && field.attr) {
          if (field.attr === 'data-article' && field.jsonPath) {
            try {
              const attrValue = element.getAttribute(field.attr) || '';
              const jsonObj = JSON.parse(attrValue);
              const parts = field.jsonPath.replace('$.', '').split('.');
              let value = jsonObj;
              
              for (const part of parts) {
                value = value[part];
              }
              
              product[field.name] = value;
            } catch (e) {
              product[field.name] = element.getAttribute(field.attr) || '';
            }
          } else {
            product[field.name] = element.getAttribute(field.attr) || '';
          }
        }
        else if (field.type === 'json' && field.jsonPath) {
          try {
            const jsonContent = element.textContent || '';
            const jsonObj = JSON.parse(jsonContent);
            const parts = field.jsonPath.replace('$.', '').split('.');
            let value = jsonObj;
            
            for (const part of parts) {
              value = value[part];
            }
            
            product[field.name] = value;
          } catch (e) {
            product[field.name] = '';
          }
        }
        else if (field.type === 'html') {
          product[field.name] = element.innerHTML || '';
        }
      } catch (error) {
        console.error(`Error extracting ${field.name}:`, error);
      }
    }
    
    // Organize data in a more structured way
    const structuredProduct: any = {
      productID: product.product_id || '',
      productName: product.name || '',
      brand: product.brand || '',
      priceWithTax: parseFloat(product.price || '0'),
      unitDetails: {
        packageSize: '',
        basePrice: product.price_per_liter || '',
        deposit: product.deposit_fee || ''
      },
      productCategory: {
        primaryCategory: product.primary_category || '',
        subCategory1: product.sub_category_1 || '',
        subCategory2: product.sub_category_2 || ''
      },
      image: {
        url: product.image || '',
        alt: product.image_alt || ''
      },
      productURL: product.offer_url || ''
    };
    
    return structuredProduct;
  } catch (error) {
    console.error('Error generating sample product:', error);
    return {};
  }
};
