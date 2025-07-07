import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OrderForm from './OrderForm';
import OrderCard from './OrderCard';
import FloatingAddButton from './FloatingAddButton';
import BottomNavigation, { Department } from './BottomNavigation';
import { Order, OrderStatus } from '@/types/order';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos');
  const [showForm, setShowForm] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState<Department>('montaje');

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

  const getDepartmentTitle = (department: Department) => {
    const titles = {
      montaje: 'Montaje',
      carpinteria: 'Carpintería',
      pintura: 'Pintura'
    };
    return titles[department];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header - Estilo Revolut */}
        <div className="bg-white px-6 py-6 border-b border-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {getDepartmentTitle(activeDepartment)}
            </h1>
            <p className="text-sm text-gray-500">Gestión de pedidos</p>
          </div>
          
          {/* Stats - Estilo moderno */}
          <div className="flex justify-center gap-3 mt-4">
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-gray-900">{pendingCount}</div>
              <div className="text-xs text-gray-500">Pendientes</div>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-gray-900">{completedCount}</div>
              <div className="text-xs text-gray-500">Completados</div>
            </div>
            {urgentCount > 0 && (
              <div className="bg-red-50 rounded-xl px-3 py-2 text-center">
                <div className="text-lg font-bold text-red-600">{urgentCount}</div>
                <div className="text-xs text-red-500">Urgentes</div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Buttons - Estilo Revolut */}
        <div className="px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex bg-gray-50 rounded-xl p-1">
            <Button
              onClick={() => setFilter('todos')}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-lg text-sm font-medium ${
                filter === 'todos' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos
            </Button>
            <Button
              onClick={() => setFilter('pendiente')}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-lg text-sm font-medium ${
                filter === 'pendiente' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendientes
            </Button>
            <Button
              onClick={() => setFilter('completado')}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-lg text-sm font-medium ${
                filter === 'completado' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completados
            </Button>
          </div>
        </div>

        {/* Order Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Nuevo Pedido</h2>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                  >
                    Cancelar
                  </Button>
                </div>
                <OrderForm onAddOrder={addOrder} />
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="px-6 py-4 space-y-3 pb-20">
          {sortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">📋</div>
              <p className="text-gray-500 text-base">
                {filter === 'todos' 
                  ? 'No hay pedidos registrados'
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

        {/* Floating Add Button */}
        <FloatingAddButton onClick={() => setShowForm(true)} />

        {/* Bottom Navigation */}
        <BottomNavigation 
          activeDepartment={activeDepartment}
          onDepartmentChange={setActiveDepartment}
        />
      </div>
    </div>
  );
};

export default OrderManager;
