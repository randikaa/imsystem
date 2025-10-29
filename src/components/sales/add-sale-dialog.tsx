'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sale, SaleItem } from '@/types/sales';
import { Product } from '@/types/product';
import { Customer } from '@/types/customer';
import { Plus, Trash2 } from 'lucide-react';

interface AddSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sale: Omit<Sale, 'id' | 'createdAt' | 'invoiceNumber' | 'customerName'>) => void;
  products: Product[];
  customers: Customer[];
}

export function AddSaleDialog({ open, onOpenChange, onSave, products, customers }: AddSaleDialogProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    discount: '',
    amountPaid: '',
    notes: '',
    saleDate: new Date().toISOString().split('T')[0],
    createdBy: '',
  });

  const [items, setItems] = useState<Omit<SaleItem, 'id'>[]>([]);

  useEffect(() => {
    if (open) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      setFormData({
        customerId: customers[0]?.id || '',
        discount: '0',
        amountPaid: '0',
        notes: '',
        saleDate: new Date().toISOString().split('T')[0],
        createdBy: user?.name || '',
      });
      setItems([]);
    }
  }, [open, customers]);

  const addItem = () => {
    const product = products[0];
    if (!product) return;
    
    setItems([...items, {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
    }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.productSku = product.sku;
        item.unitPrice = product.price;
        item.total = product.price * item.quantity;
      }
    } else if (field === 'quantity') {
      item.quantity = parseInt(value) || 0;
      item.total = item.unitPrice * item.quantity;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15; // 15% tax
    const discount = parseFloat(formData.discount) || 0;
    const total = subtotal + tax - discount;
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const balance = total - amountPaid;
    
    let paymentStatus: Sale['paymentStatus'] = 'unpaid';
    if (amountPaid >= total) paymentStatus = 'paid';
    else if (amountPaid > 0) paymentStatus = 'partial';
    
    onSave({
      customerId: formData.customerId,
      items: items.map((item, idx) => ({ ...item, id: idx.toString() })),
      subtotal,
      tax,
      discount,
      total,
      amountPaid,
      balance,
      paymentStatus,
      status: 'completed',
      notes: formData.notes,
      saleDate: formData.saleDate,
      createdBy: formData.createdBy,
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.15;
  const discount = parseFloat(formData.discount) || 0;
  const total = subtotal + tax - discount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Customer <span className="text-red-500">*</span></label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Sale Date</label>
                <Input
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Items <span className="text-red-500">*</span></label>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-gray-500">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 rounded-lg border p-3">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Select value={item.productId} onValueChange={(value) => updateItem(index, 'productId', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          placeholder="Qty"
                        />
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600">Rs. {item.total.toLocaleString('en-LK')}</span>
                        </div>
                      </div>
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString('en-LK')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (15%):</span>
                <span>Rs. {tax.toLocaleString('en-LK')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-32 h-8"
                />
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>Rs. {total.toLocaleString('en-LK')}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Amount Paid</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                placeholder="0.00"
              />
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
            <Button type="submit">Create Sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
