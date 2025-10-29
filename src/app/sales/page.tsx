'use client';

import { useState } from 'react';
import { Sale, SaleReturn } from '@/types/sales';
import { Product } from '@/types/product';
import { Customer } from '@/types/customer';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { SalesTable } from '@/components/sales/sales-table';
import { ReturnsTable } from '@/components/sales/returns-table';
import { AddSaleDialog } from '@/components/sales/add-sale-dialog';
import { AddReturnDialog } from '@/components/sales/add-return-dialog';
import { InvoiceDialog } from '@/components/sales/invoice-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, FileText, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialProducts: Product[] = [
  { id: '1', name: 'Galaxy S24', sku: 'SAM-S24-001', brandId: '1', brandName: 'Samsung', categoryId: '1', categoryName: 'Electronics', description: '', price: 350000, cost: 280000, quantity: 25, minStock: 5, status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Screen Protector', sku: 'ACC-SP-001', brandId: '2', brandName: 'Generic', categoryId: '2', categoryName: 'Accessories', description: '', price: 2000, cost: 1000, quantity: 100, minStock: 20, status: 'active', createdAt: new Date().toISOString() },
];

const initialCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+94 77 123 4567', address: '123 Main St', city: 'Colombo', country: 'Sri Lanka', customerType: 'individual', creditLimit: 500000, totalPurchases: 750000, totalPaid: 500000, balance: 250000, status: 'active', createdAt: new Date().toISOString() },
];

const initialSales: Sale[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    customerId: '1',
    customerName: 'John Doe',
    items: [
      { id: '1', productId: '1', productName: 'Galaxy S24', productSku: 'SAM-S24-001', quantity: 2, unitPrice: 350000, total: 700000 },
      { id: '2', productId: '2', productName: 'Screen Protector', productSku: 'ACC-SP-001', quantity: 2, unitPrice: 2000, total: 4000 },
    ],
    subtotal: 704000,
    tax: 105600,
    discount: 0,
    total: 809600,
    amountPaid: 500000,
    balance: 309600,
    paymentStatus: 'partial',
    status: 'completed',
    notes: 'First sale',
    saleDate: new Date().toISOString(),
    createdBy: 'Metro Margo',
    createdAt: new Date().toISOString(),
  },
];

const initialReturns: SaleReturn[] = [];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [returns, setReturns] = useState<SaleReturn[]>(initialReturns);
  const [products] = useState<Product[]>(initialProducts);
  const [customers] = useState<Customer[]>(initialCustomers);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = 
      ret.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ret.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveSale = (saleData: Omit<Sale, 'id' | 'createdAt' | 'invoiceNumber' | 'customerName'>) => {
    const customer = customers.find(c => c.id === saleData.customerId);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`;
    
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      invoiceNumber,
      customerName: customer?.name || '',
      createdAt: new Date().toISOString(),
    };
    
    setSales([newSale, ...sales]);
    setSaleDialogOpen(false);
  };

  const handleSaveReturn = (returnData: Omit<SaleReturn, 'id' | 'createdAt' | 'returnNumber' | 'invoiceNumber' | 'customerName'>) => {
    const sale = sales.find(s => s.id === returnData.saleId);
    if (!sale) return;

    const returnNumber = `RET-${new Date().getFullYear()}-${String(returns.length + 1).padStart(3, '0')}`;
    
    const newReturn: SaleReturn = {
      ...returnData,
      id: Date.now().toString(),
      returnNumber,
      invoiceNumber: sale.invoiceNumber,
      customerName: sale.customerName,
      createdAt: new Date().toISOString(),
    };
    
    setReturns([newReturn, ...returns]);
    
    // Update sale status
    if (newReturn.status === 'approved') {
      setSales(sales.map(s =>
        s.id === returnData.saleId ? { ...s, status: 'returned' as const } : s
      ));
    }
    
    setReturnDialogOpen(false);
  };

  const handleUpdateReturnStatus = (id: string, status: SaleReturn['status']) => {
    setReturns(returns.map(ret =>
      ret.id === id ? { ...ret, status } : ret
    ));
    
    if (status === 'approved') {
      const returnItem = returns.find(r => r.id === id);
      if (returnItem) {
        setSales(sales.map(s =>
          s.id === returnItem.saleId ? { ...s, status: 'returned' as const } : s
        ));
      }
    }
  };

  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
  };

  const handleDeleteReturn = (id: string) => {
    setReturns(returns.filter(r => r.id !== id));
  };

  const handleViewInvoice = (sale: Sale) => {
    setSelectedSale(sale);
    setInvoiceDialogOpen(true);
  };

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalPaid = sales.reduce((sum, s) => sum + s.amountPaid, 0);
  const totalBalance = sales.reduce((sum, s) => sum + s.balance, 0);
  const pendingReturns = returns.filter(r => r.status === 'pending').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">     
       <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
                <p className="text-muted-foreground">Manage sales, invoices, and returns</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setReturnDialogOpen(true)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Process Return
                </Button>
                <Button onClick={() => setSaleDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Sale
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rs. {totalSales.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {totalPaid.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {totalBalance.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Pending Returns</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReturns}</p>
              </div>
            </div>

            <Tabs defaultValue="sales" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by invoice #, customer..."
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <SalesTable
                  sales={filteredSales}
                  onViewInvoice={handleViewInvoice}
                  onDelete={handleDeleteSale}
                />
              </TabsContent>

              <TabsContent value="returns" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by return #, invoice #, customer..."
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
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ReturnsTable
                  returns={filteredReturns}
                  onUpdateStatus={handleUpdateReturnStatus}
                  onDelete={handleDeleteReturn}
                />
              </TabsContent>
            </Tabs>

            <AddSaleDialog
              open={saleDialogOpen}
              onOpenChange={setSaleDialogOpen}
              onSave={handleSaveSale}
              products={products}
              customers={customers}
            />

            <AddReturnDialog
              open={returnDialogOpen}
              onOpenChange={setReturnDialogOpen}
              onSave={handleSaveReturn}
              sales={sales}
            />

            <InvoiceDialog
              open={invoiceDialogOpen}
              onOpenChange={setInvoiceDialogOpen}
              sale={selectedSale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
