export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  customerType: 'individual' | 'business';
  companyName?: string;
  taxId?: string;
  creditLimit: number;
  totalPurchases: number;
  totalPaid: number;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank-transfer' | 'cheque' | 'credit-card' | 'mobile-payment';
  reference: string;
  notes: string;
  date: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  customerName: string;
  type: 'sale' | 'payment' | 'credit' | 'debit';
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
  date: string;
  createdAt: string;
}
