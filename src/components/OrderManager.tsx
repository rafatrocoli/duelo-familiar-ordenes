
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OrderForm from './OrderForm';
import OrderCard from './OrderCard';
import { Order, OrderStatus } from '@/types/order';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos');
  const [showForm, setShowForm] = useState(false);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('coffin-orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate)
      }));
      setOrders(parsedOrders);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('coffin-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date(),
      status: 'pendiente'
    };

    setOrders(prev => [newOrder, ...prev]);
    setShowForm(false);
  };

  const toggleOrderStatus = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id 
        ? { ...order, status: order.status === 'pendiente' ? 'completado' : 'pendiente' }
        : order
    ));
  };

  const sortOrders = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
      // First by status (pending first)
      if (a.status !== b.status) {
        return a.status === 'pendiente' ? -1 : 1;
      }
      
      // Then by urgency (urgent first, only for pending orders)
      if (a.status === 'pendiente' && a.isUrgent !== b.isUrgent) {
        return a.isUrgent ? -1 : 1;
      }
      
      // Finally by date (newest first)
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    });
  };

  const filteredOrders = filter === 'todos' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const sortedOrders = sortOrders(filteredOrders);

  const pendingCount = orders.filter(order => order.status === 'pendiente').length;
  const completedCount = orders.filter(order => order.status === 'completado').length;
  const urgentCount = orders.filter(order => order.status === 'pendiente' && order.isUrgent).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600">Sistema de pedidos - Empresa Familiar</p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Badge variant="secondary" className="px-3 py-1">
              Pendientes: {pendingCount}
            </Badge>
            <Badge variant="default" className="px-3 py-1">
              Completados: {completedCount}
            </Badge>
            {urgentCount > 0 && (
              <Badge variant="destructive" className="px-3 py-1">
                Urgentes: {urgentCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 hover:bg-amber-700 flex-1 sm:flex-none"
            size="lg"
          >
            {showForm ? 'Cancelar' : 'Nuevo Pedido'}
          </Button>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-1 justify-center sm:justify-end">
            <Button
              onClick={() => setFilter('todos')}
              variant={filter === 'todos' ? 'default' : 'outline'}
              size="sm"
            >
              Todos
            </Button>
            <Button
              onClick={() => setFilter('pendiente')}
              variant={filter === 'pendiente' ? 'default' : 'outline'}
              size="sm"
            >
              Pendientes
            </Button>
            <Button
              onClick={() => setFilter('completado')}
              variant={filter === 'completado' ? 'default' : 'outline'}
              size="sm"
            >
              Completados
            </Button>
          </div>
        </div>

        {/* Order Form */}
        {showForm && (
          <OrderForm onAddOrder={addOrder} />
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {sortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {filter === 'todos' 
                  ? 'No hay pedidos registrados aún'
                  : `No hay pedidos ${filter === 'pendiente' ? 'pendientes' : 'completados'}`
                }
              </p>
            </div>
          ) : (
            sortedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onToggleStatus={toggleOrderStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
