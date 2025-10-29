export interface BOM {
  id: string;
  name: string;
  code: string;
  description: string;
  finalProductId: string;
  finalProductName: string;
  finalProductSku: string;
  components: BOMComponent[];
  totalCost: number;
  estimatedTime: number; // in minutes
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BOMComponent {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantityRequired: number;
  availableStock: number;
  unitCost: number;
  totalCost: number;
}

export interface ManufactureOrder {
  id: string;
  orderNumber: string;
  bomId: string;
  bomName: string;
  bomCode: string;
  quantityToProduce: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  startDate: string;
  completedDate?: string;
  producedBy: string;
  notes: string;
  componentsUsed: ComponentUsage[];
  totalCost: number;
  createdAt: string;
}

export interface ComponentUsage {
  productId: string;
  productName: string;
  quantityUsed: number;
  unitCost: number;
}
