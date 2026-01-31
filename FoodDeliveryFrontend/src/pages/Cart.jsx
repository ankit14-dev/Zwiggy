import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
    const { items, restaurant, updateQuantity, removeItem, clearCart, getSubtotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const subtotal = getSubtotal();
    const deliveryFee = restaurant?.deliveryFee || 30;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        } else {
            navigate('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add items from a restaurant to get started</p>
                    <Link to="/restaurants" className="btn-primary">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Link
                    to={`/restaurants/${restaurant?.id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to {restaurant?.name}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Cart
                                </button>
                            </div>

                            {/* Restaurant Info */}
                            <div className="p-4 bg-gray-50 border-b flex items-center gap-3">
                                <img
                                    src={restaurant?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'}
                                    alt={restaurant?.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{restaurant?.name}</p>
                                    <p className="text-sm text-gray-500">{restaurant?.city}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="divide-y">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center gap-4">
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
                                                <span className="font-medium text-gray-800">{item.name}</span>
                                            </div>
                                            <p className="text-gray-600">₹{item.price} × {item.quantity}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-2 font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">GST (5%)</span>
                                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={handleCheckout} className="w-full btn-primary mt-6 py-3">
                                Proceed to Checkout
                            </button>

                            {!isAuthenticated && (
                                <p className="text-xs text-gray-500 mt-3 text-center">
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
