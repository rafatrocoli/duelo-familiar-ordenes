
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, Clock, AlertCircle, Pencil, Trash2, X } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onToggleStatus: (id: string) => void;
  activeDepartment?: string;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (id: string) => void;
  isCompletedInPhase?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onToggleStatus, activeDepartment, onEditOrder, onDeleteOrder, isCompletedInPhase = false }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const getTypeLabel = (type: string) => {
    const types = {
      clasico: 'Clásico',
      ecologico: 'Ecológico',
      premium: 'Premium'
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      clasico: 'bg-blue-50 text-blue-700 border-blue-200',
      ecologico: 'bg-green-50 text-green-700 border-green-200',
      premium: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getPhaseLabel = (phase: string) => {
    const phases = {
      montaje: 'Montaje',
      carpinteria: 'Carpintería',
      pintura: 'Pintura', 
      completado: 'Completado'
    };
    return phases[phase as keyof typeof phases] || phase;
  };

  const shouldShowCompleteButton = () => {
    // Don't show in "Pedidos" tab
    if (activeDepartment === 'pedidos') return false;
    
    // Only show if current department matches order phase
    return activeDepartment === order.phase;
  };

  const handleCompleteClick = () => {
    // If reopening (already completed), no confirmation needed
    if (order.status === 'completado') {
      onToggleStatus(order.id);
    } else {
      // Show confirmation modal for completing
      setShowConfirmModal(true);
    }
  };

  const handleConfirmComplete = () => {
    onToggleStatus(order.id);
    setShowConfirmModal(false);
  };

  return (
    <Card className={`border-0 rounded-2xl transition-all duration-200 ${
      order.status === 'completado' 
        ? 'bg-gray-50 opacity-80' 
        : 'bg-white shadow-sm hover:shadow-md'
    } ${order.isUrgent && order.status === 'pendiente' ? 'ring-2 ring-red-100' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-lg ${
                order.status === 'completado' ? 'line-through text-gray-400' : 'text-gray-900'
              }`}>
                {order.customerName}
              </h3>
              {order.isUrgent && order.status === 'pendiente' && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Destino:</span> {order.destination}
              </p>
              <div className="space-y-1">
                {order.products.map((product, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">
                      {order.products.length > 1 ? `Pedido ${index + 1}: ` : 'Modelo: '}
                    </span>
                    {product.model}
                    {product.color && <span> - {product.color}</span>}
                    <span className="ml-2">
                      <span className="font-medium">Cantidad:</span> {product.quantity} | 
                      <span className="font-medium"> Tipo:</span> {product.usageType}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {format(order.orderDate, "dd MMM, HH:mm", { locale: es })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {order.isUrgent && order.status === 'pendiente' && !isCompletedInPhase && (
              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1 rounded-full">
                URGENTE
              </Badge>
            )}
            {activeDepartment === 'pedidos' && (
              <Badge className="bg-black text-white text-xs px-3 py-1 rounded-full">
                {getPhaseLabel(order.phase)}
              </Badge>
            )}
          </div>
        </div>

        {order.products.some(product => product.comments) && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Observaciones:</p>
            {order.products.map((product, index) => 
              product.comments ? (
                <p key={index} className="text-sm text-gray-600 italic mb-1">
                  {order.products.length > 1 && `Pedido ${index + 1}: `}"{product.comments}"
                </p>
              ) : null
            )}
          </div>
        )}


        <div className="flex items-center justify-between">
          <Badge className={`${
            (activeDepartment !== 'pedidos' && activeDepartment !== 'nuevo' && isCompletedInPhase) || 
            (activeDepartment === 'pedidos' && order.status === 'completado')
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          } border rounded-full px-3 py-1`}>
            {(activeDepartment !== 'pedidos' && activeDepartment !== 'nuevo' && isCompletedInPhase) || 
             (activeDepartment === 'pedidos' && order.status === 'completado') ? 'Completado' : 'Pendiente'}
          </Badge>
          
          <div className="flex items-center gap-2">
            {/* Edit and Delete icons - only in Pedidos tab */}
            {activeDepartment === 'pedidos' && onEditOrder && onDeleteOrder && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditOrder(order)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Editar pedido"
                >
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => onDeleteOrder(order.id)}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors"
                  aria-label="Eliminar pedido"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
            
            {/* Complete button - only in department tabs */}
            {shouldShowCompleteButton() && (
              <button
                onClick={handleCompleteClick}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  order.status === 'completado' 
                    ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200' 
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                }`}
              >
                {order.status === 'completado' ? (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Reabrir
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Completar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Confirmation Modal */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="sm:max-w-md">
          <button 
            onClick={() => setShowConfirmModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4 text-gray-400" />
            <span className="sr-only">Close</span>
          </button>
          
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-center">
              Confirm completion?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-center mt-2">
              This order will be marked as completed and moved to the next phase. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex justify-center gap-8 mt-6 mb-2">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <span className="text-red-600 text-lg">❌</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">Cancel</span>
            </button>
            
            <button
              onClick={handleConfirmComplete}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-green-600 text-lg">✅</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">Yes, complete</span>
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default OrderCard;
