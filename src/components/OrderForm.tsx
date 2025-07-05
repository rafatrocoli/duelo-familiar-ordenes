
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, OrderType } from '@/types/order';

interface OrderFormProps {
  onAddOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onAddOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [coffeeType, setCoffeeType] = useState<OrderType>('clasico');
  const [isUrgent, setIsUrgent] = useState(false);
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      return;
    }

    onAddOrder({
      customerName: customerName.trim(),
      coffeeType,
      isUrgent,
      comments: comments.trim(),
    });

    // Reset form
    setCustomerName('');
    setCoffeeType('clasico');
    setIsUrgent(false);
    setComments('');
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Nuevo Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre del Cliente *</Label>
            <Input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingrese el nombre del cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coffeeType">Tipo de Ataúd</Label>
            <Select value={coffeeType} onValueChange={(value: OrderType) => setCoffeeType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clasico">Clásico</SelectItem>
                <SelectItem value="ecologico">Ecológico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={isUrgent}
              onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
            />
            <Label htmlFor="urgent" className="text-sm font-medium">
              Pedido Urgente
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Comentarios adicionales..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
            Registrar Pedido
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
