'use client';

import { ManufactureOrder } from '@/types/bom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, Play, CheckCircle, XCircle } from 'lucide-react';

interface ManufactureOrdersTableProps {
  orders: ManufactureOrder[];
  onUpdateStatus: (id: string, status: ManufactureOrder['status']) => void;
  onDelete: (id: string) => void;
}

export function ManufactureOrdersTable({ orders, onUpdateStatus, onDelete }: ManufactureOrdersTableProps) {
  const getStatusBadge = (status: ManufactureOrder['status']) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="rounded-md border bg-white p-8 text-center text-muted-foreground">
          No manufacture orders found
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="rounded-lg border bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-gray-600">{order.bomName} ({order.bomCode})</p>
                <p className="text-sm text-gray-500">Produced by: {order.producedBy}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-2xl font-bold">{order.quantityToProduce}</p>
                  <p className="text-sm text-gray-600">Total: Rs. {order.totalCost.toLocaleString('en-LK')}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {order.status === 'pending' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'in-progress')}>
                        <Play className="mr-2 h-4 w-4" />
                        Start Production
                      </DropdownMenuItem>
                    )}
                    {order.status === 'in-progress' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'completed')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    {(order.status === 'pending' || order.status === 'in-progress') && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'cancelled')}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(order.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span>{new Date(order.startDate).toLocaleDateString()}</span>
              </div>
              {order.completedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Date:</span>
                  <span>{new Date(order.completedDate).toLocaleDateString()}</span>
                </div>
              )}
              {order.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Notes:</span>
                  <span>{order.notes}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Components Used</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.componentsUsed.map((comp, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{comp.productName}</TableCell>
                      <TableCell>{comp.quantityUsed}</TableCell>
                      <TableCell>Rs. {comp.unitCost.toLocaleString('en-LK')}</TableCell>
                      <TableCell>Rs. {(comp.unitCost * comp.quantityUsed).toLocaleString('en-LK')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
