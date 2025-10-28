'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Supplier, SupplierPayment } from '@/types/supplier';

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payment: Omit<SupplierPayment, 'id' | 'createdAt'>) => void;
  supplier: Supplier | null;
  suppliers?: Supplier[];
}

export function AddPaymentDialog({ open, onOpenChange, onSave, supplier, suppliers = [] }: AddPaymentDialogProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash' as SupplierPayment['paymentMethod'],
    reference: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const currentSupplier = supplier || suppliers.find(s => s.id === selectedSupplierId);

  useEffect(() => {
    if (open) {
      if (!supplier && suppliers.length > 0) {
        setSelectedSupplierId(suppliers[0].id);
      }
      setFormData({
        amount: '',
        paymentMethod: 'cash',
        reference: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [open, supplier, suppliers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentSupplier) {
      return;
    }

    onSave({
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.company,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      reference: formData.reference,
      notes: formData.notes,
      date: formData.date,
    });

    setFormData({
      amount: '',
      paymentMethod: 'cash',
      reference: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment{currentSupplier ? ` - ${currentSupplier.company}` : ''}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!supplier && suppliers.length > 0 && (
              <div className="grid gap-2">
                <label htmlFor="supplier" className="text-sm font-medium">
                  Select Supplier <span className="text-red-500">*</span>
                </label>
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.company} - Balance: Rs. {s.balance.toLocaleString('en-LK')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentSupplier && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {currentSupplier.balance.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Payment Amount <span className="text-red-500">*</span>
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
              />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
            </div>

            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            <div className="grid gap-2">
              <label htmlFor="paymentMethod" className="text-sm font-medium">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value: SupplierPayment['paymentMethod']) => 
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="reference" className="text-sm font-medium">
                Reference Number
              </label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Enter reference number"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Input
                id="notes"
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
            <Button type="submit">Add Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
