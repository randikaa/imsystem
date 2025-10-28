'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transfer } from '@/types/warehouse';
import { Product } from '@/types/product';
import { Warehouse } from '@/types/warehouse';

interface AddTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transfer: Omit<Transfer, 'id' | 'createdAt' | 'transferNumber' | 'productName' | 'productSku' | 'fromWarehouseName' | 'toWarehouseName'>) => void;
  products: Product[];
  warehouses: Warehouse[];
}

export function AddTransferDialog({ open, onOpenChange, onSave, products, warehouses }: AddTransferDialogProps) {
  const [formData, setFormData] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: '',
    status: 'pending' as Transfer['status'],
    notes: '',
    requestedBy: '',
    transferDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      setFormData({
        productId: products[0]?.id || '',
        fromWarehouseId: warehouses[0]?.id || '',
        toWarehouseId: warehouses[1]?.id || '',
        quantity: '',
        status: 'pending',
        notes: '',
        requestedBy: user?.name || '',
        transferDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [open, products, warehouses]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.fromWarehouseId) newErrors.fromWarehouseId = 'Source warehouse is required';
    if (!formData.toWarehouseId) newErrors.toWarehouseId = 'Destination warehouse is required';
    if (formData.fromWarehouseId === formData.toWarehouseId) {
      newErrors.toWarehouseId = 'Destination must be different from source';
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.requestedBy.trim()) newErrors.requestedBy = 'Requested by is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSave({
      productId: formData.productId,
      fromWarehouseId: formData.fromWarehouseId,
      toWarehouseId: formData.toWarehouseId,
      quantity: parseInt(formData.quantity),
      status: formData.status,
      notes: formData.notes,
      requestedBy: formData.requestedBy,
      transferDate: formData.transferDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Transfer Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Product <span className="text-red-500">*</span>
              </label>
              <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.status === 'active').map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productId && <p className="text-xs text-red-500">{errors.productId}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                From Warehouse <span className="text-red-500">*</span>
              </label>
              <Select value={formData.fromWarehouseId} onValueChange={(value) => setFormData({ ...formData, fromWarehouseId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.filter(w => w.status === 'active').map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fromWarehouseId && <p className="text-xs text-red-500">{errors.fromWarehouseId}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                To Warehouse <span className="text-red-500">*</span>
              </label>
              <Select value={formData.toWarehouseId} onValueChange={(value) => setFormData({ ...formData, toWarehouseId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.filter(w => w.status === 'active').map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.toWarehouseId && <p className="text-xs text-red-500">{errors.toWarehouseId}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
              />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Transfer Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.transferDate}
                onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Requested By <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                placeholder="Enter name"
              />
              {errors.requestedBy && <p className="text-xs text-red-500">{errors.requestedBy}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Transfer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
