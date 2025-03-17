
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  CrawlerConfig, 
  CrawlerFrequency, 
  Retailer, 
  SelectorSchema, 
  Store 
} from '@/types/admin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  createCrawlerConfig, 
  updateCrawlerConfig, 
  generateSelectorSchemaLocal, 
  generateSampleProduct 
} from '@/services/crawlerConfigApi';

interface CrawlerConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: CrawlerConfig | null;
  retailers: Retailer[];
  stores: Store[];
  onSubmit: () => void;
}

const CrawlerConfigDialog = ({ 
  open, 
  onOpenChange, 
  config, 
  retailers, 
  stores, 
  onSubmit 
}: CrawlerConfigDialogProps) => {
  const [formData, setFormData] = useState<Partial<CrawlerConfig>>({
    name: '',
    retailer_id: '',
    store_id: '',
    frequency: 'WEEKLY',
    crawler_type: 'CSS_PRODUCT_CRAWLER',
    scheduled_run_times: ['12:00'],
    html_element: '',
    sample_url: '',
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [generatedSchema, setGeneratedSchema] = useState<SelectorSchema | null>(null);
  const [sampleProduct, setSampleProduct] = useState<any>(null);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [timeInput, setTimeInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update filtered stores when retailer changes
  useEffect(() => {
    if (formData.retailer_id) {
      setFilteredStores(stores.filter(store => store.retailer_id === formData.retailer_id));
    } else {
      setFilteredStores(stores);
    }
  }, [formData.retailer_id, stores]);
  
  // Initialize form data when the dialog opens with an existing config
  useEffect(() => {
    if (config) {
      setFormData({
        ...config,
      });
      
      if (config.product_css_selector_schema) {
        setGeneratedSchema(config.product_css_selector_schema);
      }
    } else {
      setFormData({
        name: '',
        retailer_id: '',
        store_id: '',
        frequency: 'WEEKLY',
        crawler_type: 'CSS_PRODUCT_CRAWLER',
        scheduled_run_times: ['12:00'],
        html_element: '',
        sample_url: '',
      });
      setGeneratedSchema(null);
      setSampleProduct(null);
    }
    
    setActiveTab('basic');
  }, [config, open]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing retailer, clear store selection
    if (name === 'retailer_id') {
      setFormData(prev => ({ ...prev, store_id: '' }));
    }
    
    // Update retailer_name if retailer changes
    if (name === 'retailer_id') {
      const selectedRetailer = retailers.find(r => r.id === value);
      if (selectedRetailer) {
        setFormData(prev => ({ ...prev, retailer_name: selectedRetailer.name }));
      }
    }
  };
  
  const handleAddScheduledTime = () => {
    if (!timeInput || !timeInput.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      toast.error('Please enter a valid time in 24-hour format (HH:MM)');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      scheduled_run_times: [...(prev.scheduled_run_times || []), timeInput]
    }));
    
    setTimeInput('');
  };
  
  const handleRemoveScheduledTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      scheduled_run_times: (prev.scheduled_run_times || []).filter(t => t !== time)
    }));
  };
  
  const generateSchema = () => {
    if (!formData.html_element) {
      toast.error('Please enter HTML element');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, you would call the API
      // For this demo, we're using a local function
      const schema = generateSelectorSchemaLocal(formData.html_element);
      setGeneratedSchema(schema);
      
      // Update the form data with the generated schema
      setFormData(prev => ({
        ...prev,
        product_css_selector_schema: schema
      }));
      
      // Generate a sample product
      const product = generateSampleProduct(formData.html_element, schema);
      setSampleProduct(product);
      
      toast.success('Schema generated successfully');
    } catch (error) {
      console.error('Error generating schema:', error);
      toast.error('Failed to generate schema');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.retailer_id || !formData.store_id) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (formData.crawler_type === 'CSS_PRODUCT_CRAWLER' && !formData.product_css_selector_schema) {
      toast.error('Please generate a CSS selector schema');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (config) {
        await updateCrawlerConfig(config.id, formData);
        toast.success('Crawler configuration updated successfully');
      } else {
        await createCrawlerConfig(formData);
        toast.success('Crawler configuration created successfully');
      }
      
      onSubmit();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to ${config ? 'update' : 'create'} crawler configuration: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {config ? 'Edit' : 'Create'} Crawler Configuration
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="schema">CSS Selector Schema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Configuration Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="E.g., Aldi Nord Product CSS Crawler"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retailer_id">Retailer</Label>
                <Select
                  value={formData.retailer_id || ''}
                  onValueChange={(value) => handleSelectChange('retailer_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a retailer" />
                  </SelectTrigger>
                  <SelectContent>
                    {retailers.map((retailer) => (
                      <SelectItem key={retailer.id} value={retailer.id}>
                        {retailer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store_id">Store</Label>
                <Select
                  value={formData.store_id || ''}
                  onValueChange={(value) => handleSelectChange('store_id', value)}
                  disabled={!formData.retailer_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.retailer_id ? "Select a store" : "Select a retailer first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.store_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crawler_type">Crawler Type</Label>
                <Select
                  value={formData.crawler_type || 'CSS_PRODUCT_CRAWLER'}
                  onValueChange={(value) => handleSelectChange('crawler_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crawler type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSS_PRODUCT_CRAWLER">CSS Product Crawler</SelectItem>
                    <SelectItem value="LLM_PRODUCT_CRAWLER">LLM Product Crawler</SelectItem>
                    <SelectItem value="INDEXER">Indexer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sample_url">Sample URL</Label>
                <Input
                  id="sample_url"
                  name="sample_url"
                  value={formData.sample_url || ''}
                  onChange={handleInputChange}
                  placeholder="E.g., https://www.aldi-nord.de/sortiment/aldi-eigenmarken/wiesgart.html"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Crawler Frequency</Label>
                <Select
                  value={formData.frequency || 'WEEKLY'}
                  onValueChange={(value) => handleSelectChange('frequency', value as CrawlerFrequency)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="HOURLY">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Scheduled Run Times</Label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" onClick={handleAddScheduledTime}>
                    Add
                  </Button>
                </div>
                
                <div className="mt-2">
                  {(formData.scheduled_run_times || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(formData.scheduled_run_times || []).map((time) => (
                        <div key={time} className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
                          <span>{time}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveScheduledTime(time)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No scheduled times added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schema" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="html_element">HTML Element (Sample)</Label>
                <Textarea
                  id="html_element"
                  name="html_element"
                  value={formData.html_element || ''}
                  onChange={handleInputChange}
                  placeholder="Paste a sample HTML element here"
                  className="h-40 font-mono text-sm"
                />
              </div>
              
              <Button 
                type="button" 
                onClick={generateSchema} 
                disabled={isGenerating || !formData.html_element}
              >
                {isGenerating ? 'Generating...' : 'Generate Schema'}
              </Button>
              
              {generatedSchema && (
                <>
                  <div className="space-y-2">
                    <Label>Generated Schema</Label>
                    <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                      <pre className="text-xs">
                        {JSON.stringify(generatedSchema, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  {sampleProduct && (
                    <div className="space-y-2">
                      <Label>Sample Product</Label>
                      <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                        <pre className="text-xs">
                          {JSON.stringify(sampleProduct, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? config ? 'Updating...' : 'Creating...'
              : config ? 'Update' : 'Create'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlerConfigDialog;
