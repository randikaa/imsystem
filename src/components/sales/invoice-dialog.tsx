'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sale } from '@/types/sales';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
}

export function InvoiceDialog({ open, onOpenChange, sale }: InvoiceDialogProps) {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice - {sale.invoiceNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <p className="text-sm">{sale.customerName}</p>
              <p className="text-sm text-gray-600">Date: {new Date(sale.saleDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2">Invoice Details</h3>
              <p className="text-sm">Invoice #: {sale.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Created by: {sale.createdBy}</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.productSku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Rs. {item.unitPrice.toLocaleString('en-LK')}</TableCell>
                  <TableCell>Rs. {item.total.toLocaleString('en-LK')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {sale.subtotal.toLocaleString('en-LK')}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>Rs. {sale.tax.toLocaleString('en-LK')}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>- Rs. {sale.discount.toLocaleString('en-LK')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>Rs. {sale.total.toLocaleString('en-LK')}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Amount Paid:</span>
              <span>Rs. {sale.amountPaid.toLocaleString('en-LK')}</span>
            </div>
            {sale.balance > 0 && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>Balance Due:</span>
                <span>Rs. {sale.balance.toLocaleString('en-LK')}</span>
              </div>
            )}
          </div>

          {sale.notes && (
            <div className="border-t pt-4">
              <p className="text-sm font-semibold">Notes:</p>
              <p className="text-sm text-gray-600">{sale.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
