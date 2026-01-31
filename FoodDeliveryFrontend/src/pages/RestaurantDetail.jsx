import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { restaurantService, menuService } from '../services';
import { MenuItemCard, LoadingSkeleton } from '../components';
import { useCart } from '../context/CartContext';

export default function RestaurantDetail() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState({});
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
            
            // Expand all categories by default
            const categories = [...new Set((menuRes.data || []).map(item => item.categoryName || 'Other'))];
            const expanded = {};
            categories.forEach(cat => { expanded[cat] = true; });
            setExpandedCategories(expanded);
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

    const groupedItems = filteredItems.reduce((acc, item) => {
        const category = item.categoryName || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const rating = restaurant?.rating || 4.0;
    const ratingColor = rating >= 4 ? 'bg-[#48c479]' : rating >= 3 ? 'bg-[#db7c38]' : 'bg-[#e23744]';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f1f6]">
                <div className="max-w-[800px] mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                        <div className="bg-white rounded-3xl p-6 mb-6">
                            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <LoadingSkeleton type="menuItem" count={5} />
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-[#f1f1f6] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#3d4152] mb-2">Restaurant not found</h2>
                    <p className="text-[#686b78] mb-6">The restaurant you're looking for doesn't exist</p>
                    <Link to="/restaurants" className="btn-primary">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f1f6]">
            <div className="max-w-[800px] mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-[#93959f] mb-4">
                    <Link to="/" className="hover:text-[#fc8019]">Home</Link>
                    <span>/</span>
                    <Link to="/restaurants" className="hover:text-[#fc8019]">Mumbai</Link>
                    <span>/</span>
                    <span className="text-[#3d4152]">{restaurant.name}</span>
                </div>

                {/* Restaurant Header Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#3d4152] mb-2">{restaurant.name}</h1>
                            <p className="text-[#7e808c] text-sm mb-1">{restaurant.cuisine}</p>
                            <p className="text-[#7e808c] text-sm">{restaurant.address || `${restaurant.city}`}</p>
                        </div>
                        
                        {/* Rating Box */}
                        <div className="text-center border border-gray-100 rounded-lg p-3 min-w-[80px]">
                            <div className={`${ratingColor} text-white font-bold text-lg rounded-md py-1 px-2 mb-1 flex items-center justify-center gap-1`}>
                                <Star className="w-4 h-4 fill-current" />
                                {rating.toFixed(1)}
                            </div>
                            <p className="text-[11px] text-[#8b8d97] font-bold">{restaurant.totalRatings || '100'}+ ratings</p>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-dashed border-gray-200">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#3d4152]" />
                            <div>
                                <p className="text-sm font-bold text-[#3d4152]">{restaurant.deliveryTime || '25-30 mins'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#3d4152] text-lg font-bold">₹</span>
                            <div>
                                <p className="text-sm font-bold text-[#3d4152]">
                                    {restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee || 30} Delivery fee`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Closed Banner */}
                    {!restaurant.isOpen && (
                        <div className="mt-4 px-4 py-3 bg-[#fffae6] border border-[#f5e9c0] rounded-lg">
                            <p className="text-sm text-[#686b78]">
                                <span className="font-bold text-[#3d4152]">Currently not accepting orders.</span> Opens at 9:00 AM tomorrow
                            </p>
                        </div>
                    )}
                </div>

                {/* Menu Divider */}
                <div className="flex items-center justify-center my-8">
                    <div className="flex-1 h-px bg-gradient-to-l from-gray-300 to-transparent"></div>
                    <span className="px-4 text-xs text-[#7e808c] tracking-[4px] font-medium">MENU</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                {/* Search and Filters */}
                <div className="bg-[#e9e9eb] rounded-xl p-3 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#93959f]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for dishes"
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-[#3d4152] placeholder:text-[#93959f] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setFilter('veg')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            filter === 'veg'
                                ? 'bg-[#0f8a65] text-white border-[#0f8a65]'
                                : 'bg-white text-[#3d4152] border-[#e9e9eb] hover:border-[#0f8a65]'
                        }`}
                    >
                        <span className="w-3 h-3 border-2 border-current rounded-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                        </span>
                        Pure Veg
                    </button>
                    <button
                        onClick={() => setFilter('bestseller')}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            filter === 'bestseller'
                                ? 'bg-[#3d4152] text-white border-[#3d4152]'
                                : 'bg-white text-[#3d4152] border-[#e9e9eb] hover:border-[#3d4152]'
                        }`}
                    >
                        Bestseller
                    </button>
                    {filter !== 'all' && (
                        <button
                            onClick={() => setFilter('all')}
                            className="px-4 py-2 text-sm text-[#fc8019] font-medium hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Menu Categories */}
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium text-[#3d4152]">No items found</p>
                        <p className="text-sm text-[#93959f]">Try searching for something else</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        {Object.entries(groupedItems).map(([category, categoryItems]) => (
                            <div key={category} className="border-b border-gray-100 last:border-0">
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-[#3d4152]">
                                        {category} ({categoryItems.length})
                                    </h3>
                                    {expandedCategories[category] ? (
                                        <ChevronUp className="w-6 h-6 text-[#3d4152]" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-[#3d4152]" />
                                    )}
                                </button>

                                {/* Category Items */}
                                {expandedCategories[category] && (
                                    <div className="px-6">
                                        {categoryItems.map((item) => (
                                            <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Spacer for cart */}
                {getItemCount() > 0 && <div className="h-24"></div>}
            </div>

            {/* Fixed Cart Bar */}
            {getItemCount() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="max-w-[800px] mx-auto px-4 pb-4">
                        <Link
                            to="/cart"
                            className="flex items-center justify-between bg-[#60b246] text-white px-6 py-4 rounded-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] hover:bg-[#48a832] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-bold">{getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}</span>
                                <span className="text-white/80">|</span>
                                <span className="font-bold">₹{getSubtotal().toFixed(0)}</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold uppercase text-sm">
                                View Cart
                                <span className="text-lg">→</span>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
