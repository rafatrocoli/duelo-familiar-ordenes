
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { Order, OrderType, Product } from '@/types/order';

interface OrderFormProps {
  onAddOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status' | 'phase'>) => void;
  initialData?: Order;
  nextOrderNumber: number;
}

const createEmptyProduct = (): Product => ({
  model: '',
  quantity: 1,
  usageType: 'entierro',
  color: '',
  coffeeType: 'clasico',
  comments: ''
});

const OrderForm: React.FC<OrderFormProps> = ({ onAddOrder, initialData, nextOrderNumber }) => {
  const [orderNumber, setOrderNumber] = useState(nextOrderNumber);
  const [customerName, setCustomerName] = useState('');
  const [destination, setDestination] = useState('');
  const [products, setProducts] = useState<Product[]>([createEmptyProduct()]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [errors, setErrors] = useState<{
    customerName: boolean;
    destination: boolean;
    products: boolean[];
  }>({
    customerName: false,
    destination: false,
    products: [false]
  });

  // Populate form with initialData if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setOrderNumber(initialData.orderNumber);
      setCustomerName(initialData.customerName);
      setDestination(initialData.destination);
      setProducts(initialData.products.length > 0 ? initialData.products : [createEmptyProduct()]);
      setIsUrgent(initialData.isUrgent);
      // Reset errors when editing
      setErrors({
        customerName: false,
        destination: false,
        products: initialData.products.map(() => false)
      });
    } else {
      setOrderNumber(nextOrderNumber);
    }
  }, [initialData, nextOrderNumber]);

  const addProduct = () => {
    setProducts([...products, createEmptyProduct()]);
    setErrors(prev => ({
      ...prev,
      products: [...prev.products, false]
    }));
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
      setErrors(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index)
      }));
    }
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    setProducts(products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
    
    // Clear error when user starts typing in model field
    if (field === 'model' && value.trim()) {
      setErrors(prev => ({
        ...prev,
        products: prev.products.map((error, i) => i === index ? false : error)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      customerName: !customerName.trim(),
      destination: !destination.trim(),
      products: products.map(product => !product.model.trim() || product.quantity <= 0)
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = newErrors.customerName || 
                      newErrors.destination || 
                      newErrors.products.some(error => error);

    if (hasErrors) {
      return;
    }

    // Validate products
    const validProducts = products.filter(product => 
      product.model.trim() && product.quantity > 0
    );

    if (validProducts.length === 0) {
      return;
    }

    onAddOrder({
      orderNumber,
      customerName: customerName.trim(),
      destination: destination.trim(),
      products: validProducts.map(product => ({
        ...product,
        model: product.model.trim(),
        color: product.color.trim(),
        comments: product.comments.trim()
      })),
      isUrgent,
    });

    // Reset form only if not editing
    if (!initialData) {
      setOrderNumber(nextOrderNumber);
      setCustomerName('');
      setDestination('');
      setProducts([createEmptyProduct()]);
      setIsUrgent(false);
      setErrors({
        customerName: false,
        destination: false,
        products: [false]
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer and Destination Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber" className="text-sm font-medium text-gray-700">
            Número de Pedido
          </Label>
          <Input
            id="orderNumber"
            type="number"
            value={orderNumber}
            className="rounded-xl border-gray-200 h-12 px-4 bg-gray-50 text-gray-600"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName" className={`text-sm font-medium ${errors.customerName ? 'text-red-600' : 'text-gray-700'}`}>
            Cliente *
          </Label>
          <Input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, customerName: false }));
              }
            }}
            placeholder="Nombre del cliente"
            className={`rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent ${errors.customerName ? 'border-red-500' : ''}`}
            required
          />
          {errors.customerName && (
            <p className="text-red-600 text-xs mt-1">Campo obligatorio</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className={`text-sm font-medium ${errors.destination ? 'text-red-600' : 'text-gray-700'}`}>
            Destino *
          </Label>
          <Input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, destination: false }));
              }
            }}
            placeholder="Destino del pedido"
            className={`rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent ${errors.destination ? 'border-red-500' : ''}`}
            required
          />
          {errors.destination && (
            <p className="text-red-600 text-xs mt-1">Campo obligatorio</p>
          )}
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
      </div>

      <Separator className="my-6" />

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Pedidos</h3>
          <Button
            type="button"
            onClick={addProduct}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-black border-black hover:bg-black hover:text-white"
          >
            <Plus size={16} />
            Añadir otro pedido
          </Button>
        </div>

        {products.map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Pedido {index + 1}</h4>
              {products.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeProduct(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={`text-sm font-medium ${errors.products[index] ? 'text-red-600' : 'text-gray-700'}`}>
                  Modelo *
                </Label>
                <Input
                  type="text"
                  value={product.model}
                  onChange={(e) => updateProduct(index, 'model', e.target.value)}
                  placeholder="Modelo del ataúd"
                  className={`rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent ${errors.products[index] ? 'border-red-500' : ''}`}
                  required
                />
                {errors.products[index] && (
                  <p className="text-red-600 text-xs mt-1">Campo obligatorio</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Cantidad *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tipo de uso *
                  </Label>
                  <Select 
                    value={product.usageType} 
                    onValueChange={(value: 'encinerar' | 'entierro') => updateProduct(index, 'usageType', value)}
                  >
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Color
                  </Label>
                  <Input
                    type="text"
                    value={product.color}
                    onChange={(e) => updateProduct(index, 'color', e.target.value)}
                    placeholder="Color del ataúd"
                    className="rounded-xl border-gray-200 h-12 px-4 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tipo de Ataúd
                  </Label>
                  <Select 
                    value={product.coffeeType} 
                    onValueChange={(value: OrderType) => updateProduct(index, 'coffeeType', value)}
                  >
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
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Observaciones
                </Label>
                <Textarea
                  value={product.comments}
                  onChange={(e) => updateProduct(index, 'comments', e.target.value)}
                  placeholder="Observaciones para este pedido..."
                  className="rounded-xl border-gray-200 px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent min-h-[80px]"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
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
