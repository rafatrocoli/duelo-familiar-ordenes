
export type OrderType = 'clasico' | 'ecologico' | 'premium';
export type OrderStatus = 'pendiente' | 'completado';
export type OrderPhase = 'carpinteria' | 'pintura' | 'montaje' | 'completado';

export interface Order {
  id: string;
  customerName: string;
  destination: string;
  model: string;
  quantity: number;
  usageType: 'encinerar' | 'entierro';
  color: string;
  orderDate: Date;
  coffeeType: OrderType;
  isUrgent: boolean;
  comments: string;
  status: OrderStatus;
  phase: OrderPhase;
}
