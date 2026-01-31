import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Package, CheckCircle, XCircle, Truck, ChefHat, Loader, RotateCcw } from 'lucide-react';
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
            success('Order cancelled successfully');
            loadOrders();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'PLACED':
                return { 
                    icon: Clock, 
                    color: 'text-[#db7c38]', 
                    bgColor: 'bg-[#fff4e6]', 
                    label: 'Order Placed',
                    description: 'Waiting for restaurant to confirm'
                };
            case 'CONFIRMED':
                return { 
                    icon: CheckCircle, 
                    color: 'text-[#3f85f5]', 
                    bgColor: 'bg-blue-50', 
                    label: 'Confirmed',
                    description: 'Restaurant has accepted your order'
                };
            case 'PREPARING':
                return { 
                    icon: ChefHat, 
                    color: 'text-[#fc8019]', 
                    bgColor: 'bg-[#fff4e6]', 
                    label: 'Preparing',
                    description: 'Your food is being prepared'
                };
            case 'OUT_FOR_DELIVERY':
                return { 
                    icon: Truck, 
                    color: 'text-[#8e44ad]', 
                    bgColor: 'bg-purple-50', 
                    label: 'Out for Delivery',
                    description: 'Your order is on the way'
                };
            case 'DELIVERED':
                return { 
                    icon: CheckCircle, 
                    color: 'text-[#60b246]', 
                    bgColor: 'bg-[#e5f7e3]', 
                    label: 'Delivered',
                    description: 'Order delivered successfully'
                };
            case 'CANCELLED':
                return { 
                    icon: XCircle, 
                    color: 'text-[#e23744]', 
                    bgColor: 'bg-[#fce4e6]', 
                    label: 'Cancelled',
                    description: 'Order was cancelled'
                };
            default:
                return { 
                    icon: Package, 
                    color: 'text-[#686b78]', 
                    bgColor: 'bg-gray-100', 
                    label: status,
                    description: ''
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f1f6] flex items-center justify-center">
                <Loader className="w-10 h-10 animate-spin text-[#fc8019]" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#f1f1f6] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3d4152] mb-2">No orders yet</h2>
                    <p className="text-[#7e808c] mb-8">Looks like you haven't placed any orders</p>
                    <Link 
                        to="/restaurants" 
                        className="inline-block px-8 py-3 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-colors"
                    >
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f1f6]">
            <div className="max-w-[800px] mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#3d4152]">Your Orders</h1>
                    <p className="text-[#7e808c] text-sm mt-1">{orders.length} orders placed</p>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div 
                                key={order.id} 
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-5 border-b border-gray-100">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                <span className="text-3xl">🍽️</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#3d4152] text-lg">{order.restaurantName}</h3>
                                                <p className="text-sm text-[#7e808c] mt-1">
                                                    {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'} | ₹{order.totalAmount?.toFixed(0)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bgColor}`}>
                                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                            <span className={`text-xs font-bold ${statusConfig.color}`}>
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="p-5">
                                    {/* Items */}
                                    <div className="text-sm text-[#7e808c] mb-4">
                                        {order.items?.map((item, idx) => (
                                            <span key={item.id}>
                                                {item.menuItemName} × {item.quantity}
                                                {idx < order.items.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Order Info */}
                                    <div className="flex flex-wrap gap-4 text-xs text-[#93959f] mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[#7e808c]">Order #{order.orderNumber}</span>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {order.deliveryAddress && (
                                        <div className="flex items-start gap-2 text-sm text-[#7e808c] p-3 bg-[#f1f1f6] rounded-lg mb-4">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{order.deliveryAddress}</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                        {(order.status === 'PLACED' || order.status === 'CONFIRMED') && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="px-5 py-2.5 text-sm text-[#e23744] font-bold border-2 border-[#e23744] rounded-lg hover:bg-[#fce4e6] transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <Link
                                            to={`/restaurants/${order.restaurantId}`}
                                            className="px-5 py-2.5 text-sm text-[#fc8019] font-bold border-2 border-[#fc8019] rounded-lg hover:bg-[#fff4e6] transition-colors flex items-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Reorder
                                        </Link>
                                        <button className="px-5 py-2.5 text-sm text-[#3d4152] font-bold border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            Help
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
