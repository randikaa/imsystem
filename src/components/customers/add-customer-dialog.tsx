'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types/customer';

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'totalPaid' | 'balance'>) => void;
  editCustomer?: Customer | null;
}

export function AddCustomerDialog({ open, onOpenChange, onSave, editCustomer }: AddCustomerDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    customerType: 'individual' | 'business';
    companyName: string;
    taxId: string;
    creditLimit: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    customerType: 'individual',
    companyName: '',
    taxId: '',
    creditLimit: '',
    status: 'active',
  });

  useEffect(() => {
    if (editCustomer) {
      setFormData({
        name: editCustomer.name,
        email: editCustomer.email,
        phone: editCustomer.phone,
        address: editCustomer.address,
        city: editCustomer.city,
        country: editCustomer.country,
        customerType: editCustomer.customerType,
        companyName: editCustomer.companyName || '',
        taxId: editCustomer.taxId || '',
        creditLimit: editCustomer.creditLimit.toString(),
        status: editCustomer.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Sri Lanka',
        customerType: 'individual',
        companyName: '',
        taxId: '',
        creditLimit: '',
        status: 'active',
      });
    }
  }, [editCustomer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      customerType: formData.customerType,
      companyName: formData.customerType === 'business' ? formData.companyName : undefined,
      taxId: formData.customerType === 'business' ? formData.taxId : undefined,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      status: formData.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Customer Type</label>
              <Select value={formData.customerType} onValueChange={(value: any) => setFormData({ ...formData, customerType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.customerType === 'business' && (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter company name"
                    required={formData.customerType === 'business'}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tax ID</label>
                  <Input
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="Enter tax ID"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Contact Name <span className="text-red-500">*</span></label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Credit Limit (Rs.)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editCustomer ? 'Update' : 'Add'} Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
