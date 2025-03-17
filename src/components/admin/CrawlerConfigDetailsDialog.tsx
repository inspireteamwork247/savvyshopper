
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CrawlerConfig, Retailer, Store } from '@/types/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CrawlerConfigDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: CrawlerConfig | null;
  retailers: Retailer[];
  stores: Store[];
}

const CrawlerConfigDetailsDialog = ({
  open,
  onOpenChange,
  config,
  retailers,
  stores,
}: CrawlerConfigDetailsDialogProps) => {
  if (!config) return null;

  const getRetailerName = (retailerId: string) => {
    const retailer = retailers.find(r => r.id === retailerId);
    return retailer ? retailer.name : 'Unknown';
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.store_name : 'Unknown';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="schema">CSS Selector Schema</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">ID</p>
                    <p className="text-sm text-muted-foreground">{config.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Name</p>
                    <p className="text-sm text-muted-foreground">{config.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Retailer</p>
                    <p className="text-sm text-muted-foreground">
                      {getRetailerName(config.retailer_id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Store</p>
                    <p className="text-sm text-muted-foreground">
                      {getStoreName(config.store_id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Crawler Type</p>
                    <p className="text-sm text-muted-foreground">{config.crawler_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Sample URL</p>
                    <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
                      {config.sample_url || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Created At</p>
                    <p className="text-sm text-muted-foreground">
                      {config.created_at ? new Date(config.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Updated At</p>
                    <p className="text-sm text-muted-foreground">
                      {config.updated_at ? new Date(config.updated_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Frequency</p>
                    <p className="text-sm text-muted-foreground">{config.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Last Run</p>
                    <p className="text-sm text-muted-foreground">
                      {config.last_run ? new Date(config.last_run).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold">Scheduled Run Times</p>
                  {config.scheduled_run_times && config.scheduled_run_times.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {config.scheduled_run_times.map((time) => (
                        <div key={time} className="bg-gray-100 rounded-md px-3 py-1 text-sm">
                          {time}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No scheduled times</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CSS Selector Schema</CardTitle>
              </CardHeader>
              <CardContent>
                {config.product_css_selector_schema ? (
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                    <pre className="text-xs">
                      {JSON.stringify(config.product_css_selector_schema, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No CSS selector schema defined</p>
                )}
              </CardContent>
            </Card>

            {config.html_element && (
              <Card>
                <CardHeader>
                  <CardTitle>HTML Sample</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">
                      {config.html_element}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlerConfigDetailsDialog;
