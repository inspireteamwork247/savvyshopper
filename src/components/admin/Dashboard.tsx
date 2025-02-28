
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Retailer, Store, StoreBranch, CrawlerTask } from "@/types/admin";

interface DashboardProps {
  retailers: Retailer[];
  stores: Store[];
  branches: StoreBranch[];
  tasks: CrawlerTask[];
}

export default function Dashboard({ retailers, stores, branches, tasks }: DashboardProps) {
  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskStatusData = Object.entries(tasksByStatus).map(([name, value]) => ({ 
    name, 
    value 
  }));

  const storesByRetailer = stores.reduce((acc, store) => {
    const retailer = retailers.find(r => r.id === store.retailer_id);
    if (retailer) {
      acc[retailer.name] = (acc[retailer.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const storesByRetailerData = Object.entries(storesByRetailer).map(([name, value]) => ({ 
    name, 
    value 
  }));

  const branchesByCountry = branches.reduce((acc, branch) => {
    acc[branch.country] = (acc[branch.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const branchesByCountryData = Object.entries(branchesByCountry).map(([name, value]) => ({ 
    name, 
    value 
  }));

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Overview of all database entities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Retailers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{retailers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branches.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Crawler Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
          <CardDescription>Distribution of task statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={taskStatusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stores by Retailer</CardTitle>
          <CardDescription>Number of stores per retailer</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={storesByRetailerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branches by Country</CardTitle>
          <CardDescription>Distribution of branches across countries</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchesByCountryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
