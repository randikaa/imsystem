'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BOM, BOMComponent } from '@/types/bom';
import { Product } from '@/types/product';
import { Plus, Trash2 } from 'lucide-react';

interface AddBOMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bom: Omit<BOM, 'id' | 'createdAt' | 'totalCost' | 'finalProductName' | 'finalProductSku'>) => void;
  editBOM?: BOM | null;
  products: Product[];
}

export function AddBOMDialog({ open, onOpenChange, onSave, editBOM, products }: AddBOMDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    description: string;
    finalProductId: string;
    estimatedTime: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    code: '',
    description: '',
    finalProductId: '',
    estimatedTime: '',
    status: 'active',
  });

  const [components, setComponents] = useState<Omit<BOMComponent, 'id'>[]>([]);

  useEffect(() => {
    if (editBOM) {
      setFormData({
        name: editBOM.name,
        code: editBOM.code,
        description: editBOM.description,
        finalProductId: editBOM.finalProductId,
        estimatedTime: editBOM.estimatedTime.toString(),
        status: editBOM.status,
      });
      setComponents(editBOM.components.map(({ id, ...rest }) => rest));
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        finalProductId: products[0]?.id || '',
        estimatedTime: '',
        status: 'active',
      });
      setComponents([]);
    }
  }, [editBOM, open, products]);

  const addComponent = () => {
    const product = products[0];
    if (!product) return;
    
    setComponents([...components, {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantityRequired: 1,
      availableStock: product.quantity,
      unitCost: product.cost,
      totalCost: product.cost,
    }]);
  };

  const updateComponent = (index: number, field: string, value: any) => {
    const newComponents = [...components];
    const comp = newComponents[index];
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        comp.productId = product.id;
        comp.productName = product.name;
        comp.productSku = product.sku;
        comp.availableStock = product.quantity;
        comp.unitCost = product.cost;
        comp.totalCost = product.cost * comp.quantityRequired;
      }
    } else if (field === 'quantityRequired') {
      comp.quantityRequired = parseInt(value) || 0;
      comp.totalCost = comp.unitCost * comp.quantityRequired;
    }
    
    setComponents(newComponents);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name: formData.name,
      code: formData.code,
      description: formData.description,
      finalProductId: formData.finalProductId,
      components: components.map((comp, idx) => ({ ...comp, id: idx.toString() })),
      estimatedTime: parseInt(formData.estimatedTime) || 0,
      status: formData.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editBOM ? 'Edit BOM' : 'Add New BOM'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">BOM Name <span className="text-red-500">*</span></label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter BOM name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">BOM Code <span className="text-red-500">*</span></label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., BOM-001"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Final Product <span className="text-red-500">*</span></label>
                <Select value={formData.finalProductId} onValueChange={(value) => setFormData({ ...formData, finalProductId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select final product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Estimated Time (minutes)</label>
                <Input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Components <span className="text-red-500">*</span></label>
                <Button type="button" size="sm" onClick={addComponent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Component
                </Button>
              </div>

              {components.length === 0 ? (
                <p className="text-sm text-gray-500">No components added yet</p>
              ) : (
                <div className="space-y-2">
                  {components.map((comp, index) => (
                    <div key={index} className="flex gap-2 rounded-lg border p-3">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Select value={comp.productId} onValueChange={(value) => updateComponent(index, 'productId', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={comp.quantityRequired}
                          onChange={(e) => updateComponent(index, 'quantityRequired', e.target.value)}
                          placeholder="Qty"
                        />
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600">Cost: Rs. {comp.totalCost.toLocaleString('en-LK')}</span>
                        </div>
                      </div>
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeComponent(index)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editBOM ? 'Update' : 'Add'} BOM</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
