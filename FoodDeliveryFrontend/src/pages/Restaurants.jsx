import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { restaurantService } from '../services';
import { RestaurantCard, LoadingSkeleton } from '../components';

export default function Restaurants() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        cuisine: searchParams.get('cuisine') || '',
        sortBy: 'rating',
        sortDir: 'desc',
    });
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadRestaurants();
    }, [filters]);

    const loadRestaurants = async (resetPage = true) => {
        setLoading(true);
        try {
            const currentPage = resetPage ? 0 : page;
            let response;

            if (searchQuery) {
                response = await restaurantService.search(searchQuery, currentPage, 12);
            } else if (filters.cuisine) {
                response = await restaurantService.getByCuisine(filters.cuisine, currentPage, 12);
            } else {
                response = await restaurantService.getAll(currentPage, 12, filters.sortBy, filters.sortDir);
            }

            const data = response.data;
            if (resetPage) {
                setRestaurants(data.content || data || []);
                setPage(0);
            } else {
                setRestaurants((prev) => [...prev, ...(data.content || data || [])]);
            }
            setHasMore(!data.last);
        } catch (error) {
            console.error('Error loading restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams(searchQuery ? { search: searchQuery } : {});
        loadRestaurants();
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        if (key === 'cuisine') {
            setSearchParams(value ? { cuisine: value } : {});
        }
    };

    const clearFilters = () => {
        setFilters({ cuisine: '', sortBy: 'rating', sortDir: 'desc' });
        setSearchQuery('');
        setSearchParams({});
    };

    const loadMore = () => {
        setPage((prev) => prev + 1);
        loadRestaurants(false);
    };

    const cuisines = ['Pizza', 'Burgers', 'Biryani', 'Chinese', 'Indian', 'Italian', 'Mexican', 'Desserts'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 w-full">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search restaurants or cuisines..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </form>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl animate-fade-in">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                                    <select
                                        value={filters.cuisine}
                                        onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="">All Cuisines</option>
                                        {cuisines.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="rating">Rating</option>
                                        <option value="name">Name</option>
                                        <option value="deliveryTime">Delivery Time</option>
                                    </select>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="mt-5 flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
                                >
                                    <X className="w-4 h-4" />
                                    Clear filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filters */}
            {(filters.cuisine || searchQuery) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Showing results for:</span>
                        {searchQuery && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                                "{searchQuery}"
                                <button onClick={() => { setSearchQuery(''); loadRestaurants(); }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.cuisine && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                                {filters.cuisine}
                                <button onClick={() => handleFilterChange('cuisine', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {filters.cuisine ? `${filters.cuisine} Restaurants` : 'All Restaurants'}
                </h1>

                {loading && restaurants.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <LoadingSkeleton type="card" count={6} />
                    </div>
                ) : restaurants.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500 mb-4">No restaurants found</p>
                        <button onClick={clearFilters} className="btn-primary">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="btn-outline px-8"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
