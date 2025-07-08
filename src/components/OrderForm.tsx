
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Order, OrderType } from '@/types/order';

interface OrderFormProps {
  onAddOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status' | 'phase'>) => void;
  initialData?: Order;
}

const OrderForm: React.FC<OrderFormProps> = ({ onAddOrder, initialData }) => {
  const [customerName, setCustomerName] = useState('');
  const [destination, setDestination] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [usageType, setUsageType] = useState<'encinerar' | 'entierro'>('entierro');
  const [color, setColor] = useState('');
  const [coffeeType, setCoffeeType] = useState<OrderType>('clasico');
  const [isUrgent, setIsUrgent] = useState(false);
  const [comments, setComments] = useState('');

  // Populate form with initialData if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setDestination(initialData.destination);
      setModel(initialData.model);
      setQuantity(initialData.quantity);
      setUsageType(initialData.usageType);
      setColor(initialData.color || '');
      setCoffeeType(initialData.coffeeType);
      setIsUrgent(initialData.isUrgent);
      setComments(initialData.comments || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !destination.trim() || !model.trim() || quantity === '' || quantity <= 0) {
      return;
    }

    onAddOrder({
      customerName: customerName.trim(),
      destination: destination.trim(),
      model: model.trim(),
      quantity: typeof quantity === 'number' ? quantity : 1,
      usageType,
      color: color.trim(),
      coffeeType,
      isUrgent,
      comments: comments.trim(),
    });

    // Reset form only if not editing
    if (!initialData) {
      setCustomerName('');
      setDestination('');
      setModel('');
      setQuantity('');
      setUsageType('entierro');
      setColor('');
      setCoffeeType('clasico');
      setIsUrgent(false);
      setComments('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
          Cliente *
        </Label>
        <Input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nombre del cliente"
          className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
          Destino *
        </Label>
        <Input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destino del pedido"
          className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-gray-700">
          Modelo *
        </Label>
        <Input
          id="model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Modelo del ataúd"
          className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
            Cantidad *
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usageType" className="text-sm font-medium text-gray-700">
            Tipo de uso *
          </Label>
          <Select value={usageType} onValueChange={(value: 'encinerar' | 'entierro') => setUsageType(value)}>
            <SelectTrigger className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200">
              <SelectItem value="entierro" className="rounded-lg">Entierro</SelectItem>
              <SelectItem value="encinerar" className="rounded-lg">Encinerar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color" className="text-sm font-medium text-gray-700">
          Color
        </Label>
        <Input
          id="color"
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color del ataúd"
          className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
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
          Observaciones
        </Label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Observaciones adicionales..."
          className="rounded-xl border-gray-200 px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent min-h-[120px]"
          rows={5}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-black hover:bg-gray-800 text-white rounded-xl h-12 font-medium"
      >
        {initialData ? 'Actualizar Pedido' : 'Registrar Pedido'}
      </Button>
    </form>
  );
};

export default OrderForm;
