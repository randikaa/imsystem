'use client';

import { useState } from 'react';
import { Warehouse, Transfer } from '@/types/warehouse';
import { Product } from '@/types/product';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { WarehousesTable } from '@/components/tog/warehouses-table';
import { TransfersTable } from '@/components/tog/transfers-table';
import { AddWarehouseDialog } from '@/components/tog/add-warehouse-dialog';
import { AddTransferDialog } from '@/components/tog/add-transfer-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Warehouse as WarehouseIcon, ArrowRightLeft } from 'lucide-react';

const initialWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Main Warehouse',
    code: 'WH-001',
    location: 'Colombo 03, Sri Lanka',
    manager: 'John Silva',
    phone: '+94 77 123 4567',
    capacity: 10000,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Branch Warehouse',
    code: 'WH-002',
    location: 'Kandy, Sri Lanka',
    manager: 'Sarah Fernando',
    phone: '+94 71 987 6543',
    capacity: 5000,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Galaxy S24',
    sku: 'SAM-S24-001',
    brandId: '1',
    brandName: 'Samsung',
    categoryId: '1',
    categoryName: 'Electronics',
    description: 'Latest Samsung flagship phone',
    price: 350000,
    cost: 280000,
    quantity: 25,
    minStock: 5,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

const initialTransfers: Transfer[] = [
  {
    id: '1',
    transferNumber: 'TRF-2025-001',
    productId: '1',
    productName: 'Galaxy S24',
    productSku: 'SAM-S24-001',
    fromWarehouseId: '1',
    fromWarehouseName: 'Main Warehouse',
    toWarehouseId: '2',
    toWarehouseName: 'Branch Warehouse',
    quantity: 10,
    status: 'completed',
    notes: 'Regular stock transfer',
    requestedBy: 'Metro Margo',
    transferDate: new Date().toISOString(),
    completedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export default function TOGPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);
  const [products] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  
  const [editWarehouse, setEditWarehouse] = useState<Warehouse | null>(null);

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromWarehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toWarehouseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveWarehouse = (warehouseData: Omit<Warehouse, 'id' | 'createdAt'>) => {
    if (editWarehouse) {
      setWarehouses(warehouses.map(warehouse =>
        warehouse.id === editWarehouse.id
          ? { ...warehouseData, id: warehouse.id, createdAt: warehouse.createdAt }
          : warehouse
      ));
      setEditWarehouse(null);
    } else {
      const newWarehouse: Warehouse = {
        ...warehouseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setWarehouses([...warehouses, newWarehouse]);
    }
    setWarehouseDialogOpen(false);
  };

  const handleSaveTransfer = (transferData: Omit<Transfer, 'id' | 'createdAt' | 'transferNumber' | 'productName' | 'productSku' | 'fromWarehouseName' | 'toWarehouseName'>) => {
    const product = products.find(p => p.id === transferData.productId);
    const fromWarehouse = warehouses.find(w => w.id === transferData.fromWarehouseId);
    const toWarehouse = warehouses.find(w => w.id === transferData.toWarehouseId);
    
    const transferNumber = `TRF-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(3, '0')}`;
    
    const newTransfer: Transfer = {
      ...transferData,
      id: Date.now().toString(),
      transferNumber,
      productName: product?.name || '',
      productSku: product?.sku || '',
      fromWarehouseName: fromWarehouse?.name || '',
      toWarehouseName: toWarehouse?.name || '',
      createdAt: new Date().toISOString(),
    };
    
    setTransfers([newTransfer, ...transfers]);
    setTransferDialogOpen(false);
  };

  const handleUpdateTransferStatus = (id: string, status: Transfer['status']) => {
    setTransfers(transfers.map(transfer =>
      transfer.id === id
        ? { 
            ...transfer, 
            status,
            completedDate: status === 'completed' ? new Date().toISOString() : transfer.completedDate
          }
        : transfer
    ));
  };

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter(w => w.id !== id));
  };

  const handleDeleteTransfer = (id: string) => {
    setTransfers(transfers.filter(t => t.id !== id));
  };

  const pendingCount = transfers.filter(t => t.status === 'pending').length;
  const inTransitCount = transfers.filter(t => t.status === 'in-transit').length;
  const completedCount = transfers.filter(t => t.status === 'completed').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">     
       <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Transfer of Goods (TOG)</h1>
                <p className="text-muted-foreground">Manage warehouses and product transfers</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setEditWarehouse(null); setWarehouseDialogOpen(true); }}>
                  <WarehouseIcon className="mr-2 h-4 w-4" />
                  Add Warehouse
                </Button>
                <Button onClick={() => setTransferDialogOpen(true)}>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Create Transfer
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Warehouses</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Pending Transfers</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{inTransitCount}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Warehouses</h2>
              <WarehousesTable
                warehouses={warehouses}
                onEdit={(warehouse) => { setEditWarehouse(warehouse); setWarehouseDialogOpen(true); }}
                onDelete={handleDeleteWarehouse}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Transfer Orders</h2>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by transfer #, product, or warehouse..."
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
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TransfersTable
                transfers={filteredTransfers}
                onUpdateStatus={handleUpdateTransferStatus}
                onDelete={handleDeleteTransfer}
              />
            </div>

            <AddWarehouseDialog
              open={warehouseDialogOpen}
              onOpenChange={setWarehouseDialogOpen}
              onSave={handleSaveWarehouse}
              editWarehouse={editWarehouse}
            />

            <AddTransferDialog
              open={transferDialogOpen}
              onOpenChange={setTransferDialogOpen}
              onSave={handleSaveTransfer}
              products={products}
              warehouses={warehouses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
