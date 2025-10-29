'use client';

import { useState } from 'react';
import { BOM, ManufactureOrder } from '@/types/bom';
import { Product } from '@/types/product';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { BOMListTable } from '@/components/bom/bom-list-table';
import { ManufactureOrdersTable } from '@/components/bom/manufacture-orders-table';
import { AddBOMDialog } from '@/components/bom/add-bom-dialog';
import { AddManufactureDialog } from '@/components/bom/add-manufacture-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Package, Factory } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialProducts: Product[] = [
    { id: '1', name: 'Galaxy S24', sku: 'SAM-S24-001', brandId: '1', brandName: 'Samsung', categoryId: '1', categoryName: 'Electronics', description: '', price: 350000, cost: 280000, quantity: 25, minStock: 5, status: 'active', createdAt: new Date().toISOString() },
    { id: '2', name: 'Screen Protector', sku: 'ACC-SP-001', brandId: '2', brandName: 'Generic', categoryId: '2', categoryName: 'Accessories', description: '', price: 2000, cost: 1000, quantity: 100, minStock: 20, status: 'active', createdAt: new Date().toISOString() },
    { id: '3', name: 'Phone Case', sku: 'ACC-PC-001', brandId: '2', brandName: 'Generic', categoryId: '2', categoryName: 'Accessories', description: '', price: 3000, cost: 1500, quantity: 50, minStock: 10, status: 'active', createdAt: new Date().toISOString() },
    { id: '4', name: 'USB Cable', sku: 'ACC-USB-001', brandId: '2', brandName: 'Generic', categoryId: '2', categoryName: 'Accessories', description: '', price: 1500, cost: 800, quantity: 200, minStock: 30, status: 'active', createdAt: new Date().toISOString() },
    { id: '5', name: 'Galaxy S24 Bundle', sku: 'BUN-S24-001', brandId: '1', brandName: 'Samsung', categoryId: '1', categoryName: 'Electronics', description: 'Complete phone bundle', price: 360000, cost: 0, quantity: 0, minStock: 5, status: 'active', createdAt: new Date().toISOString() },
];

const initialBOMs: BOM[] = [
    {
        id: '1',
        name: 'Galaxy S24 Complete Bundle',
        code: 'BOM-S24-001',
        description: 'Phone with all accessories',
        finalProductId: '5',
        finalProductName: 'Galaxy S24 Bundle',
        finalProductSku: 'BUN-S24-001',
        components: [
            { id: '1', productId: '1', productName: 'Galaxy S24', productSku: 'SAM-S24-001', quantityRequired: 1, availableStock: 25, unitCost: 280000, totalCost: 280000 },
            { id: '2', productId: '2', productName: 'Screen Protector', productSku: 'ACC-SP-001', quantityRequired: 1, availableStock: 100, unitCost: 1000, totalCost: 1000 },
            { id: '3', productId: '3', productName: 'Phone Case', productSku: 'ACC-PC-001', quantityRequired: 1, availableStock: 50, unitCost: 1500, totalCost: 1500 },
            { id: '4', productId: '4', productName: 'USB Cable', productSku: 'ACC-USB-001', quantityRequired: 1, availableStock: 200, unitCost: 800, totalCost: 800 },
        ],
        totalCost: 283300,
        estimatedTime: 30,
        status: 'active',
        createdAt: new Date().toISOString(),
    },
];

const initialManufactureOrders: ManufactureOrder[] = [
    {
        id: '1',
        orderNumber: 'MFG-2025-001',
        bomId: '1',
        bomName: 'Galaxy S24 Complete Bundle',
        bomCode: 'BOM-S24-001',
        quantityToProduce: 5,
        status: 'completed',
        startDate: new Date().toISOString(),
        completedDate: new Date().toISOString(),
        producedBy: 'Metro Margo',
        notes: 'Initial production batch',
        componentsUsed: [
            { productId: '1', productName: 'Galaxy S24', quantityUsed: 5, unitCost: 280000 },
            { productId: '2', productName: 'Screen Protector', quantityUsed: 5, unitCost: 1000 },
            { productId: '3', productName: 'Phone Case', quantityUsed: 5, unitCost: 1500 },
            { productId: '4', productName: 'USB Cable', quantityUsed: 5, unitCost: 800 },
        ],
        totalCost: 1416500,
        createdAt: new Date().toISOString(),
    },
];

