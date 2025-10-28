export type UserRole = 'Admin' | 'User' | 'Manager' | 'Sales Rep' | 'Cashier';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}
