'use client';

import { useState } from 'react';
import { Customer, CustomerPayment, LedgerEntry } from '@/types/customer';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { CustomersTable } from '@/components/customers/customers-table';
import { PaymentsTable } from '@/components/customers/payments-table';
import { LedgerTable } from '@/components/customers/ledger-table';
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog';
import { AddPaymentDialog } from '@/components/customers/add-payment-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, DollarSign, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+94 77 123 4567',
    address: '123 Main Street',
    city: 'Colombo',
    country: 'Sri Lanka',
    customerType: 'individual',
    creditLimit: 500000,
    totalPurchases: 750000,
    totalPaid: 500000,
    balance: 250000,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@techcorp.com',
    phone: '+94 71 987 6543',
    address: '456 Business Ave',
    city: 'Kandy',
    country: 'Sri Lanka',
    customerType: 'business',
    companyName: 'Tech Corp Ltd',
    taxId: 'TAX123456',
    creditLimit: 1000000,
    totalPurchases: 1200000,
    totalPaid: 1200000,
    balance: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

const initialPayments: CustomerPayment[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    amount: 250000,
    paymentMethod: 'bank-transfer',
    reference: 'TXN-001',
    notes: 'Payment for Invoice #001',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const initialLedger: LedgerEntry[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    type: 'sale',
    description: 'Invoice #001 - Galaxy S24 Bundle',
    debit: 750000,
    credit: 0,
    balance: 750000,
    reference: 'INV-001',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'John Doe',
    type: 'payment',
    description: 'Payment received',
    debit: 0,
    credit: 250000,
    balance: 500000,
    reference: 'TXN-001',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerId: '1',
    customerName: 'John Doe',
    type: 'payment',
    description: 'Payment received',
    debit: 0,
    credit: 250000,
    balance: 250000,
    reference: 'TXN-002',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [payments, setPayments] = useState<CustomerPayment[]>(initialPayments);
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesType = filterType === 'all' || customer.customerType === filterType;
    
    return matchesSearch && matchesType;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesCustomer = selectedCustomer === 'all' || payment.customerId === selectedCustomer;
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCustomer && matchesSearch;
  });

  const filteredLedger = ledger.filter(entry => {
    const matchesCustomer = selectedCustomer === 'all' || entry.customerId === selectedCustomer;
    const matchesSearch = 
      entry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCustomer && matchesSearch;
  });

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'totalPaid' | 'balance'>) => {
    if (editCustomer) {
      setCustomers(customers.map(customer =>
        customer.id === editCustomer.id
          ? {
              ...customerData,
              id: customer.id,
              createdAt: customer.createdAt,
              totalPurchases: customer.totalPurchases,
              totalPaid: customer.totalPaid,
              balance: customer.balance,
            }
          : customer
      ));
      setEditCustomer(null);
    } else {
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        totalPurchases: 0,
        totalPaid: 0,
        balance: 0,
        createdAt: new Date().toISOString(),
      };
      setCustomers([...customers, newCustomer]);
    }
    setCustomerDialogOpen(false);
  };

  const handleSavePayment = (paymentData: Omit<CustomerPayment, 'id' | 'createdAt' | 'customerName'>) => {
    const customer = customers.find(c => c.id === paymentData.customerId);
    if (!customer) return;

    const newPayment: CustomerPayment = {
      ...paymentData,
      id: Date.now().toString(),
      customerName: customer.name,
      createdAt: new Date().toISOString(),
    };

    setPayments([newPayment, ...payments]);

    // Update customer balance
    setCustomers(customers.map(c =>
      c.id === paymentData.customerId
        ? {
            ...c,
            totalPaid: c.totalPaid + paymentData.amount,
            balance: c.balance - paymentData.amount,
          }
        : c
    ));

    // Add ledger entry
    const newLedgerEntry: LedgerEntry = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      type: 'payment',
      description: 'Payment received',
      debit: 0,
      credit: paymentData.amount,
      balance: customer.balance - paymentData.amount,
      reference: paymentData.reference,
      date: paymentData.date,
      createdAt: new Date().toISOString(),
    };

    setLedger([newLedgerEntry, ...ledger]);
    setPaymentDialogOpen(false);
    setPaymentCustomer(null);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const handleDeletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      // Revert customer balance
      setCustomers(customers.map(c =>
        c.id === payment.customerId
          ? {
              ...c,
              totalPaid: c.totalPaid - payment.amount,
              balance: c.balance + payment.amount,
            }
          : c
      ));
    }
    setPayments(payments.filter(p => p.id !== id));
  };

  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
  const totalPaid = customers.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">    
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Customers Management</h1>
                <p className="text-muted-foreground">Manage customers, payments, and ledger</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPaymentDialogOpen(true)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
                <Button onClick={() => { setEditCustomer(null); setCustomerDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rs. {totalPurchases.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {totalPaid.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {totalBalance.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <Tabs defaultValue="customers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="ledger">Ledger History</TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, phone, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <CustomersTable
                  customers={filteredCustomers}
                  onEdit={(customer: Customer) => { setEditCustomer(customer); setCustomerDialogOpen(true); }}
                  onDelete={handleDeleteCustomer}
                  onAddPayment={(customer: Customer) => { setPaymentCustomer(customer); setPaymentDialogOpen(true); }}
                />
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer or reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <PaymentsTable
                  payments={filteredPayments}
                  onDelete={handleDeletePayment}
                />
              </TabsContent>

              <TabsContent value="ledger" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer, description, or reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <LedgerTable ledger={filteredLedger} />
              </TabsContent>
            </Tabs>

            <AddCustomerDialog
              open={customerDialogOpen}
              onOpenChange={setCustomerDialogOpen}
              onSave={handleSaveCustomer}
              editCustomer={editCustomer}
            />

            <AddPaymentDialog
              open={paymentDialogOpen}
              onOpenChange={setPaymentDialogOpen}
              onSave={handleSavePayment}
              customer={paymentCustomer}
              customers={customers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
