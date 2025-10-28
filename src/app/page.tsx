'use client';

import { useState } from 'react';
import { InventoryItem } from '@/types/inventory';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { AddItemDialog } from '@/components/inventory/add-item-dialog';
import { InventoryStats } from '@/components/inventory/inventory-stats';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { KeyMetrics } from '@/components/dashboard/key-metrics';
import { ProductionAnalysis } from '@/components/dashboard/production-analysis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

// Sample data
const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop',
    sku: 'LAP-001',
    category: 'Electronics',
    quantity: 45,
    price: 299999.00,
    status: 'in-stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'MOU-002',
    category: 'Accessories',
    quantity: 8,
    price: 8999.00,
    status: 'low-stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'USB-C Cable',
    sku: 'CAB-003',
    category: 'Accessories',
    quantity: 0,
    price: 4799.00,
    status: 'out-of-stock',
    lastUpdated: new Date().toISOString(),
  },
];

export default function Home() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (editItem) {
      setItems(items.map(item =>
        item.id === editItem.id
          ? { ...itemData, id: item.id, lastUpdated: new Date().toISOString() }
          : item
      ));
      setEditItem(null);
    } else {
      const newItem: InventoryItem = {
        ...itemData,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString(),
      };
      setItems([...items, newItem]);
    }
    setDialogOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Metro Margo</p>
              </div>
            </div>

            <KeyMetrics />

            <ProductionAnalysis />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Inventory</h2>
                <Button onClick={() => { setEditItem(null); setDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <InventoryTable
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <AddItemDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSave={handleSave}
              editItem={editItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
