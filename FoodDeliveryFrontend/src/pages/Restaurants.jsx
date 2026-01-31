import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
import { restaurantService } from '../services';
import { RestaurantCard, LoadingSkeleton } from '../components';

const filterOptions = [
    { id: 'fast-delivery', label: 'Fast Delivery' },
    { id: 'new', label: 'New on Zwiggy' },
    { id: 'ratings', label: 'Ratings 4.0+' },
    { id: 'pure-veg', label: 'Pure Veg' },
    { id: 'offers', label: 'Offers' },
    { id: 'price-300-600', label: 'Rs. 300-Rs. 600' },
    { id: 'price-under-300', label: 'Less than Rs. 300' },
];

const cuisineOptions = ['Pizza', 'Burgers', 'Biryani', 'Chinese', 'Indian', 'Italian', 'Mexican', 'Desserts', 'North Indian', 'South Indian'];

const sortOptions = [
    { value: 'relevance', label: 'Relevance (Default)' },
    { value: 'rating', label: 'Rating' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'costLowToHigh', label: 'Cost: Low to High' },
    { value: 'costHighToLow', label: 'Cost: High to Low' },
];

export default function Restaurants() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [activeFilters, setActiveFilters] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
    const [sortBy, setSortBy] = useState('relevance');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadRestaurants();
    }, [selectedCuisine, sortBy, activeFilters]);

    const loadRestaurants = async (resetPage = true) => {
        setLoading(true);
        try {
            const currentPage = resetPage ? 0 : page;
            let response;

            if (searchQuery) {
                response = await restaurantService.search(searchQuery, currentPage, 12);
            } else if (selectedCuisine) {
                response = await restaurantService.getByCuisine(selectedCuisine, currentPage, 12);
            } else {
                const sortField = sortBy === 'relevance' ? 'rating' : sortBy;
                const sortDir = sortBy === 'costLowToHigh' ? 'asc' : 'desc';
                response = await restaurantService.getAll(currentPage, 12, sortField, sortDir);
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

    const toggleFilter = (filterId) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    const handleCuisineSelect = (cuisine) => {
        if (selectedCuisine === cuisine) {
            setSelectedCuisine('');
            setSearchParams({});
        } else {
            setSelectedCuisine(cuisine);
            setSearchParams({ cuisine });
        }
    };

    const clearAllFilters = () => {
        setActiveFilters([]);
        setSelectedCuisine('');
        setSearchQuery('');
        setSearchParams({});
        setSortBy('relevance');
    };

    const loadMore = () => {
        setPage((prev) => prev + 1);
        loadRestaurants(false);
    };

    const hasActiveFilters = activeFilters.length > 0 || selectedCuisine || searchQuery;

    return (
        <div className="min-h-screen bg-white">
            {/* Search Header */}
            <div className="bg-white border-b border-gray-100 sticky top-20 z-30">
                <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#93959f]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for restaurants and food"
                            className="search-swiggy w-full pl-12 pr-10 py-3.5 bg-[#f1f1f6] rounded-xl border-0 focus:bg-white focus:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(''); loadRestaurants(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#93959f] hover:text-[#3d4152]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
                {/* Page Title */}
                <h1 className="section-header mb-6">
                    {selectedCuisine
                        ? `${selectedCuisine} Restaurants`
                        : searchQuery
                            ? `Search results for "${searchQuery}"`
                            : 'Restaurants with online food delivery in Mumbai'
                    }
                </h1>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                    {/* Filter Button */}
                    <button className="filter-chip flex-shrink-0">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className={`filter-chip ${sortBy !== 'relevance' ? 'filter-chip-active' : ''}`}
                        >
                            <span>Sort By</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        
                        {showSortMenu && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_15px_40px_-8px_rgba(40,44,63,0.25)] border border-gray-100 py-2 z-50 animate-slide-down">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setSortBy(option.value); setShowSortMenu(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'text-[#fc8019] font-medium' : 'text-[#3d4152]'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Filters */}
                    {filterOptions.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`filter-chip flex-shrink-0 ${activeFilters.includes(filter.id) ? 'filter-chip-active' : ''}`}
                        >
                            <span>{filter.label}</span>
                            {activeFilters.includes(filter.id) && <X className="w-3 h-3" />}
                        </button>
                    ))}
                </div>

                {/* Cuisine Pills */}
                <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                    {cuisineOptions.map((cuisine) => (
                        <button
                            key={cuisine}
                            onClick={() => handleCuisineSelect(cuisine)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex-shrink-0 ${
                                selectedCuisine === cuisine
                                    ? 'bg-[#3d4152] text-white border-[#3d4152]'
                                    : 'bg-white text-[#3d4152] border-[#e9e9eb] hover:border-[#3d4152]'
                            }`}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-sm text-[#686b78]">Active filters:</span>
                        {searchQuery && (
                            <span className="px-3 py-1 bg-[#fff4e6] text-[#db7c38] rounded-full text-sm font-medium flex items-center gap-1">
                                "{searchQuery}"
                                <button onClick={() => { setSearchQuery(''); loadRestaurants(); }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {selectedCuisine && (
                            <span className="px-3 py-1 bg-[#fff4e6] text-[#db7c38] rounded-full text-sm font-medium flex items-center gap-1">
                                {selectedCuisine}
                                <button onClick={() => handleCuisineSelect(selectedCuisine)}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-[#fc8019] font-medium hover:underline ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Restaurant Grid */}
                {loading && restaurants.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <LoadingSkeleton type="card" count={8} />
                    </div>
                ) : restaurants.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-16 h-16 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#3d4152] mb-2">No restaurants found</h3>
                        <p className="text-[#686b78] mb-6">Try adjusting your filters or search for something else</p>
                        <button onClick={clearAllFilters} className="btn-primary">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {restaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="px-12 py-3 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
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