export default function BOMPage() {
    const [boms, setBoms] = useState<BOM[]>(initialBOMs);
    const [manufactureOrders, setManufactureOrders] = useState<ManufactureOrder[]>(initialManufactureOrders);
    const [products] = useState<Product[]>(initialProducts);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [bomDialogOpen, setBomDialogOpen] = useState(false);
    const [manufactureDialogOpen, setManufactureDialogOpen] = useState(false);
    const [editBOM, setEditBOM] = useState<BOM | null>(null);

    const filteredBOMs = boms.filter(bom => {
        const matchesSearch =
            bom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bom.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bom.finalProductName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || bom.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const filteredOrders = manufactureOrders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.bomName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleSaveBOM = (bomData: Omit<BOM, 'id' | 'createdAt' | 'totalCost' | 'finalProductName' | 'finalProductSku'>) => {
        const finalProduct = products.find(p => p.id === bomData.finalProductId);
        const totalCost = bomData.components.reduce((sum, comp) => sum + comp.totalCost, 0);

        if (editBOM) {
            setBoms(boms.map(bom =>
                bom.id === editBOM.id
                    ? {
                        ...bomData,
                        id: bom.id,
                        createdAt: bom.createdAt,
                        totalCost,
                        finalProductName: finalProduct?.name || '',
                        finalProductSku: finalProduct?.sku || '',
                    }
                    : bom
            ));
            setEditBOM(null);
        } else {
            const newBOM: BOM = {
                ...bomData,
                id: Date.now().toString(),
                totalCost,
                finalProductName: finalProduct?.name || '',
                finalProductSku: finalProduct?.sku || '',
                createdAt: new Date().toISOString(),
            };
            setBoms([...boms, newBOM]);
        }
        setBomDialogOpen(false);
    };

    const handleSaveManufacture = (orderData: Omit<ManufactureOrder, 'id' | 'createdAt' | 'orderNumber' | 'bomName' | 'bomCode' | 'componentsUsed' | 'totalCost'>) => {
        const bom = boms.find(b => b.id === orderData.bomId);
        if (!bom) return;

        const orderNumber = `MFG-${new Date().getFullYear()}-${String(manufactureOrders.length + 1).padStart(3, '0')}`;
        const componentsUsed = bom.components.map(comp => ({
            productId: comp.productId,
            productName: comp.productName,
            quantityUsed: comp.quantityRequired * orderData.quantityToProduce,
            unitCost: comp.unitCost,
        }));
        const totalCost = bom.totalCost * orderData.quantityToProduce;

        const newOrder: ManufactureOrder = {
            ...orderData,
            id: Date.now().toString(),
            orderNumber,
            bomName: bom.name,
            bomCode: bom.code,
            componentsUsed,
            totalCost,
            createdAt: new Date().toISOString(),
        };

        setManufactureOrders([newOrder, ...manufactureOrders]);
        setManufactureDialogOpen(false);
    };

    const handleUpdateOrderStatus = (id: string, status: ManufactureOrder['status']) => {
        setManufactureOrders(manufactureOrders.map(order =>
            order.id === id
                ? {
                    ...order,
                    status,
                    completedDate: status === 'completed' ? new Date().toISOString() : order.completedDate,
                }
                : order
        ));
    };

    const handleDeleteBOM = (id: string) => {
        setBoms(boms.filter(bom => bom.id !== id));
    };

    const handleDeleteOrder = (id: string) => {
        setManufactureOrders(manufactureOrders.filter(order => order.id !== id));
    };

    const pendingOrders = manufactureOrders.filter(o => o.status === 'pending').length;
    const inProgressOrders = manufactureOrders.filter(o => o.status === 'in-progress').length;
    const completedOrders = manufactureOrders.filter(o => o.status === 'completed').length;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />

                <div className="flex-1 overflow-auto bg-gray-50 p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Bill of Materials (BOM)</h1>
                                <p className="text-muted-foreground">Manage product structures and manufacturing</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setManufactureDialogOpen(true)}>
                                    <Factory className="mr-2 h-4 w-4" />
                                    New Manufacture Order
                                </Button>
                                <Button onClick={() => { setEditBOM(null); setBomDialogOpen(true); }}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add BOM
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Total BOMs</p>
                                <p className="text-2xl font-bold">{boms.length}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600">{inProgressOrders}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
                            </div>
                        </div>

                        <Tabs defaultValue="boms" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="boms">BOMs</TabsTrigger>
                                <TabsTrigger value="manufacture">Manufacture Orders</TabsTrigger>
                            </TabsList>

                            <TabsContent value="boms" className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name, code, or product..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <BOMListTable
                                    boms={filteredBOMs}
                                    onEdit={(bom: BOM) => { setEditBOM(bom); setBomDialogOpen(true); }}
                                    onDelete={handleDeleteBOM}
                                />
                            </TabsContent>

                            <TabsContent value="manufacture" className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by order #, BOM name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <ManufactureOrdersTable
                                    orders={filteredOrders}
                                    onUpdateStatus={handleUpdateOrderStatus}
                                    onDelete={handleDeleteOrder}
                                />
                            </TabsContent>
                        </Tabs>

                        <AddBOMDialog
                            open={bomDialogOpen}
                            onOpenChange={setBomDialogOpen}
                            onSave={handleSaveBOM}
                            editBOM={editBOM}
                            products={products}
                        />

                        <AddManufactureDialog
                            open={manufactureDialogOpen}
                            onOpenChange={setManufactureDialogOpen}
                            onSave={handleSaveManufacture}
                            boms={boms}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
