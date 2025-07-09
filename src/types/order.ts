
export type OrderType = 'redonda' | 'egipcia' | 'semiredonda';
export type OrderStatus = 'pendiente' | 'completado';
export type OrderPhase = 'montaje' | 'carpinteria' | 'pintura' | 'completado';

export interface Product {
  model: string;
  quantity: number;
  usageType: 'encinerar' | 'entierro';
  color: string;
  coffeeType: OrderType;
  comments: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  destination: string;
  products: Product[];
  orderDate: Date;
  isUrgent: boolean;
  status: OrderStatus;
  phase: OrderPhase;
  completedPhases: OrderPhase[];
}
