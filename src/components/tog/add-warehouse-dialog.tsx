'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Warehouse } from '@/types/warehouse';

interface AddWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (warehouse: Omit<Warehouse, 'id' | 'createdAt'>) => void;
  editWarehouse?: Warehouse | null;
}

export function AddWarehouseDialog({ open, onOpenChange, onSave, editWarehouse }: AddWarehouseDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    location: string;
    manager: string;
    phone: string;
    capacity: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    code: '',
    location: '',
    manager: '',
    phone: '',
    capacity: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editWarehouse) {
      setFormData({
        name: editWarehouse.name,
        code: editWarehouse.code,
        location: editWarehouse.location,
        manager: editWarehouse.manager,
        phone: editWarehouse.phone,
        capacity: editWarehouse.capacity.toString(),
        status: editWarehouse.status,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        location: '',
        manager: '',
        phone: '',
        capacity: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [editWarehouse, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Warehouse name is required';
    if (!formData.code.trim()) newErrors.code = 'Warehouse code is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.manager.trim()) newErrors.manager = 'Manager name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = 'Valid capacity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSave({
      name: formData.name,
      code: formData.code,
      location: formData.location,
      manager: formData.manager,
      phone: formData.phone,
      capacity: parseInt(formData.capacity),
      status: formData.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Warehouse Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter warehouse name"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Warehouse Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., WH-001"
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
              />
              {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Manager <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="Enter manager name"
              />
              {errors.manager && <p className="text-xs text-red-500">{errors.manager}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Capacity (units) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Enter capacity"
              />
              {errors.capacity && <p className="text-xs text-red-500">{errors.capacity}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editWarehouse ? 'Update' : 'Add'} Warehouse</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
