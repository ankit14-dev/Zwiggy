import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Star, Clock, Truck } from 'lucide-react';
import { restaurantService, categoryService } from '../services';
import { RestaurantCard, LoadingSkeleton } from '../components';

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [restaurantsRes, categoriesRes] = await Promise.all([
                restaurantService.getTopRated(6),
                categoryService.getAll(),
            ]);
            setRestaurants(restaurantsRes.data || []);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white py-20">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                            Delicious food,<br />delivered fast 🍕
                        </h1>
                        <p className="text-lg md:text-xl mb-8 opacity-90">
                            Order from your favorite restaurants and get it delivered to your doorstep
                        </p>

                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your delivery location"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:ring-2 focus:ring-orange-300 outline-none"
                                />
                            </div>
                            <Link
                                to="/restaurants"
                                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                                Find Food
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute right-0 bottom-0 opacity-20">
                    <div className="text-9xl">🍔🍕🌮</div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-xl">
                            <div className="p-3 bg-orange-500 rounded-full">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
                                <p className="text-sm text-gray-600">Under 30 minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-green-50 rounded-xl">
                            <div className="p-3 bg-green-500 rounded-full">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Top Restaurants</h3>
                                <p className="text-sm text-gray-600">Best rated places</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl">
                            <div className="p-3 bg-blue-500 rounded-full">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Live Tracking</h3>
                                <p className="text-sm text-gray-600">Real-time updates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">What's on your mind?</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/restaurants?cuisine=${cat.name}`}
                                    className="flex flex-col items-center gap-2 min-w-[100px] p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="text-4xl">{getCategoryEmoji(cat.name)}</div>
                                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Top Restaurants */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Top Restaurants Near You</h2>
                        <Link
                            to="/restaurants"
                            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                        >
                            See all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <LoadingSkeleton type="card" count={6} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
                    <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                        Browse hundreds of restaurants and get your favorite food delivered in minutes
                    </p>
                    <Link
                        to="/restaurants"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        Browse Restaurants
                    </Link>
                </div>
            </section>
        </div>
    );
}

function getCategoryEmoji(name) {
    const emojis = {
        Pizza: '🍕',
        Burgers: '🍔',
        Biryani: '🍚',
        Chinese: '🥡',
        Desserts: '🍰',
        Italian: '🍝',
        Indian: '🍛',
        Mexican: '🌮',
    };
    return emojis[name] || '🍽️';
}
