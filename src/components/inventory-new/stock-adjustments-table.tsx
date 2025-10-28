'use client';

import { StockAdjustment } from '@/types/inventory-new';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StockAdjustmentsTableProps {
  adjustments: StockAdjustment[];
}

export function StockAdjustmentsTable({ adjustments }: StockAdjustmentsTableProps) {
  const getTypeBadge = (type: StockAdjustment['adjustmentType']) => {
    const variants = {
      'add': 'bg-green-100 text-green-700',
      'remove': 'bg-red-100 text-red-700',
      'set': 'bg-blue-100 text-blue-700',
    };
    return <Badge className={variants[type]}>{type}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Previous Qty</TableHead>
            <TableHead>Adjustment</TableHead>
            <TableHead>New Qty</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Adjusted By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adjustments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No adjustments found
              </TableCell>
            </TableRow>
          ) : (
            adjustments.map((adj) => (
              <TableRow key={adj.id}>
                <TableCell>{new Date(adj.date).toLocaleDateString()}</TableCell>
                <TableCell>{adj.productName}</TableCell>
                <TableCell>{adj.warehouseName}</TableCell>
                <TableCell>{getTypeBadge(adj.adjustmentType)}</TableCell>
                <TableCell>{adj.previousQuantity}</TableCell>
                <TableCell className="font-bold">
                  {adj.adjustmentType === 'add' && '+'}
                  {adj.adjustmentType === 'remove' && '-'}
                  {adj.adjustmentQuantity}
                </TableCell>
                <TableCell className="font-bold">{adj.newQuantity}</TableCell>
                <TableCell>{adj.reason}</TableCell>
                <TableCell>{adj.adjustedBy}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
