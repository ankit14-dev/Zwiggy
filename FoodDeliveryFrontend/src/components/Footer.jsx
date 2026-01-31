import { Link } from 'react-router-dom';

export default function Footer() {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];
    
    return (
        <footer className="bg-[#f0f0f5]">
            {/* Main Footer */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="inline-block">
                            <span className="text-2xl font-black text-[#3d4152]">Zwiggy</span>
                        </Link>
                        <p className="mt-4 text-sm text-[#686b78]">&copy; 2026 Zwiggy Limited</p>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-bold text-[#3d4152] uppercase tracking-wide mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Team
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold text-[#3d4152] uppercase tracking-wide mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Help & Support
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Partner with us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Ride with us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-bold text-[#3d4152] uppercase tracking-wide mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Life at Zwiggy */}
                    <div>
                        <h4 className="text-sm font-bold text-[#3d4152] uppercase tracking-wide mb-4">Life at Zwiggy</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Explore with Zwiggy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Zwiggy News
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-[#686b78] hover:text-[#fc8019] transition-colors">
                                    Snackables
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e9e9eb] my-10"></div>

                {/* Cities Section */}
                <div>
                    <h4 className="text-sm font-bold text-[#3d4152] uppercase tracking-wide mb-6">We deliver to:</h4>
                    <div className="flex flex-wrap gap-3">
                        {cities.map((city) => (
                            <span 
                                key={city}
                                className="px-4 py-2 bg-white border border-[#e9e9eb] rounded-lg text-sm text-[#686b78] hover:shadow-md hover:border-[#fc8019] transition-all cursor-pointer"
                            >
                                {city}
                            </span>
                        ))}
                        <span className="px-4 py-2 bg-white border border-[#e9e9eb] rounded-lg text-sm text-[#686b78] hover:shadow-md transition-all cursor-pointer">
                            + 200 more cities
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#e9e9eb] bg-white">
                <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#93959f]">
                            For better experience, download the Zwiggy app now
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="inline-block">
                                <img 
                                    src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png" 
                                    alt="Play Store" 
                                    className="h-10 object-contain"
                                />
                            </a>
                            <a href="#" className="inline-block">
                                <img 
                                    src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png" 
                                    alt="App Store" 
                                    className="h-10 object-contain"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
