
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { StoreBranch, Store, Retailer } from "@/types/admin";

interface BranchTableViewProps {
  branches: StoreBranch[];
  stores: Store[];
  retailers: Retailer[];
  storeId?: string;
  onEditBranch: (branch: StoreBranch) => void;
  onDeleteBranch: (id: string) => void;
}

export default function BranchTableView({
  branches,
  stores,
  retailers,
  storeId,
  onEditBranch,
  onDeleteBranch
}: BranchTableViewProps) {
  // Filter branches by storeId if provided
  const filteredBranches = storeId 
    ? branches.filter(branch => branch.store_id === storeId) 
    : branches;

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store?.store_name || "Unknown";
  };

  const getRetailerName = (retailerId: string) => {
    const retailer = retailers.find(r => r.id === retailerId);
    return retailer?.name || "Unknown";
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch ID</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Retailer</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Links</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBranches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.branch_id}</TableCell>
              <TableCell>{getStoreName(branch.store_id)}</TableCell>
              <TableCell>{getRetailerName(branch.retailer_id)}</TableCell>
              <TableCell>
                {branch.street} {branch.house_number}, {branch.zip_code}
              </TableCell>
              <TableCell>{branch.city}</TableCell>
              <TableCell>{branch.country}</TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  {branch.branch_url && (
                    <a
                      href={branch.branch_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      Branch <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {branch.offers_url && (
                    <a
                      href={branch.offers_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      Offers <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditBranch(branch)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => onDeleteBranch(branch.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredBranches.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                No branches found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
