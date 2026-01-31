import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Package, CheckCircle, XCircle, Truck, ChefHat, Loader } from 'lucide-react';
import { orderService } from '../services';
import { useToast } from '../context/ToastContext';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await orderService.getMyOrders(0, 20);
            setOrders(response.data?.content || []);
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            await orderService.cancel(orderId);
            success('Order cancelled');
            loadOrders();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PLACED':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'CONFIRMED':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'PREPARING':
                return <ChefHat className="w-5 h-5 text-orange-500" />;
            case 'OUT_FOR_DELIVERY':
                return <Truck className="w-5 h-5 text-purple-500" />;
            case 'DELIVERED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PLACED':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'PREPARING':
                return 'bg-orange-100 text-orange-800';
            case 'OUT_FOR_DELIVERY':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
                    <p className="text-gray-600 mb-6">Start ordering from your favorite restaurants</p>
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
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* Restaurant and Items */}
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                                        🍽️
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{order.restaurantName}</p>
                                        <p className="text-sm text-gray-500">
                                            {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="text-sm text-gray-600 mb-4">
                                    {order.items?.map((item, idx) => (
                                        <span key={item.id}>
                                            {item.menuItemName} × {item.quantity}
                                            {idx < order.items.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>

                                {/* Delivery Address */}
                                {order.deliveryAddress && (
                                    <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{order.deliveryAddress}</span>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <p className="font-bold text-gray-800">₹{order.totalAmount?.toFixed(2)}</p>
                                    <div className="flex gap-2">
                                        {(order.status === 'PLACED' || order.status === 'CONFIRMED') && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <Link
                                            to={`/restaurants/${order.restaurantId}`}
                                            className="px-4 py-2 text-sm text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                                        >
                                            Reorder
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
