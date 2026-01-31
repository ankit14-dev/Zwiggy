import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurantService, categoryService } from '../services';
import { RestaurantCard, LoadingSkeleton } from '../components';

// Category images
const categoryImages = {
    Pizza: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_bau/banners_new/Pizza.png',
    Burgers: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029845/PC_Creative%20refresh/3D_bau/banners_new/Burger.png',
    Biryani: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029844/PC_Creative%20refresh/3D_bau/banners_new/Biryani.png',
    Chinese: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029848/PC_Creative%20refresh/3D_bau/banners_new/Chinese.png',
    Desserts: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029850/PC_Creative%20refresh/3D_bau/banners_new/Cakes.png',
    Italian: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_bau/banners_new/Pasta.png',
    Indian: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029858/PC_Creative%20refresh/3D_bau/banners_new/Thali.png',
    Mexican: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029854/PC_Creative%20refresh/3D_bau/banners_new/Momos.png',
};

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [restaurantsRes, categoriesRes] = await Promise.all([
                restaurantService.getTopRated(8),
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

    const scrollCategories = (direction) => {
        const container = document.getElementById('category-scroll');
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-[#171a29]">
                <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                                Hungry?
                            </h1>
                            <p className="text-gray-400 text-base md:text-lg mb-5">
                                Order food from favourite restaurants near you.
                            </p>
                            <Link
                                to="/restaurants"
                                className="inline-flex items-center gap-2 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold px-6 py-3 rounded-lg transition-colors"
                            >
                                Order Now
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
                                alt="Delicious food"
                                className="w-full max-w-sm rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* What's on your mind */}
            {categories.length > 0 && (
                <section className="py-6 bg-white border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-header">What's on your mind?</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scrollCategories('left')}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => scrollCategories('right')}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-700" />
                                </button>
                            </div>
                        </div>
                        <div
                            id="category-scroll"
                            className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
                        >
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/restaurants?cuisine=${cat.name}`}
                                    className="flex-shrink-0 w-20 md:w-24 transition-transform hover:scale-95"
                                >
                                    <img
                                        src={categoryImages[cat.name] || categoryImages.Indian}
                                        alt={cat.name}
                                        className="w-full h-24 md:h-28 object-cover rounded-lg"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Top Restaurant Chains */}
            <section className="py-6 bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-header">Top restaurant chains in Mumbai</h2>
                        <Link to="/restaurants" className="text-[#fc8019] font-bold text-sm hover:underline">
                            See all
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-40 bg-gray-200 rounded-xl mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {restaurants.slice(0, 4).map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* All Restaurants */}
            <section className="py-6 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="section-header mb-4">
                        Restaurants with online food delivery
                    </h2>

                    {/* Filter Chips */}
                    <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
                        <button className="filter-chip filter-chip-active">Relevance</button>
                        <button className="filter-chip">Delivery Time</button>
                        <button className="filter-chip">Rating</button>
                        <button className="filter-chip">Pure Veg</button>
                        <button className="filter-chip">Offers</button>
                        <button className="filter-chip">Rs. 300-Rs. 600</button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-40 bg-gray-200 rounded-xl mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {restaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            to="/restaurants"
                            className="inline-block px-8 py-3 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold rounded-lg transition-colors"
                        >
                            See all restaurants
                        </Link>
                    </div>
                </div>
            </section>

            {/* Best Places */}
            <section className="py-8 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="section-header mb-4">Best Places to Eat Across Cities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'].map((city) => (
                            <div
                                key={city}
                                className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 hover:shadow-md hover:border-[#fc8019] transition-all cursor-pointer"
                            >
                                Best Restaurants in {city}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
