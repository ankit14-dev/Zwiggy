import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
    return (
        <Link to={`/restaurants/${restaurant.id}`}>
            <div className="card group cursor-pointer">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                                Currently Closed
                            </span>
                        </div>
                    )}
                    {restaurant.deliveryFee === 0 && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Free Delivery
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-orange-500 transition-colors">
                            {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-sm font-semibold">{restaurant.rating?.toFixed(1) || '4.0'}</span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">{restaurant.cuisine}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.deliveryTime || '30-40 mins'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{restaurant.city}</span>
                        </div>
                    </div>

                    {restaurant.minOrder > 0 && (
                        <p className="text-xs text-gray-400 mt-2">
                            Min Order: ₹{restaurant.minOrder}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
