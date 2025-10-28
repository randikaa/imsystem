'use client';

import { SupplierPayment } from '@/types/supplier';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PaymentsTableProps {
  payments: SupplierPayment[];
  onDelete: (id: string) => void;
}

export function PaymentsTable({ payments, onDelete }: PaymentsTableProps) {
  const getPaymentMethodBadge = (method: SupplierPayment['paymentMethod']) => {
    const colors = {
      'cash': 'bg-green-100 text-green-700',
      'bank-transfer': 'bg-blue-100 text-blue-700',
      'cheque': 'bg-purple-100 text-purple-700',
      'credit': 'bg-orange-100 text-orange-700',
    };
    
    const labels = {
      'cash': 'Cash',
      'bank-transfer': 'Bank Transfer',
      'cheque': 'Cheque',
      'credit': 'Credit',
    };
    
    return <Badge className={colors[method]}>{labels[method]}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No payments found
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{payment.supplierName}</TableCell>
                <TableCell className="font-medium text-green-600">
                  Rs. {payment.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                <TableCell>{payment.reference || '-'}</TableCell>
                <TableCell>{payment.notes || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(payment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
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
