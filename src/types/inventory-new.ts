export interface StockItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

export interface StockAdjustment {
  id: string;
  stockItemId: string;
  productName: string;
  warehouseName: string;
  adjustmentType: 'add' | 'remove' | 'set';
  previousQuantity: number;
  adjustmentQuantity: number;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
  date: string;
  createdAt: string;
}

export interface BOMItem {
  id: string;
  name: string;
  code: string;
  description: string;
  components: BOMComponent[];
  totalCost: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BOMComponent {
  productId: string;
  productName: string;
  productSku: string;
  quantityRequired: number;
  availableStock: number;
  cost: number;
}
