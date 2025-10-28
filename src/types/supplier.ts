export interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  totalPurchases: number;
  totalPaid: number;
  balance: number;
  createdAt: string;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank-transfer' | 'cheque' | 'credit';
  reference: string;
  notes: string;
  date: string;
  createdAt: string;
}
