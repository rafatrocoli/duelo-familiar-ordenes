
export type OrderType = 'clasico' | 'ecologico' | 'premium';
export type OrderStatus = 'pendiente' | 'completado';

export interface Order {
  id: string;
  customerName: string;
  orderDate: Date;
  coffeeType: OrderType;
  isUrgent: boolean;
  comments: string;
  status: OrderStatus;
}
