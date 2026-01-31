import { Plus, Minus } from 'lucide-react';
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
            success(`Added to cart`);
        }
    };

    const handleIncrease = () => {
        updateQuantity(item.id, quantity + 1);
    };

    const handleDecrease = () => {
        updateQuantity(item.id, quantity - 1);
    };

    return (
        <div className="flex justify-between gap-4 py-6 border-b border-gray-100 last:border-0">
            {/* Left Side - Item Details */}
            <div className="flex-1 min-w-0">
                {/* Veg/Non-veg Indicator */}
                <div className="flex items-center gap-2 mb-1">
                    {item.isVeg ? (
                        <span className="veg-indicator">
                            <span className="veg-indicator-dot"></span>
                        </span>
                    ) : (
                        <span className="nonveg-indicator">
                            <span className="nonveg-indicator-dot"></span>
                        </span>
                    )}
                    {item.isBestseller && (
                        <span className="text-[#ee9c00] text-xs font-bold flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                                <rect y="4.00006" width="9" height="2" rx="1" fill="currentColor"/>
                            </svg>
                            Bestseller
                        </span>
                    )}
                </div>

                {/* Item Name */}
                <h4 className="font-bold text-base text-[#3d4152] mb-1 leading-tight">
                    {item.name}
                </h4>

                {/* Price */}
                <p className="text-[15px] text-[#3d4152] font-medium mb-2">
                    ₹{item.price}
                </p>

                {/* Description */}
                {item.description && (
                    <p className="text-[#93959f] text-sm leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                )}
            </div>

            {/* Right Side - Image and Add Button */}
            <div className="flex-shrink-0 w-[118px] relative">
                {/* Item Image */}
                {item.imageUrl ? (
                    <div className="relative">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-[118px] h-24 object-cover rounded-xl"
                        />
                    </div>
                ) : (
                    <div className="w-[118px] h-24 bg-gray-100 rounded-xl"></div>
                )}

                {/* Add Button */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    {!item.isAvailable ? (
                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg">
                            UNAVAILABLE
                        </span>
                    ) : quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="px-8 py-2 bg-white border border-gray-200 text-[#60b246] text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow uppercase"
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="qty-container">
                            <button
                                onClick={handleDecrease}
                                className="qty-btn hover:bg-[#48a832] rounded-l"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-2 text-sm">{quantity}</span>
                            <button
                                onClick={handleIncrease}
                                className="qty-btn hover:bg-[#48a832] rounded-r"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Customisable label */}
                {item.imageUrl && item.isAvailable && quantity === 0 && (
                    <p className="text-[10px] text-[#93959f] text-center mt-4">Customisable</p>
                )}
            </div>
        </div>
    );
}
