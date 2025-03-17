
import React from 'react';
import { CrawlerConfig, Retailer, Store } from '@/types/admin';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlayIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

interface CrawlerConfigTableViewProps {
  configs: CrawlerConfig[];
  retailers: Retailer[];
  stores: Store[];
  onEditConfig: (config: CrawlerConfig) => void;
  onDeleteConfig: (id: string) => void;
  onViewDetails: (config: CrawlerConfig) => void;
}

const CrawlerConfigTableView = ({
  configs,
  retailers,
  stores,
  onEditConfig,
  onDeleteConfig,
  onViewDetails
}: CrawlerConfigTableViewProps) => {
  const getRetailerName = (retailerId: string) => {
    const retailer = retailers.find(r => r.id === retailerId);
    return retailer ? retailer.name : 'Unknown';
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.store_name : 'Unknown';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Retailer</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.length > 0 ? (
            configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-medium">{config.name}</TableCell>
                <TableCell>{getRetailerName(config.retailer_id)}</TableCell>
                <TableCell>{getStoreName(config.store_id)}</TableCell>
                <TableCell>{config.crawler_type}</TableCell>
                <TableCell>{config.frequency}</TableCell>
                <TableCell>
                  {config.last_run 
                    ? new Date(config.last_run).toLocaleString()
                    : 'Never'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(config)}
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditConfig(config)}
                      title="Edit Configuration"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDeleteConfig(config.id)}
                      title="Delete Configuration"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                No crawler configurations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CrawlerConfigTableView;
