import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderForm from './OrderForm';
import OrderCard from './OrderCard';
import BottomNavigation, { Department } from './BottomNavigation';
import { Order, OrderStatus } from '@/types/order';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos');
  const [showForm, setShowForm] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState<Department>('pedidos');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('coffin-orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any, index: number) => ({
        ...order,
        orderDate: new Date(order.orderDate),
        // Add orderNumber to existing orders if they don't have one
        orderNumber: order.orderNumber || (index + 1),
        // Add completedPhases to existing orders if they don't have it
        completedPhases: order.completedPhases || []
      }));
      setOrders(parsedOrders);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('coffin-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status' | 'phase' | 'completedPhases'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date(),
      status: 'pendiente',
      phase: 'montaje',
      completedPhases: []
    };

    setOrders(prev => [newOrder, ...prev]);
    setShowForm(false);
  };

  const getNextOrderNumber = () => {
    if (orders.length === 0) return 1;
    const maxOrderNumber = Math.max(...orders.map(order => order.orderNumber));
    return maxOrderNumber + 1;
  };

  const toggleOrderStatus = (id: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        if (order.status === 'completado') {
          // Revert to previous phase
          return { ...order, status: 'pendiente' };
        } else {
          // Complete current phase and move to next
          const phaseOrder = ['montaje', 'carpinteria', 'pintura'] as const;
          const currentPhaseIndex = phaseOrder.indexOf(order.phase as any);
          
          // Add current phase to completed phases if not already there
          const updatedCompletedPhases = order.completedPhases.includes(order.phase as any) 
            ? order.completedPhases 
            : [...order.completedPhases, order.phase as any];
          
          if (currentPhaseIndex < phaseOrder.length - 1) {
            // Move to next phase
            return { 
              ...order, 
              phase: phaseOrder[currentPhaseIndex + 1],
              status: 'pendiente',
              completedPhases: updatedCompletedPhases
            };
          } else {
            // Complete final phase
            return { 
              ...order, 
              status: 'completado',
              phase: 'completado',
              completedPhases: updatedCompletedPhases
            };
          }
        }
      }
      return order;
    }));
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

  const filteredOrders = (() => {
    let filtered = filter === 'todos' ? orders : orders.filter(order => order.status === filter);
    
    // Filter by department phase
    if (activeDepartment !== 'pedidos' && activeDepartment !== 'nuevo') {
      filtered = filtered.filter(order => 
        order.phase === activeDepartment || // Current phase orders
        order.completedPhases.includes(activeDepartment as any) // Orders that completed this phase
      );
    }
    
    return filtered;
  })();

  const sortedOrders = sortOrders(filteredOrders);

  const pendingCount = orders.filter(order => order.status === 'pendiente').length;
  const completedCount = orders.filter(order => order.status === 'completado').length;
  const urgentCount = orders.filter(order => order.status === 'pendiente' && order.isUrgent).length;

  const getDepartmentTitle = (department: Department) => {
    const titles = {
      pedidos: 'Pedidos',
      montaje: 'Montaje',
      carpinteria: 'Carpintería',
      pintura: 'Pintura',
      nuevo: 'Nuevo Pedido'
    };
    return titles[department];
  };

  const handleDepartmentChange = (department: Department) => {
    if (department === 'nuevo') {
      setShowForm(true);
    } else {
      setActiveDepartment(department);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
  };

  const handleUpdateOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status' | 'phase' | 'completedPhases'>) => {
    if (editingOrder) {
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...orderData }
          : order
      ));
      setEditingOrder(null);
    }
  };

  const handleDeleteOrder = (id: string) => {
    setOrderToDelete(id);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(prev => prev.filter(order => order.id !== orderToDelete));
      setOrderToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header - Estilo Revolut */}
        <div className="bg-white px-6 py-6 border-b border-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {getDepartmentTitle(activeDepartment)}
            </h1>
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
                <OrderForm onAddOrder={addOrder} nextOrderNumber={getNextOrderNumber()} />
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="px-6 py-4 space-y-4 pb-20">
          {(() => {
            if (sortedOrders.length === 0) {
              return (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📋</div>
                  <p className="text-gray-500 text-base">
                    {filter === 'todos' 
                      ? 'No hay pedidos registrados'
                      : `No hay pedidos ${filter === 'pendiente' ? 'pendientes' : 'completados'}`
                    }
                  </p>
                </div>
              );
            }

            // For department tabs (not 'pedidos'), group orders by current vs completed in this phase
            if (activeDepartment !== 'pedidos' && activeDepartment !== 'nuevo') {
              const currentPhaseOrders = sortedOrders.filter(order => 
                order.phase === activeDepartment && order.status === 'pendiente'
              );
              const completedPhaseOrders = sortedOrders.filter(order => 
                order.completedPhases.includes(activeDepartment as any) && order.phase !== activeDepartment
              );

              return (
                <>
                  {/* Current Phase Orders */}
                  {currentPhaseOrders.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 px-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Pendientes en {getDepartmentTitle(activeDepartment)}
                      </h3>
                      {currentPhaseOrders.map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onToggleStatus={toggleOrderStatus}
                          activeDepartment={activeDepartment}
                          onEditOrder={handleEditOrder}
                          onDeleteOrder={handleDeleteOrder}
                          isCompletedInPhase={false}
                        />
                      ))}
                    </div>
                  )}

                  {/* Completed Phase Orders */}
                  {completedPhaseOrders.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-green-600 px-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Completados en {getDepartmentTitle(activeDepartment)}
                      </h3>
                      {completedPhaseOrders.map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onToggleStatus={toggleOrderStatus}
                          activeDepartment={activeDepartment}
                          onEditOrder={handleEditOrder}
                          onDeleteOrder={handleDeleteOrder}
                          isCompletedInPhase={true}
                        />
                      ))}
                    </div>
                  )}

                  {/* No orders message */}
                  {currentPhaseOrders.length === 0 && completedPhaseOrders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-2">📋</div>
                      <p className="text-gray-500 text-base">
                        No hay pedidos en {getDepartmentTitle(activeDepartment)}
                      </p>
                    </div>
                  )}
                </>
              );
            }

            // For 'pedidos' tab, show all orders normally
            return sortedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onToggleStatus={toggleOrderStatus}
                activeDepartment={activeDepartment}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
                isCompletedInPhase={false}
              />
            ));
          })()}
        </div>


        {/* Edit Order Modal */}
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <DialogTitle>Editar Pedido</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 px-6 pb-6">
              {editingOrder && (
                <OrderForm 
                  onAddOrder={handleUpdateOrder}
                  initialData={editingOrder}
                  nextOrderNumber={getNextOrderNumber()}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar pedido?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El pedido será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOrderToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteOrder} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bottom Navigation */}
        {!showForm && (
          <BottomNavigation 
            activeDepartment={activeDepartment}
            onDepartmentChange={handleDepartmentChange}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManager;
