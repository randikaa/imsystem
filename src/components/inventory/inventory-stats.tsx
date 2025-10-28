import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryItem } from '@/types/inventory';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

interface InventoryStatsProps {
  items: InventoryItem[];
}

export function InventoryStats({ items }: InventoryStatsProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = items.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;
  const categories = new Set(items.map(item => item.category)).size;

  const stats = [
    { title: 'Total Items', value: totalItems, icon: Package, color: 'text-blue-600' },
    { title: 'Total Value', value: `Rs. ${totalValue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-600' },
    { title: 'Low Stock', value: lowStockItems, icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Categories', value: categories, icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
