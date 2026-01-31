import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();
    const itemCount = getItemCount();

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowUserMenu(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-500">🍔 Zwiggy</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                            Home
                        </Link>
                        <Link to="/restaurants" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                            Restaurants
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 animate-fade-in">
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <Link to="/" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsOpen(false)}>
                                Home
                            </Link>
                            <Link to="/restaurants" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsOpen(false)}>
                                Restaurants
                            </Link>
                            <Link to="/cart" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                                onClick={() => setIsOpen(false)}>
                                Cart
                                {itemCount > 0 && (
                                    <span className="bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-1">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <hr />
                            {isAuthenticated ? (
                                <>
                                    <Link to="/orders" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                        onClick={() => setIsOpen(false)}>
                                        My Orders
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg text-left">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                        onClick={() => setIsOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/register" className="mx-4 btn-primary text-center"
                                        onClick={() => setIsOpen(false)}>
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
