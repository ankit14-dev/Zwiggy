import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CheckCircle, Loader, Home, Briefcase, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addressService, orderService, paymentService } from '../services';

const addressTypeIcons = {
    HOME: Home,
    WORK: Briefcase,
    OTHER: Heart,
};

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
    const platformFee = 5;
    const gstAndCharges = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + platformFee + gstAndCharges;

    useEffect(() => {
        loadAddresses();
    }, []);

    useEffect(() => {
        if (items.length === 0 && !orderPlaced) {
            navigate('/cart');
        }
    }, [items.length, orderPlaced, navigate]);

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
            success('Address added successfully');
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

            const paymentResponse = await paymentService.createPaymentOrder(order.id);
            const payment = paymentResponse.data;

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
                    color: '#fc8019',
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

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-[#f1f1f6] flex items-center justify-center px-4">
                <div className="text-center bg-white p-10 rounded-3xl shadow-lg max-w-md w-full">
                    <div className="w-24 h-24 bg-[#e5f7e3] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-[#60b246]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3d4152] mb-2">Order Placed Successfully!</h2>
                    <p className="text-[#7e808c] mb-8">
                        Your order has been placed and will be delivered soon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                            onClick={() => navigate('/orders')} 
                            className="px-8 py-3 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold text-sm uppercase rounded-lg transition-colors"
                        >
                            Track Order
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="px-8 py-3 bg-white hover:bg-gray-50 text-[#3d4152] font-bold text-sm uppercase rounded-lg border border-gray-200 transition-colors"
                        >
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
        <div className="min-h-screen bg-[#e9ecee]">
            <div className="max-w-[1000px] mx-auto py-8 px-4">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Column - Address & Instructions */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#fc8019] rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#3d4152]">Delivery Address</h3>
                                        <p className="text-xs text-[#7e808c]">Select where you want your order delivered</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {addresses.length === 0 && !showAddAddress && (
                                    <div className="text-center py-8">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-[#7e808c] mb-4">No saved addresses</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {addresses.map((addr) => {
                                        const IconComponent = addressTypeIcons[addr.type] || Home;
                                        return (
                                            <label
                                                key={addr.id}
                                                className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    selectedAddress === addr.id
                                                        ? 'border-[#60b246] bg-[#e5f7e3]/30'
                                                        : 'border-gray-200 hover:border-gray-300'
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
                                                <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                                    selectedAddress === addr.id ? 'text-[#60b246]' : 'text-[#3d4152]'
                                                }`} />
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#3d4152] text-sm">{addr.type}</p>
                                                    <p className="text-[#7e808c] text-sm mt-1">{addr.street}</p>
                                                    <p className="text-[#7e808c] text-sm">
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                </div>
                                                {selectedAddress === addr.id && (
                                                    <CheckCircle className="w-5 h-5 text-[#60b246] flex-shrink-0" />
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>

                                {showAddAddress ? (
                                    <form onSubmit={handleAddAddress} className="mt-6 p-4 bg-[#f1f1f6] rounded-xl space-y-4">
                                        <h4 className="font-bold text-[#3d4152]">Add New Address</h4>
                                        <div className="flex gap-2">
                                            {['HOME', 'WORK', 'OTHER'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewAddress({ ...newAddress, type })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        newAddress.type === type
                                                            ? 'bg-[#3d4152] text-white'
                                                            : 'bg-white text-[#3d4152] border border-gray-200'
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
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
                                            <button 
                                                type="submit" 
                                                className="px-6 py-3 bg-[#60b246] hover:bg-[#48a832] text-white font-bold text-sm uppercase rounded-lg transition-colors"
                                            >
                                                Save Address
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddAddress(false)}
                                                className="px-6 py-3 bg-white text-[#3d4152] font-bold text-sm uppercase rounded-lg border border-gray-200 transition-colors hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setShowAddAddress(true)}
                                        className="mt-4 flex items-center gap-2 text-[#fc8019] font-bold text-sm hover:text-[#e67309] transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New Address
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Delivery Instructions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#3d4152] mb-4">Delivery Instructions (Optional)</h3>
                            <textarea
                                value={deliveryInstructions}
                                onChange={(e) => setDeliveryInstructions(e.target.value)}
                                placeholder="E.g., Leave at door, call on arrival..."
                                className="input-field h-24 resize-none"
                            />
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm sticky top-24 overflow-hidden">
                            {/* Restaurant Info */}
                            <div className="p-5 border-b border-gray-100 flex items-center gap-4">
                                <img
                                    src={restaurant?.imageUrl || 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100/placeholder'}
                                    alt={restaurant?.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-[#3d4152]">{restaurant?.name}</h4>
                                    <p className="text-xs text-[#7e808c]">{restaurant?.city}</p>
                                </div>
                            </div>

                            {/* Items Summary */}
                            <div className="p-5 border-b border-gray-100 max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-2">
                                        <span className="text-[#7e808c]">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="text-[#3d4152] font-medium">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bill Details */}
                            <div className="p-5">
                                <h4 className="font-bold text-[#3d4152] mb-4">Bill Details</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#686b78]">Item Total</span>
                                        <span className="text-[#3d4152]">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#686b78]">Delivery Fee</span>
                                        <span className="text-[#3d4152]">₹{deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#686b78]">Platform fee</span>
                                        <span className="text-[#3d4152]">₹{platformFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#686b78]">GST and Charges</span>
                                        <span className="text-[#3d4152]">₹{gstAndCharges.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <div className="flex justify-between font-bold">
                                            <span className="text-[#3d4152]">TO PAY</span>
                                            <span className="text-[#3d4152]">₹{total.toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading || !selectedAddress}
                                    className="w-full mt-6 py-4 bg-[#60b246] hover:bg-[#48a832] text-white font-bold text-sm uppercase rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay ₹${total.toFixed(0)}`
                                    )}
                                </button>

                                <p className="text-xs text-[#93959f] mt-3 text-center">
                                    Secured by Razorpay
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
