'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Brand, Category } from '@/types/product';

interface AddProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (product: Omit<Product, 'id' | 'createdAt' | 'brandName' | 'categoryName'>) => void;
    editProduct?: Product | null;
    brands: Brand[];
    categories: Category[];
}

export function AddProductDialog({ open, onOpenChange, onSave, editProduct, brands, categories }: AddProductDialogProps) {
    const [formData, setFormData] = useState<{
        name: string;
        sku: string;
        brandId: string;
        categoryId: string;
        description: string;
        price: string;
        cost: string;
        quantity: string;
        minStock: string;
        status: 'active' | 'inactive';
    }>({
        name: '',
        sku: '',
        brandId: '',
        categoryId: '',
        description: '',
        price: '',
        cost: '',
        quantity: '',
        minStock: '',
        status: 'active',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                sku: editProduct.sku,
                brandId: editProduct.brandId,
                categoryId: editProduct.categoryId,
                description: editProduct.description,
                price: editProduct.price.toString(),
                cost: editProduct.cost.toString(),
                quantity: editProduct.quantity.toString(),
                minStock: editProduct.minStock.toString(),
                status: editProduct.status,
            });
        } else {
            setFormData({
                name: '',
                sku: '',
                brandId: brands[0]?.id || '',
                categoryId: categories[0]?.id || '',
                description: '',
                price: '',
                cost: '',
                quantity: '',
                minStock: '',
                status: 'active',
            });
        }
        setErrors({});
    }, [editProduct, open, brands, categories]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.brandId) newErrors.brandId = 'Brand is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
        if (!formData.cost || parseFloat(formData.cost) <= 0) newErrors.cost = 'Valid cost is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSave({
            name: formData.name,
            sku: formData.sku,
            brandId: formData.brandId,
            categoryId: formData.categoryId,
            description: formData.description,
            price: parseFloat(formData.price),
            cost: parseFloat(formData.cost),
            quantity: parseInt(formData.quantity) || 0,
            minStock: parseInt(formData.minStock) || 0,
            status: formData.status,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter product name"
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    SKU <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    placeholder="Enter SKU"
                                />
                                {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Brand <span className="text-red-500">*</span>
                                </label>
                                <Select value={formData.brandId} onValueChange={(value) => setFormData({ ...formData, brandId: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.filter(b => b.status === 'active').map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.brandId && <p className="text-xs text-red-500">{errors.brandId}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter(c => c.status === 'active').map((category) => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
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
                                <label className="text-sm font-medium">
                                    Cost Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="0.00"
                                />
                                {errors.cost && <p className="text-xs text-red-500">{errors.cost}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Selling Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Initial Quantity</label>
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Minimum Stock Level</label>
                                <Input
                                    type="number"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editProduct ? 'Update' : 'Add'} Product</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
