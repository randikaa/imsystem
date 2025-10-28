'use client';

import { useState } from 'react';
import { StockItem, StockAdjustment, BOMItem } from '@/types/inventory-new';
import { Product } from '@/types/product';
import { Warehouse } from '@/types/warehouse';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { StockItemsTable } from '@/components/inventory-new/stock-items-table';
import { StockAdjustmentsTable } from '@/components/inventory-new/stock-adjustments-table';
import { BOMTable } from '@/components/inventory-new/bom-table';
import { AdjustStockDialog } from '@/components/inventory-new/adjust-stock-dialog';
import { AddBOMDialog } from '@/components/inventory-new/add-bom-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', code: 'WH-001', location: 'Colombo', manager: 'John', phone: '123', capacity: 10000, status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Branch Warehouse', code: 'WH-002', location: 'Kandy', manager: 'Sarah', phone: '456', capacity: 5000, status: 'active', createdAt: new Date().toISOString() },
];

const initialProducts: Product[] = [
  { id: '1', name: 'Galaxy S24', sku: 'SAM-S24-001', brandId: '1', brandName: 'Samsung', categoryId: '1', categoryName: 'Electronics', description: '', price: 350000, cost: 280000, quantity: 25, minStock: 5, status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Screen Protector', sku: 'ACC-SP-001', brandId: '2', brandName: 'Generic', categoryId: '2', categoryName: 'Accessories', description: '', price: 2000, cost: 1000, quantity: 100, minStock: 20, status: 'active', createdAt: new Date().toISOString() },
  { id: '3', name: 'Phone Case', sku: 'ACC-PC-001', brandId: '2', brandName: 'Generic', categoryId: '2', categoryName: 'Accessories', description: '', price: 3000, cost: 1500, quantity: 50, minStock: 10, status: 'active', createdAt: new Date().toISOString() },
];

const initialStockItems: StockItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Galaxy S24',
    productSku: 'SAM-S24-001',
    warehouseId: '1',
    warehouseName: 'Main Warehouse',
    quantity: 25,
    minStock: 5,
    maxStock: 100,
    status: 'in-stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Screen Protector',
    productSku: 'ACC-SP-001',
    warehouseId: '1',
    warehouseName: 'Main Warehouse',
    quantity: 8,
    minStock: 20,
    maxStock: 200,
    status: 'low-stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    productId: '3',
    productName: 'Phone Case',
    productSku: 'ACC-PC-001',
    warehouseId: '2',
    warehouseName: 'Branch Warehouse',
    quantity: 0,
    minStock: 10,
    maxStock: 100,
    status: 'out-of-stock',
    lastUpdated: new Date().toISOString(),
  },
];

const initialAdjustments: StockAdjustment[] = [];

const initialBOMs: BOMItem[] = [
  {
    id: '1',
    name: 'Galaxy S24 Bundle',
    code: 'BOM-001',
    description: 'Phone with accessories',
    components: [
      { productId: '1', productName: 'Galaxy S24', productSku: 'SAM-S24-001', quantityRequired: 1, availableStock: 25, cost: 280000 },
      { productId: '2', productName: 'Screen Protector', productSku: 'ACC-SP-001', quantityRequired: 1, availableStock: 8, cost: 1000 },
      { productId: '3', productName: 'Phone Case', productSku: 'ACC-PC-001', quantityRequired: 1, availableStock: 0, cost: 1500 },
    ],
    totalCost: 282500,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export default function InventoryPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(initialAdjustments);
  const [boms, setBoms] = useState<BOMItem[]>(initialBOMs);
  const [products] = useState<Product[]>(initialProducts);
  const [warehouses] = useState<Warehouse[]>(initialWarehouses);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [bomDialogOpen, setBomDialogOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  const filteredStockItems = stockItems.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.warehouseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWarehouse = filterWarehouse === 'all' || item.warehouseId === filterWarehouse;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const handleAdjustStock = (adjustmentData: Omit<StockAdjustment, 'id' | 'createdAt' | 'productName' | 'warehouseName'>) => {
    const stockItem = stockItems.find(item => item.id === adjustmentData.stockItemId);
    if (!stockItem) return;

    let newQuantity = stockItem.quantity;
    if (adjustmentData.adjustmentType === 'add') {
      newQuantity += adjustmentData.adjustmentQuantity;
    } else if (adjustmentData.adjustmentType === 'remove') {
      newQuantity = Math.max(0, stockItem.quantity - adjustmentData.adjustmentQuantity);
    } else {
      newQuantity = adjustmentData.adjustmentQuantity;
    }

    const newAdjustment: StockAdjustment = {
      ...adjustmentData,
      id: Date.now().toString(),
      productName: stockItem.productName,
      warehouseName: stockItem.warehouseName,
      newQuantity,
      createdAt: new Date().toISOString(),
    };

    setAdjustments([newAdjustment, ...adjustments]);

    setStockItems(stockItems.map(item =>
      item.id === adjustmentData.stockItemId
        ? {
            ...item,
            quantity: newQuantity,
            status: newQuantity === 0 ? 'out-of-stock' : newQuantity <= item.minStock ? 'low-stock' : 'in-stock',
            lastUpdated: new Date().toISOString(),
          }
        : item
    ));

    setAdjustDialogOpen(false);
    setSelectedStockItem(null);
  };

  const handleSaveBOM = (bomData: Omit<BOMItem, 'id' | 'createdAt' | 'totalCost'>) => {
    const totalCost = bomData.components.reduce((sum, comp) => sum + (comp.cost * comp.quantityRequired), 0);
    
    const newBOM: BOMItem = {
      ...bomData,
      id: Date.now().toString(),
      totalCost,
      createdAt: new Date().toISOString(),
    };
    
    setBoms([...boms, newBOM]);
    setBomDialogOpen(false);
  };

  const lowStockCount = stockItems.filter(item => item.status === 'low-stock').length;
  const outOfStockCount = stockItems.filter(item => item.status === 'out-of-stock').length;
  const totalValue = stockItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (item.quantity * (product?.cost || 0));
  }, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">         
   <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                <p className="text-muted-foreground">Track stock, adjust quantities, and manage BOMs</p>
              </div>
              <Button onClick={() => setBomDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add BOM
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Stock Items</p>
                <p className="text-2xl font-bold">{stockItems.length}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {totalValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm text-gray-600">Low Stock</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-gray-600">Out of Stock</p>
                </div>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
            </div>

            <Tabs defaultValue="stock" className="space-y-4">
              <TabsList>
                <TabsTrigger value="stock">Stock Items</TabsTrigger>
                <TabsTrigger value="bom">BOM</TabsTrigger>
                <TabsTrigger value="adjustments">Adjustments History</TabsTrigger>
              </TabsList>

              <TabsContent value="stock" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by product, SKU, or warehouse..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <StockItemsTable
                  items={filteredStockItems}
                  onAdjust={(item) => { setSelectedStockItem(item); setAdjustDialogOpen(true); }}
                />
              </TabsContent>

              <TabsContent value="bom">
                <BOMTable boms={boms} />
              </TabsContent>

              <TabsContent value="adjustments">
                <StockAdjustmentsTable adjustments={adjustments} />
              </TabsContent>
            </Tabs>

            <AdjustStockDialog
              open={adjustDialogOpen}
              onOpenChange={setAdjustDialogOpen}
              onSave={handleAdjustStock}
              stockItem={selectedStockItem}
            />

            <AddBOMDialog
              open={bomDialogOpen}
              onOpenChange={setBomDialogOpen}
              onSave={handleSaveBOM}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
