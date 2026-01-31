import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4">🍔 Zwiggy</h3>
                        <p className="text-gray-400 mb-4">
                            Your favorite food, delivered fast. Order from the best restaurants near you.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-orange-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/restaurants" className="hover:text-orange-500 transition-colors">
                                    Restaurants
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="hover:text-orange-500 transition-colors">
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Partner with us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">
                                    Delivery Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Help & Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">FAQ</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-orange-500 transition-colors">Refund Policy</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span>Mumbai, Maharashtra, India</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-orange-500" />
                                <span>+91 1800-123-9999</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-orange-500" />
                                <span>support@zwiggy.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 Zwiggy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
