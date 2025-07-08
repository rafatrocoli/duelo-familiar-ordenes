
export type OrderType = 'clasico' | 'ecologico' | 'premium';
export type OrderStatus = 'pendiente' | 'completado';
export type OrderPhase = 'carpinteria' | 'pintura' | 'montaje' | 'completado';

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
  customerName: string;
  destination: string;
  products: Product[];
  orderDate: Date;
  isUrgent: boolean;
  status: OrderStatus;
  phase: OrderPhase;
}
