'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockItem, StockAdjustment } from '@/types/inventory-new';

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (adjustment: Omit<StockAdjustment, 'id' | 'createdAt' | 'productName' | 'warehouseName'>) => void;
  stockItem: StockItem | null;
}

export function AdjustStockDialog({ open, onOpenChange, onSave, stockItem }: AdjustStockDialogProps) {
  const [formData, setFormData] = useState({
    adjustmentType: 'add' as StockAdjustment['adjustmentType'],
    adjustmentQuantity: '',
    reason: '',
    adjustedBy: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (open && stockItem) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      setFormData({
        adjustmentType: 'add',
        adjustmentQuantity: '',
        reason: '',
        adjustedBy: user?.name || '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [open, stockItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItem) return;
    
    onSave({
      stockItemId: stockItem.id,
      adjustmentType: formData.adjustmentType,
      previousQuantity: stockItem.quantity,
      adjustmentQuantity: parseInt(formData.adjustmentQuantity),
      reason: formData.reason,
      adjustedBy: formData.adjustedBy,
      date: formData.date,
      newQuantity: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {stockItem?.productName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold">{stockItem?.quantity} units</p>
              <p className="text-xs text-gray-500">{stockItem?.warehouseName}</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Adjustment Type</label>
              <Select value={formData.adjustmentType} onValueChange={(value: any) => setFormData({ ...formData, adjustmentType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                  <SelectItem value="set">Set Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={formData.adjustmentQuantity}
                onChange={(e) => setFormData({ ...formData, adjustmentQuantity: e.target.value })}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Reason</label>
              <Input
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Adjusted By</label>
              <Input
                value={formData.adjustedBy}
                onChange={(e) => setFormData({ ...formData, adjustedBy: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Adjust Stock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
