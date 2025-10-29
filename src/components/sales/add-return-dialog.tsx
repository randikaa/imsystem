'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SaleReturn, ReturnItem } from '@/types/sales';
import { Sale } from '@/types/sales';

interface AddReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ret: Omit<SaleReturn, 'id' | 'createdAt' | 'returnNumber' | 'invoiceNumber' | 'customerName'>) => void;
  sales: Sale[];
}

export function AddReturnDialog({ open, onOpenChange, onSave, sales }: AddReturnDialogProps) {
  const [selectedSaleId, setSelectedSaleId] = useState('');
  const [formData, setFormData] = useState({
    refundMethod: 'cash' as SaleReturn['refundMethod'],
    reason: '',
    returnDate: new Date().toISOString().split('T')[0],
    processedBy: '',
  });

  const [returnItems, setReturnItems] = useState<Omit<ReturnItem, 'id'>[]>([]);
  const selectedSale = sales.find(s => s.id === selectedSaleId);

  useEffect(() => {
    if (open) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      setSelectedSaleId(sales[0]?.id || '');
      setFormData({
        refundMethod: 'cash',
        reason: '',
        returnDate: new Date().toISOString().split('T')[0],
        processedBy: user?.name || '',
      });
      setReturnItems([]);
    }
  }, [open, sales]);

  useEffect(() => {
    if (selectedSale) {
      setReturnItems(selectedSale.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: 0,
        unitPrice: item.unitPrice,
        total: 0,
        reason: '',
      })));
    }
  }, [selectedSale]);

  const updateReturnItem = (index: number, field: string, value: any) => {
    const newItems = [...returnItems];
    const item = newItems[index];
    
    if (field === 'quantity') {
      item.quantity = parseInt(value) || 0;
      item.total = item.unitPrice * item.quantity;
    } else if (field === 'reason') {
      item.reason = value;
    }
    
    setReturnItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale) return;
    
    const itemsToReturn = returnItems.filter(item => item.quantity > 0);
    const totalAmount = itemsToReturn.reduce((sum, item) => sum + item.total, 0);
    
    onSave({
      saleId: selectedSale.id,
      customerId: selectedSale.customerId,
      items: itemsToReturn.map((item, idx) => ({ ...item, id: idx.toString() })),
      totalAmount,
      refundMethod: formData.refundMethod,
      reason: formData.reason,
      status: 'pending',
      returnDate: formData.returnDate,
      processedBy: formData.processedBy,
    });
  };

  const totalAmount = returnItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Return</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Sale <span className="text-red-500">*</span></label>
              <Select value={selectedSaleId} onValueChange={setSelectedSaleId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sales.filter(s => s.status === 'completed').map((sale) => (
                    <SelectItem key={sale.id} value={sale.id}>
                      {sale.invoiceNumber} - {sale.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSale && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Items to Return</label>
                {returnItems.map((item, index) => (
                  <div key={index} className="rounded-lg border p-3 space-y-2">
                    <div className="font-medium">{item.productName}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateReturnItem(index, 'quantity', e.target.value)}
                        placeholder="Quantity to return"
                        max={selectedSale.items[index]?.quantity || 0}
                      />
                      <Input
                        value={item.reason}
                        onChange={(e) => updateReturnItem(index, 'reason', e.target.value)}
                        placeholder="Reason"
                      />
                    </div>
                    {item.quantity > 0 && (
                      <div className="text-sm text-gray-600">
                        Refund: Rs. {item.total.toLocaleString('en-LK')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex justify-between font-bold">
                <span>Total Refund Amount:</span>
                <span>Rs. {totalAmount.toLocaleString('en-LK')}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Refund Method</label>
              <Select value={formData.refundMethod} onValueChange={(value: any) => setFormData({ ...formData, refundMethod: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit-note">Credit Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Overall Reason</label>
              <Input
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason for return"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Process Return</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
