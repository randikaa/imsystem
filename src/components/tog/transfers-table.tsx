'use client';

import { Transfer } from '@/types/warehouse';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, CheckCircle, Truck, XCircle } from 'lucide-react';

interface TransfersTableProps {
  transfers: Transfer[];
  onUpdateStatus: (id: string, status: Transfer['status']) => void;
  onDelete: (id: string) => void;
}

export function TransfersTable({ transfers, onUpdateStatus, onDelete }: TransfersTableProps) {
  const getStatusBadge = (status: Transfer['status']) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'in-transit': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transfer #</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Transfer Date</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No transfers found
              </TableCell>
            </TableRow>
          ) : (
            transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{transfer.productName}</p>
                    <p className="text-xs text-gray-500">{transfer.productSku}</p>
                  </div>
                </TableCell>
                <TableCell>{transfer.fromWarehouseName}</TableCell>
                <TableCell>{transfer.toWarehouseName}</TableCell>
                <TableCell>{transfer.quantity}</TableCell>
                <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                <TableCell>{transfer.requestedBy}</TableCell>
                <TableCell>{new Date(transfer.transferDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {transfer.status === 'pending' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(transfer.id, 'in-transit')}>
                          <Truck className="mr-2 h-4 w-4" />
                          Mark In Transit
                        </DropdownMenuItem>
                      )}
                      {transfer.status === 'in-transit' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(transfer.id, 'completed')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Completed
                        </DropdownMenuItem>
                      )}
                      {(transfer.status === 'pending' || transfer.status === 'in-transit') && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(transfer.id, 'cancelled')}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Transfer
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(transfer.id)} className="text-destructive">
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
