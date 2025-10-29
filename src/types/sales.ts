export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  status: 'completed' | 'pending' | 'returned';
  notes: string;
  saleDate: string;
  createdBy: string;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SaleReturn {
  id: string;
  returnNumber: string;
  saleId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: ReturnItem[];
  totalAmount: number;
  refundMethod: 'cash' | 'bank-transfer' | 'credit-note';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  returnDate: string;
  processedBy: string;
  createdAt: string;
}

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  reason: string;
}
