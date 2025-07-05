
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, Clock } from 'lucide-react';

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
      clasico: 'bg-blue-100 text-blue-800',
      ecologico: 'bg-green-100 text-green-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={`w-full transition-all duration-200 ${
      order.status === 'completado' ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'
    } ${order.isUrgent && order.status === 'pendiente' ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${
              order.status === 'completado' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {order.customerName}
            </h3>
            <p className="text-sm text-gray-500">
              {format(order.orderDate, "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {order.isUrgent && order.status === 'pendiente' && (
              <Badge variant="destructive" className="text-xs">
                URGENTE
              </Badge>
            )}
            <Badge className={getTypeColor(order.coffeeType)}>
              {getTypeLabel(order.coffeeType)}
            </Badge>
          </div>
        </div>

        {order.comments && (
          <p className="text-sm text-gray-600 mb-3 italic">
            "{order.comments}"
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge variant={order.status === 'completado' ? 'default' : 'secondary'}>
            {order.status === 'completado' ? 'Completado' : 'Pendiente'}
          </Badge>
          
          <Button
            onClick={() => onToggleStatus(order.id)}
            variant={order.status === 'completado' ? 'outline' : 'default'}
            size="sm"
            className={order.status === 'completado' ? '' : 'bg-green-600 hover:bg-green-700'}
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
