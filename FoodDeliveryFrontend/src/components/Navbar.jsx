import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, User, ChevronDown, MapPin, Menu, X, HelpCircle, Percent, Briefcase } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowUserMenu(false);
    };

    const isHomePage = location.pathname === '/';

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-white shadow-[0_15px_40px_-20px_rgba(40,44,63,0.15)]' : 'bg-transparent'}`}>
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Left section - Logo and Location */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-black tracking-tight">
                                <span className="text-[#fc8019]">Zwiggy</span>
                            </span>
                        </Link>

                        {/* Location - Desktop */}
                        <div className="hidden lg:flex items-center gap-2 group cursor-pointer">
                            <MapPin className="w-5 h-5 text-[#fc8019]" strokeWidth={2.5} />
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-[#3d4152] border-b-2 border-[#3d4152] group-hover:text-[#fc8019] group-hover:border-[#fc8019] transition-colors">
                                    Mumbai
                                </span>
                                <span className="text-sm text-[#686b78] max-w-[200px] truncate">
                                    Maharashtra, India
                                </span>
                                <ChevronDown className="w-4 h-4 text-[#fc8019]" />
                            </div>
                        </div>
                    </div>

                    {/* Right section - Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {/* Search */}
                        <Link 
                            to="/restaurants" 
                            className="flex items-center gap-3 text-[#3d4152] hover:text-[#fc8019] transition-colors group"
                        >
                            <Search className="w-5 h-5" strokeWidth={2} />
                            <span className="font-medium text-base">Search</span>
                        </Link>

                        {/* Offers */}
                        <Link 
                            to="/restaurants" 
                            className="flex items-center gap-3 text-[#3d4152] hover:text-[#fc8019] transition-colors"
                        >
                            <Percent className="w-5 h-5" strokeWidth={2} />
                            <span className="font-medium text-base">Offers</span>
                        </Link>

                        {/* Help */}
                        <div className="flex items-center gap-3 text-[#3d4152] hover:text-[#fc8019] transition-colors cursor-pointer">
                            <HelpCircle className="w-5 h-5" strokeWidth={2} />
                            <span className="font-medium text-base">Help</span>
                        </div>

                        {/* Sign In / User Menu */}
                        {isAuthenticated ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 text-[#3d4152] hover:text-[#fc8019] transition-colors"
                                >
                                    <User className="w-5 h-5" strokeWidth={2} />
                                    <span className="font-medium text-base">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-[0_15px_40px_-8px_rgba(40,44,63,0.25)] border border-gray-100 py-2 animate-slide-down">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-bold text-[#3d4152]">{user?.name}</p>
                                            <p className="text-xs text-[#93959f]">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-3 text-[#3d4152] hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            <span className="font-medium">Orders</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-[#3d4152] hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="flex items-center gap-3 text-[#3d4152] hover:text-[#fc8019] transition-colors"
                            >
                                <User className="w-5 h-5" strokeWidth={2} />
                                <span className="font-medium text-base">Sign In</span>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link 
                            to="/cart" 
                            className="flex items-center gap-3 text-[#3d4152] hover:text-[#fc8019] transition-colors relative"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#fc8019] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                            <span className="font-medium text-base">Cart</span>
                        </Link>
                    </div>

                    {/* Mobile - Cart & Menu */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-[#3d4152]" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#fc8019] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-[#3d4152]"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
                        {/* Location */}
                        <div className="flex items-center gap-3 px-2 py-3 mb-2">
                            <MapPin className="w-5 h-5 text-[#fc8019]" />
                            <div>
                                <p className="font-bold text-sm text-[#3d4152]">Mumbai</p>
                                <p className="text-xs text-[#93959f]">Maharashtra, India</p>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <Link 
                                to="/" 
                                className="flex items-center gap-3 px-2 py-3 text-[#3d4152] hover:bg-gray-50 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="font-medium">Home</span>
                            </Link>
                            <Link 
                                to="/restaurants" 
                                className="flex items-center gap-3 px-2 py-3 text-[#3d4152] hover:bg-gray-50 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                <Search className="w-5 h-5" />
                                <span className="font-medium">Search</span>
                            </Link>
                            
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        to="/orders" 
                                        className="flex items-center gap-3 px-2 py-3 text-[#3d4152] hover:bg-gray-50 rounded-lg"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        <span className="font-medium">Orders</span>
                                    </Link>
                                    <button 
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="w-full flex items-center gap-3 px-2 py-3 text-[#fc8019] hover:bg-gray-50 rounded-lg"
                                    >
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="flex items-center gap-3 px-2 py-3 text-[#3d4152] hover:bg-gray-50 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Sign In</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
