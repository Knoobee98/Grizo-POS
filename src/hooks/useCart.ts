import { useState } from 'react';
import { CartItem, Product, Customer } from '../types';

export function useCart(initialTicketNo: number = 4092) {
  const [cart, setCart] = useState<CartItem[]>(() => [
    {
      product: {
        id: 'prod-1',
        name: 'Basic Cotton Tee - White',
        subtitle: 'Size M / Unisex',
        sku: 'TS-WHT-M',
        category: 'Apparel',
        itemType: 'Barang',
        price: 150000,
        stock: 45,
        lowStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
        description: 'Premium heavyweight cotton daily essential tee.'
      },
      quantity: 2
    },
    {
      product: {
        id: 'prod-2',
        name: 'Classic Slim Denim Jeans',
        subtitle: 'Size 32 / Dark Wash',
        sku: 'DN-DKW-32',
        category: 'Apparel',
        itemType: 'Barang',
        price: 450000,
        stock: 18,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1542272604-780c36856d67?w=500&auto=format&fit=crop&q=80',
        description: 'Tailored slim-fit stretch denim with reinforced stitching.'
      },
      quantity: 1
    }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(50000);
  const [ticketNumberCount, setTicketNumberCount] = useState<number>(initialTicketNo);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleSaveOrder = () => {
    if (cart.length === 0) return;
    alert(`Order #${ticketNumberCount} saved safely. You can retrieve saved orders anytime.`);
  };

  const handleVoidOrder = () => {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to void this current order?')) {
      setCart([]);
      setDiscountAmount(0);
      setSelectedCustomer(null);
    }
  };

  const resetCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomer(null);
  };

  return {
    cart,
    setCart,
    selectedCustomer,
    setSelectedCustomer,
    discountAmount,
    setDiscountAmount,
    ticketNumberCount,
    setTicketNumberCount,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleSaveOrder,
    handleVoidOrder,
    resetCart
  };
}
