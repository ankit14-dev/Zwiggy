import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, ArrowLeft, Search } from 'lucide-react';
import { restaurantService, menuService } from '../services';
import { MenuItemCard, LoadingSkeleton } from '../components';
import { useCart } from '../context/CartContext';

export default function RestaurantDetail() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, veg, bestseller
    const { items, getSubtotal, getItemCount } = useCart();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [restaurantRes, menuRes] = await Promise.all([
                restaurantService.getById(id),
                menuService.getByRestaurant(id),
            ]);
            setRestaurant(restaurantRes.data);
            setMenuItems(menuRes.data || []);
        } catch (error) {
            console.error('Error loading restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'veg' && item.isVeg) ||
            (filter === 'bestseller' && item.isBestseller);
        return matchesSearch && matchesFilter;
    });

    // Group items by category
    const groupedItems = filteredItems.reduce((acc, item) => {
        const category = item.categoryName || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
                        <LoadingSkeleton type="menuItem" count={5} />
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-500 mb-4">Restaurant not found</p>
                    <Link to="/restaurants" className="btn-primary">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link
                        to="/restaurants"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to restaurants
                    </Link>
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        <img
                            src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                            alt={restaurant.name}
                            className="w-full md:w-64 h-48 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
                            <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-semibold">{restaurant.rating?.toFixed(1) || '4.0'}</span>
                                    <span>({restaurant.totalRatings || 0} ratings)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{restaurant.deliveryTime || '30-40 mins'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{restaurant.city}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm">{restaurant.address}</p>

                            {!restaurant.isOpen && (
                                <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg inline-block">
                                    Currently Closed
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search menu items..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('veg')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${filter === 'veg' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="w-3 h-3 border-2 border-current rounded-sm"></span>
                                Veg
                            </button>
                            <button
                                onClick={() => setFilter('bestseller')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'bestseller' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Bestseller
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">No items found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category}>
                                <div className="px-4 py-3 bg-gray-50 border-b">
                                    <h3 className="font-semibold text-gray-800">
                                        {category} ({items.length})
                                    </h3>
                                </div>
                                {items.map((item) => (
                                    <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Summary (Fixed at bottom) */}
            {getItemCount() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">
                                {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
                            </p>
                            <p className="text-sm text-gray-600">₹{getSubtotal().toFixed(2)} + taxes</p>
                        </div>
                        <Link to="/cart" className="btn-primary">
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
