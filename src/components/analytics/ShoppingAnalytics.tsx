
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, PieChart, ShoppingBag, CalendarDays } from 'lucide-react';

// Mock data - replace with real data from your backend
const monthlySpending = [
  { month: 'Jan', amount: 320 },
  { month: 'Feb', amount: 285 },
  { month: 'Mar', amount: 450 },
  { month: 'Apr', amount: 390 },
  { month: 'May', amount: 280 },
  { month: 'Jun', amount: 340 }
];

const categorySpending = [
  { category: 'Groceries', amount: 850 },
  { category: 'Household', amount: 420 },
  { category: 'Personal Care', amount: 230 },
  { category: 'Beverages', amount: 180 },
  { category: 'Snacks', amount: 150 }
];

const priceHistory = [
  { date: '1/1', milk: 2.99, bread: 1.99, eggs: 3.49 },
  { date: '2/1', milk: 3.29, bread: 2.19, eggs: 3.29 },
  { date: '3/1', milk: 2.89, bread: 1.89, eggs: 3.99 },
  { date: '4/1', milk: 3.09, bread: 2.09, eggs: 3.69 },
  { date: '5/1', milk: 2.79, bread: 1.99, eggs: 3.49 },
  { date: '6/1', milk: 3.19, bread: 2.29, eggs: 3.89 }
];

const chartConfig = {
  spending: {
    label: 'Monthly Spending',
    theme: {
      light: '#3b82f6',
      dark: '#60a5fa',
    },
  },
  category: {
    label: 'Category Spending',
    theme: {
      light: '#10b981',
      dark: '#34d399',
    },
  },
  milk: {
    label: 'Milk',
    theme: {
      light: '#6366f1',
      dark: '#818cf8',
    },
  },
  bread: {
    label: 'Bread',
    theme: {
      light: '#f59e0b',
      dark: '#fbbf24',
    },
  },
  eggs: {
    label: 'Eggs',
    theme: {
      light: '#ec4899',
      dark: '#f472b6',
    },
  },
};

export const ShoppingAnalytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shopping Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Average
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$344.17</div>
            <p className="text-xs text-muted-foreground">
              +4.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Category
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Groceries</div>
            <p className="text-xs text-muted-foreground">
              46% of total spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Shopping Trips
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              2 more than last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Bar
                  dataKey="amount"
                  name="spending"
                  fill="var(--color-spending)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={categorySpending} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" />
                <ChartTooltip />
                <Bar
                  dataKey="amount"
                  name="category"
                  fill="var(--color-category)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="milk"
                name="milk"
                stroke="var(--color-milk)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="bread"
                name="bread"
                stroke="var(--color-bread)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="eggs"
                name="eggs"
                stroke="var(--color-eggs)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
