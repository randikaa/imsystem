'use client';

import { Sale } from '@/types/sales';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileText, Trash2 } from 'lucide-react';

interface SalesTableProps {
  sales: Sale[];
  onViewInvoice: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

export function SalesTable({ sales, onViewInvoice, onDelete }: SalesTableProps) {
  const getPaymentStatusBadge = (status: Sale['paymentStatus']) => {
    const colors = {
      'paid': 'bg-green-100 text-green-700',
      'partial': 'bg-yellow-100 text-yellow-700',
      'unpaid': 'bg-red-100 text-red-700',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const getStatusBadge = (status: Sale['status']) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'returned': 'bg-red-100 text-red-700',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground">
                No sales found
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>{sale.items.length}</TableCell>
                <TableCell>Rs. {sale.total.toLocaleString('en-LK')}</TableCell>
                <TableCell className="text-green-600">Rs. {sale.amountPaid.toLocaleString('en-LK')}</TableCell>
                <TableCell className={sale.balance > 0 ? 'text-red-600' : ''}>
                  Rs. {sale.balance.toLocaleString('en-LK')}
                </TableCell>
                <TableCell>{getPaymentStatusBadge(sale.paymentStatus)}</TableCell>
                <TableCell>{getStatusBadge(sale.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewInvoice(sale)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(sale.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
