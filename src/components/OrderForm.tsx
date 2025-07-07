
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
          Nombre del Cliente *
        </Label>
        <Input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Ingrese el nombre del cliente"
          className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coffeeType" className="text-sm font-medium text-gray-700">
          Tipo de Ataúd
        </Label>
        <Select value={coffeeType} onValueChange={(value: OrderType) => setCoffeeType(value)}>
          <SelectTrigger className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-200">
            <SelectItem value="clasico" className="rounded-lg">Clásico</SelectItem>
            <SelectItem value="ecologico" className="rounded-lg">Ecológico</SelectItem>
            <SelectItem value="premium" className="rounded-lg">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
        <Checkbox
          id="urgent"
          checked={isUrgent}
          onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
          className="rounded-md"
        />
        <Label htmlFor="urgent" className="text-sm font-medium text-gray-700 flex-1">
          Marcar como pedido urgente
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments" className="text-sm font-medium text-gray-700">
          Comentarios
        </Label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Comentarios adicionales..."
          className="rounded-xl border-gray-200 px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent min-h-[100px]"
          rows={4}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-black hover:bg-gray-800 text-white rounded-xl h-12 font-medium"
      >
        Registrar Pedido
      </Button>
    </form>
  );
};

export default OrderForm;
