import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
    const rating = restaurant.rating || 4.0;
    const ratingColor = rating >= 4 ? 'bg-[#48c479]' : rating >= 3 ? 'bg-[#db7c38]' : 'bg-[#e23744]';
    
    return (
        <Link to={`/restaurants/${restaurant.id}`} className="block group">
            <div className="relative overflow-hidden">
                {/* Image Container with fixed height */}
                <div className="relative w-full h-40 sm:h-44 overflow-hidden rounded-2xl bg-gray-100">
                    <img
                        src={restaurant.imageUrl || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=280&fit=crop`}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=280&fit=crop`; }}
                    />
                    
                    {/* Gradient Overlay at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Offer Tag */}
                    {restaurant.deliveryFee === 0 && (
                        <div className="absolute bottom-2 left-2">
                            <p className="text-white text-sm font-extrabold tracking-tight">
                                FREE DELIVERY
                            </p>
                        </div>
                    )}
                    
                    {/* Closed Overlay */}
                    {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-white/90 text-sm font-bold">Currently closed</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="pt-2 pb-1">
                    {/* Name and Rating Row */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base text-[#3d4152] leading-tight truncate group-hover:text-[#fc8019] transition-colors">
                            {restaurant.name}
                        </h3>
                        <div className={`flex items-center gap-0.5 ${ratingColor} text-white px-1 py-0.5 rounded text-xs font-bold flex-shrink-0`}>
                            <span>{rating.toFixed(1)}</span>
                            <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                    </div>

                    {/* Cuisine */}
                    <p className="text-[#686b78] text-sm truncate mt-0.5">
                        {restaurant.cuisine}
                    </p>
                    
                    {/* Delivery Time and Location */}
                    <div className="flex items-center gap-1 mt-0.5 text-[#686b78] text-sm">
                        <span>{restaurant.deliveryTime || '25-30 mins'}</span>
                        <span className="mx-1">•</span>
                        <span>{restaurant.city}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
