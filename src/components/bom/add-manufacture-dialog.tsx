'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManufactureOrder } from '@/types/bom';
import { BOM } from '@/types/bom';

interface AddManufactureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (order: Omit<ManufactureOrder, 'id' | 'createdAt' | 'orderNumber' | 'bomName' | 'bomCode' | 'componentsUsed' | 'totalCost'>) => void;
  boms: BOM[];
}

export function AddManufactureDialog({ open, onOpenChange, onSave, boms }: AddManufactureDialogProps) {
  const [formData, setFormData] = useState({
    bomId: '',
    quantityToProduce: '',
    status: 'pending' as ManufactureOrder['status'],
    startDate: new Date().toISOString().split('T')[0],
    producedBy: '',
    notes: '',
  });

  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);

  useEffect(() => {
    if (open) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      setFormData({
        bomId: boms[0]?.id || '',
        quantityToProduce: '',
        status: 'pending',
        startDate: new Date().toISOString().split('T')[0],
        producedBy: user?.name || '',
        notes: '',
      });
      setSelectedBOM(boms[0] || null);
    }
  }, [open, boms]);

  useEffect(() => {
    const bom = boms.find(b => b.id === formData.bomId);
    setSelectedBOM(bom || null);
  }, [formData.bomId, boms]);

  const canProduce = selectedBOM && formData.quantityToProduce
    ? selectedBOM.components.every(comp => 
        comp.availableStock >= comp.quantityRequired * parseInt(formData.quantityToProduce)
      )
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      bomId: formData.bomId,
      quantityToProduce: parseInt(formData.quantityToProduce),
      status: formData.status,
      startDate: formData.startDate,
      producedBy: formData.producedBy,
      notes: formData.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Manufacture Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select BOM <span className="text-red-500">*</span></label>
              <Select value={formData.bomId} onValueChange={(value) => setFormData({ ...formData, bomId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select BOM" />
                </SelectTrigger>
                <SelectContent>
                  {boms.filter(b => b.status === 'active').map((bom) => (
                    <SelectItem key={bom.id} value={bom.id}>
                      {bom.name} ({bom.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBOM && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold">BOM Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Final Product:</span> {selectedBOM.finalProductName}</p>
                  <p><span className="text-gray-600">Cost per unit:</span> Rs. {selectedBOM.totalCost.toLocaleString('en-LK')}</p>
                  <p><span className="text-gray-600">Components:</span> {selectedBOM.components.length}</p>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium">Quantity to Produce <span className="text-red-500">*</span></label>
              <Input
                type="number"
                value={formData.quantityToProduce}
                onChange={(e) => setFormData({ ...formData, quantityToProduce: e.target.value })}
                placeholder="Enter quantity"
                required
              />
              {formData.quantityToProduce && selectedBOM && (
                <p className="text-sm">
                  Total Cost: <span className="font-bold">Rs. {(selectedBOM.totalCost * parseInt(formData.quantityToProduce)).toLocaleString('en-LK')}</span>
                </p>
              )}
              {formData.quantityToProduce && !canProduce && (
                <p className="text-sm text-red-600">⚠️ Insufficient stock for this quantity</p>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Produced By <span className="text-red-500">*</span></label>
              <Input
                value={formData.producedBy}
                onChange={(e) => setFormData({ ...formData, producedBy: e.target.value })}
                placeholder="Enter name"
                required
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
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
