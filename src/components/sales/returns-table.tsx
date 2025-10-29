'use client';

import { SaleReturn } from '@/types/sales';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface ReturnsTableProps {
  returns: SaleReturn[];
  onUpdateStatus: (id: string, status: SaleReturn['status']) => void;
  onDelete: (id: string) => void;
}

export function ReturnsTable({ returns, onUpdateStatus, onDelete }: ReturnsTableProps) {
  const getStatusBadge = (status: SaleReturn['status']) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Return #</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Refund Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No returns found
              </TableCell>
            </TableRow>
          ) : (
            returns.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                <TableCell>{ret.invoiceNumber}</TableCell>
                <TableCell>{ret.customerName}</TableCell>
                <TableCell>{new Date(ret.returnDate).toLocaleDateString()}</TableCell>
                <TableCell>{ret.items.length}</TableCell>
                <TableCell className="text-red-600">Rs. {ret.totalAmount.toLocaleString('en-LK')}</TableCell>
                <TableCell><Badge variant="outline">{ret.refundMethod}</Badge></TableCell>
                <TableCell>{getStatusBadge(ret.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {ret.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => onUpdateStatus(ret.id, 'approved')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(ret.id, 'rejected')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(ret.id)} className="text-destructive">
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
