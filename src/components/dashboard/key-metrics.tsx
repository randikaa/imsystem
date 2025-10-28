'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  iconColor: string;
}

function MetricCard({ title, value, change, icon: Icon, iconColor }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`rounded-full p-2 ${iconColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center text-xs">
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
          )}
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1 text-gray-500">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KeyMetrics() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: 'Rs. 4,523,100',
      change: 12.5,
      icon: DollarSign,
      iconColor: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: '1,234',
      change: 8.2,
      icon: Package,
      iconColor: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '856',
      change: -3.1,
      icon: ShoppingCart,
      iconColor: 'bg-purple-500',
    },
    {
      title: 'Active Users',
      value: '2,345',
      change: 15.3,
      icon: Users,
      iconColor: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Key Metrics Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
}
