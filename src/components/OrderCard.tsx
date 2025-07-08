
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onToggleStatus: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onToggleStatus }) => {
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
      carpinteria: 'Carpintería',
      pintura: 'Pintura', 
      montaje: 'Montaje',
      completado: 'Completado'
    };
    return phases[phase as keyof typeof phases] || phase;
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
              <p className="text-sm text-gray-600">
                <span className="font-medium">Modelo:</span> {order.model} 
                {order.color && <span> - {order.color}</span>}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Cantidad:</span> {order.quantity} | 
                <span className="font-medium"> Tipo:</span> {order.usageType}
              </p>
              <p className="text-sm text-gray-500">
                {format(order.orderDate, "dd MMM, HH:mm", { locale: es })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {order.isUrgent && order.status === 'pendiente' && (
              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1 rounded-full">
                URGENTE
              </Badge>
            )}
            <Badge className="bg-black text-white text-xs px-3 py-1 rounded-full">
              {getPhaseLabel(order.phase)}
            </Badge>
          </div>
        </div>

        {order.comments && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-sm text-gray-600 italic">
              "{order.comments}"
            </p>
          </div>
        )}


        <div className="flex items-center justify-between">
          <Badge className={`${
            order.status === 'completado' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          } border rounded-full px-3 py-1`}>
            {order.status === 'completado' ? 'Completado' : 'Pendiente'}
          </Badge>
          
          <Button
            onClick={() => onToggleStatus(order.id)}
            size="sm"
            className={`rounded-full px-4 ${
              order.status === 'completado' 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
