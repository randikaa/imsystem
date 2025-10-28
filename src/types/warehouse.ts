export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  phone: string;
  capacity: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  productId: string;
  productName: string;
  productSku: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  quantity: number;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  notes: string;
  requestedBy: string;
  transferDate: string;
  completedDate?: string;
  createdAt: string;
}

export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
}
