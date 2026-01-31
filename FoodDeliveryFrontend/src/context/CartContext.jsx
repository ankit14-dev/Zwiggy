import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedRestaurant = localStorage.getItem('cartRestaurant');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
        if (savedRestaurant) {
            setRestaurant(JSON.parse(savedRestaurant));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
        if (restaurant) {
            localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
        }
    }, [items, restaurant]);

    const addItem = (item, restaurantInfo) => {
        if (restaurant && restaurant.id !== restaurantInfo.id) {
            if (!window.confirm('Your cart contains items from another restaurant. Clear cart and add this item?')) {
                return false;
            }
            setItems([]);
        }

        setRestaurant(restaurantInfo);

        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        return true;
    };

    const removeItem = (itemId) => {
        setItems((prev) => {
            const newItems = prev.filter((i) => i.id !== itemId);
            if (newItems.length === 0) {
                setRestaurant(null);
                localStorage.removeItem('cartRestaurant');
            }
            return newItems;
        });
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setRestaurant(null);
        localStorage.removeItem('cart');
        localStorage.removeItem('cartRestaurant');
    };

    const getSubtotal = () => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getItemCount = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const value = {
        items,
        restaurant,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        getItemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
