'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, CustomerPayment } from '@/types/customer';

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payment: Omit<CustomerPayment, 'id' | 'createdAt' | 'customerName'>) => void;
  customer: Customer | null;
  customers: Customer[];
}

export function AddPaymentDialog({ open, onOpenChange, onSave, customer, customers }: AddPaymentDialogProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash' as CustomerPayment['paymentMethod'],
    reference: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const currentCustomer = customer || customers.find(c => c.id === selectedCustomerId);

  useEffect(() => {
    if (open) {
      if (!customer && customers.length > 0) {
        setSelectedCustomerId(customers[0].id);
      }
      setFormData({
        amount: '',
        paymentMethod: 'cash',
        reference: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [open, customer, customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;
    
    onSave({
      customerId: currentCustomer.id,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      reference: formData.reference,
      notes: formData.notes,
      date: formData.date,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment{currentCustomer ? ` - ${currentCustomer.name}` : ''}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!customer && customers.length > 0 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Select Customer <span className="text-red-500">*</span></label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - Balance: Rs. {c.balance.toLocaleString('en-LK')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentCustomer && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {currentCustomer.balance.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium">Payment Amount <span className="text-red-500">*</span></label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Payment Date <span className="text-red-500">*</span></label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Payment Method <span className="text-red-500">*</span></label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value: CustomerPayment['paymentMethod']) => 
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
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="mobile-payment">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Reference Number</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Enter reference number"
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
            <Button type="submit">Add Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
