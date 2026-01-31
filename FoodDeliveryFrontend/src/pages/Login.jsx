import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err) {
            error(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#fc8019] items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fc8019] to-[#e67309]"></div>
                <div className="relative z-10 text-center p-12">
                    <img 
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/seo/hero_image_web_new.png"
                        alt="Food"
                        className="w-full max-w-md mx-auto mb-8"
                    />
                    <h2 className="text-4xl font-extrabold text-white mb-4">
                        Order food you love
                    </h2>
                    <p className="text-white/80 text-lg">
                        Get your favorite meals delivered right to your doorstep
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="inline-block mb-8">
                        <span className="text-3xl font-black text-[#fc8019]">Zwiggy</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#3d4152] mb-2">Login</h1>
                        <p className="text-[#7e808c]">
                            or{' '}
                            <Link to="/register" className="text-[#fc8019] font-medium hover:underline">
                                create an account
                            </Link>
                        </p>
                    </div>

                    {/* Decorative Line */}
                    <div className="w-8 h-0.5 bg-[#3d4152] mb-8"></div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full px-4 py-4 border border-gray-300 rounded-none text-[#3d4152] placeholder:text-[#93959f] focus:border-[#fc8019] focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-4 border border-gray-300 rounded-none text-[#3d4152] placeholder:text-[#93959f] focus:border-[#fc8019] focus:outline-none transition-colors pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#93959f] hover:text-[#3d4152]"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader className="w-5 h-5 animate-spin" />}
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Terms */}
                    <p className="mt-4 text-xs text-[#93959f] leading-relaxed">
                        By clicking on Login, I accept the{' '}
                        <a href="#" className="text-[#3d4152]">Terms & Conditions</a> &{' '}
                        <a href="#" className="text-[#3d4152]">Privacy Policy</a>
                    </p>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-[#f1f1f6] rounded-lg">
                        <p className="text-xs font-bold text-[#3d4152] mb-2">Demo Credentials</p>
                        <div className="space-y-1 text-xs text-[#7e808c]">
                            <p>Customer: customer@test.com / customer123</p>
                            <p>Admin: admin@zwiggy.com / admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
