import { Plus, Minus, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function MenuItemCard({ item, restaurant }) {
    const { items, addItem, updateQuantity } = useCart();
    const { success } = useToast();

    const cartItem = items.find((i) => i.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        const added = addItem(item, restaurant);
        if (added) {
            success(`${item.name} added to cart`);
        }
    };

    const handleIncrease = () => {
        updateQuantity(item.id, quantity + 1);
    };

    const handleDecrease = () => {
        updateQuantity(item.id, quantity - 1);
    };

    return (
        <div className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Item details */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {item.isVeg ? (
                        <span className="w-4 h-4 border-2 border-green-500 flex items-center justify-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </span>
                    ) : (
                        <span className="w-4 h-4 border-2 border-red-500 flex items-center justify-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        </span>
                    )}
                    {item.isBestseller && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            Bestseller
                        </span>
                    )}
                </div>

                <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                <p className="text-gray-900 font-medium mb-2">₹{item.price}</p>

                {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                )}
            </div>

            {/* Image and Add button */}
            <div className="flex flex-col items-center gap-2">
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                    />
                )}

                {!item.isAvailable ? (
                    <span className="text-xs text-red-500 font-medium">Unavailable</span>
                ) : quantity === 0 ? (
                    <button
                        onClick={handleAdd}
                        className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                    >
                        ADD
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-orange-500 text-white rounded-lg">
                        <button
                            onClick={handleDecrease}
                            className="p-2 hover:bg-orange-600 rounded-l-lg transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 font-semibold">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="p-2 hover:bg-orange-600 rounded-r-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
