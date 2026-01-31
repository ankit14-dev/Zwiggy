import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
    const { items, restaurant, updateQuantity, removeItem, clearCart, getSubtotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const subtotal = getSubtotal();
    const deliveryFee = restaurant?.deliveryFee || 30;
    const platformFee = 5;
    const gstAndCharges = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + platformFee + gstAndCharges;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        } else {
            navigate('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f1f1f6] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-64 h-52 mx-auto mb-6">
                        <img 
                            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0"
                            alt="Empty cart"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-[#3d4152] mb-2">Your cart is empty</h2>
                    <p className="text-[#7e808c] mb-8">You can go to home page to view more restaurants</p>
                    <Link 
                        to="/restaurants" 
                        className="inline-block px-8 py-3 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-colors"
                    >
                        See restaurants near you
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#e9ecee]">
            <div className="max-w-[800px] mx-auto py-8 px-4">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            {/* Restaurant Info */}
                            <div className="p-5 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={restaurant?.imageUrl || 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100/placeholder'}
                                        alt={restaurant?.name}
                                        className="w-14 h-14 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h2 className="font-bold text-[#3d4152] text-lg">{restaurant?.name}</h2>
                                        <p className="text-[#7e808c] text-sm">{restaurant?.city}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <div key={item.id} className="p-5 flex items-center gap-4">
                                        {/* Veg/Non-veg Indicator */}
                                        <div className="flex-shrink-0">
                                            {item.isVeg ? (
                                                <span className="veg-indicator">
                                                    <span className="veg-indicator-dot"></span>
                                                </span>
                                            ) : (
                                                <span className="nonveg-indicator">
                                                    <span className="nonveg-indicator-dot"></span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Item Name */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-[#3d4152] text-sm truncate">
                                                {item.name}
                                            </h4>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="qty-container">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="qty-btn hover:bg-[#48a832] rounded-l"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="px-3 py-1.5 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="qty-btn hover:bg-[#48a832] rounded-r"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right w-20">
                                            <p className="font-medium text-[#3d4152] text-sm">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Suggestions Input */}
                            <div className="p-5 border-t border-gray-100">
                                <div className="flex items-center gap-3 p-4 bg-[#f1f1f6] rounded-xl">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#3d4152]">
                                        <path d="M9 2.77778C9 2.30628 9.5 2 10 2C10.5 2 11 2.30628 11 2.77778V7.22222C11 7.69372 10.5 8 10 8C9.5 8 9 7.69372 9 7.22222V2.77778Z" fill="currentColor"/>
                                        <path d="M10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z" fill="currentColor"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16Z" fill="currentColor"/>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder='Any suggestions? We will pass it on...'
                                        className="flex-1 bg-transparent text-sm text-[#3d4152] placeholder:text-[#93959f] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Clear Cart */}
                            <div className="px-5 pb-5">
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-[#fc8019] font-medium hover:underline"
                                >
                                    Clear cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Bill Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
                            <h3 className="text-lg font-bold text-[#3d4152] mb-5">Bill Details</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#686b78]">Item Total</span>
                                    <span className="text-[#3d4152]">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#686b78] flex items-center gap-1">
                                        Delivery Fee
                                        <span className="text-[10px] text-[#93959f]">| {restaurant?.deliveryTime || '25-30 mins'}</span>
                                    </span>
                                    <span className="text-[#3d4152]">
                                        {deliveryFee === 0 ? (
                                            <span className="text-[#60b246]">FREE</span>
                                        ) : (
                                            `₹${deliveryFee.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#686b78]">Platform fee</span>
                                    <span className="text-[#3d4152]">₹{platformFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#686b78]">GST and Restaurant Charges</span>
                                    <span className="text-[#3d4152]">₹{gstAndCharges.toFixed(2)}</span>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex justify-between font-bold text-base">
                                        <span className="text-[#3d4152]">TO PAY</span>
                                        <span className="text-[#3d4152]">₹{total.toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 py-4 bg-[#60b246] hover:bg-[#48a832] text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-colors"
                            >
                                Proceed to checkout
                            </button>

                            {!isAuthenticated && (
                                <p className="text-xs text-[#93959f] mt-3 text-center">
                                    You'll need to login to place your order
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
