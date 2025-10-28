'use client';

import { StockItem } from '@/types/inventory-new';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface StockItemsTableProps {
  items: StockItem[];
  onAdjust: (item: StockItem) => void;
}

export function StockItemsTable({ items, onAdjust }: StockItemsTableProps) {
  const getStatusBadge = (status: StockItem['status']) => {
    const variants = {
      'in-stock': 'bg-green-100 text-green-700',
      'low-stock': 'bg-orange-100 text-orange-700',
      'out-of-stock': 'bg-red-100 text-red-700',
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Max Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No stock items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productSku}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.warehouseName}</TableCell>
                <TableCell className="font-bold">{item.quantity}</TableCell>
                <TableCell>{item.minStock}</TableCell>
                <TableCell>{item.maxStock}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => onAdjust(item)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
