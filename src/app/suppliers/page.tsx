'use client';

import { useState } from 'react';
import { Supplier, SupplierPayment } from '@/types/supplier';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { SuppliersTable } from '@/components/suppliers/suppliers-table';
import { PaymentsTable } from '@/components/suppliers/payments-table';
import { AddSupplierDialog } from '@/components/suppliers/add-supplier-dialog';
import { AddPaymentDialog } from '@/components/suppliers/add-payment-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, DollarSign } from 'lucide-react';

const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Supplies Ltd',
    email: 'john@techsupplies.com',
    phone: '+94 77 123 4567',
    address: 'Colombo 03, Sri Lanka',
    status: 'active',
    totalPurchases: 500000,
    totalPaid: 300000,
    balance: 200000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Global Electronics',
    email: 'sarah@globalelec.com',
    phone: '+94 71 987 6543',
    address: 'Kandy, Sri Lanka',
    status: 'active',
    totalPurchases: 750000,
    totalPaid: 750000,
    balance: 0,
    createdAt: new Date().toISOString(),
  },
];

const initialPayments: SupplierPayment[] = [
  {
    id: '1',
    supplierId: '1',
    supplierName: 'Tech Supplies Ltd',
    amount: 150000,
    paymentMethod: 'bank-transfer',
    reference: 'TXN123456',
    notes: 'Payment for Invoice #001',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [payments, setPayments] = useState<SupplierPayment[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchases' | 'totalPaid' | 'balance'>) => {
    if (editSupplier) {
      setSuppliers(suppliers.map(supplier =>
        supplier.id === editSupplier.id
          ? { 
              ...supplierData, 
              id: supplier.id, 
              createdAt: supplier.createdAt,
              totalPurchases: supplier.totalPurchases,
              totalPaid: supplier.totalPaid,
              balance: supplier.balance
            }
          : supplier
      ));
      setEditSupplier(null);
    } else {
      const newSupplier: Supplier = {
        ...supplierData,
        id: Date.now().toString(),
        totalPurchases: 0,
        totalPaid: 0,
        balance: 0,
        createdAt: new Date().toISOString(),
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setSupplierDialogOpen(false);
  };

  const handleSavePayment = (paymentData: Omit<SupplierPayment, 'id' | 'createdAt'>) => {
    const newPayment: SupplierPayment = {
      ...paymentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPayments([newPayment, ...payments]);

    // Update supplier balance
    setSuppliers(suppliers.map(supplier =>
      supplier.id === paymentData.supplierId
        ? {
            ...supplier,
            totalPaid: supplier.totalPaid + paymentData.amount,
            balance: supplier.balance - paymentData.amount,
          }
        : supplier
    ));

    setPaymentDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditSupplier(supplier);
    setSupplierDialogOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  const handleAddPayment = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setPaymentDialogOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      // Revert supplier balance
      setSuppliers(suppliers.map(supplier =>
        supplier.id === payment.supplierId
          ? {
              ...supplier,
              totalPaid: supplier.totalPaid - payment.amount,
              balance: supplier.balance + payment.amount,
            }
          : supplier
      ));
    }
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const totalBalance = suppliers.reduce((sum, s) => sum + s.balance, 0);
  const totalPaid = suppliers.reduce((sum, s) => sum + s.totalPaid, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">     
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Suppliers Management</h1>
                <p className="text-muted-foreground">Manage suppliers and track payments</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (suppliers.length === 0) {
                      alert('Please add suppliers first');
                      return;
                    }
                    setSelectedSupplier(suppliers[0]);
                    setPaymentDialogOpen(true);
                  }}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
                <Button onClick={() => { setEditSupplier(null); setSupplierDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.filter(s => s.status === 'active').length}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {totalBalance.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {totalPaid.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">All Suppliers</h2>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by company, name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <SuppliersTable
                suppliers={filteredSuppliers}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
                onAddPayment={handleAddPayment}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Payments</h2>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (suppliers.length === 0) {
                      alert('Please add suppliers first');
                      return;
                    }
                    setSelectedSupplier(suppliers[0]);
                    setPaymentDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Quick Add Payment
                </Button>
              </div>
              <PaymentsTable
                payments={payments}
                onDelete={handleDeletePayment}
              />
            </div>

            <AddSupplierDialog
              open={supplierDialogOpen}
              onOpenChange={setSupplierDialogOpen}
              onSave={handleSaveSupplier}
              editSupplier={editSupplier}
            />

            <AddPaymentDialog
              open={paymentDialogOpen}
              onOpenChange={setPaymentDialogOpen}
              onSave={handleSavePayment}
              supplier={selectedSupplier}
              suppliers={suppliers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
