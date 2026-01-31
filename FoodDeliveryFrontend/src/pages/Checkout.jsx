import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CreditCard, Loader, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addressService, orderService, paymentService } from '../services';

export default function Checkout() {
    const { items, restaurant, getSubtotal, clearCart } = useCart();
    const { user } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        type: 'HOME',
        isDefault: false,
    });
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const subtotal = getSubtotal();
    const deliveryFee = restaurant?.deliveryFee || 30;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const response = await addressService.getAll();
            setAddresses(response.data || []);
            const defaultAddr = response.data?.find((a) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.id);
            }
        } catch (err) {
            console.error('Error loading addresses:', err);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await addressService.create(newAddress);
            setAddresses((prev) => [...prev, response.data]);
            setSelectedAddress(response.data.id);
            setShowAddAddress(false);
            setNewAddress({ street: '', city: '', state: '', pincode: '', type: 'HOME', isDefault: false });
            success('Address added');
        } catch (err) {
            error('Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            error('Please select a delivery address');
            return;
        }

        setLoading(true);
        try {
            // Create order
            const orderData = {
                restaurantId: restaurant.id,
                deliveryAddressId: selectedAddress,
                deliveryInstructions,
                items: items.map((item) => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                })),
            };

            const orderResponse = await orderService.create(orderData);
            const order = orderResponse.data;

            // Create payment order
            const paymentResponse = await paymentService.createPaymentOrder(order.id);
            const payment = paymentResponse.data;

            // Initialize Razorpay
            const options = {
                key: payment.razorpayKeyId,
                amount: payment.amount * 100,
                currency: payment.currency,
                name: 'Zwiggy',
                description: `Order #${order.orderNumber}`,
                order_id: payment.razorpayOrderId,
                handler: async function (response) {
                    try {
                        await paymentService.verifyPayment({
                            orderId: order.id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        clearCart();
                        setOrderId(order.id);
                        setOrderPlaced(true);
                        success('Order placed successfully!');
                    } catch (err) {
                        error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone,
                },
                theme: {
                    color: '#ff6b35',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    // Redirect to cart if no items (must be before conditional returns for hooks rules)
    useEffect(() => {
        if (items.length === 0 && !orderPlaced) {
            navigate('/cart');
        }
    }, [items.length, orderPlaced, navigate]);

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order has been placed successfully. You can track it in your orders.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => navigate('/orders')} className="btn-primary">
                            View Orders
                        </button>
                        <button onClick={() => navigate('/')} className="btn-secondary">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                Delivery Address
                            </h3>

                            {addresses.length === 0 && !showAddAddress && (
                                <p className="text-gray-500 text-sm mb-4">No saved addresses</p>
                            )}

                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr.id}
                                        className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddress === addr.id
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr.id}
                                            checked={selectedAddress === addr.id}
                                            onChange={() => setSelectedAddress(addr.id)}
                                            className="sr-only"
                                        />
                                        <div className="flex justify-between">
                                            <div>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                    {addr.type}
                                                </span>
                                                <p className="mt-2 text-gray-800">{addr.street}</p>
                                                <p className="text-sm text-gray-500">
                                                    {addr.city}, {addr.state} - {addr.pincode}
                                                </p>
                                            </div>
                                            {selectedAddress === addr.id && (
                                                <CheckCircle className="w-5 h-5 text-orange-500" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {showAddAddress ? (
                                <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                    <div className="flex gap-3">
                                        <button type="submit" className="btn-primary">
                                            Save Address
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddAddress(false)}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setShowAddAddress(true)}
                                    className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add New Address
                                </button>
                            )}
                        </div>

                        {/* Delivery Instructions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Instructions</h3>
                            <textarea
                                value={deliveryInstructions}
                                onChange={(e) => setDeliveryInstructions(e.target.value)}
                                placeholder="E.g., Leave at door, call on arrival, etc."
                                className="input-field h-24 resize-none"
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

                            <div className="max-h-48 overflow-y-auto mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-2">
                                        <span className="text-gray-600">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4" />

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

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !selectedAddress}
                                className="w-full btn-primary mt-6 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ₹{total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
