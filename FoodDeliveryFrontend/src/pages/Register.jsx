import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            success('Account created successfully!');
            navigate('/');
        } catch (err) {
            error(err.response?.data?.message || 'Registration failed');
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
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop"
                        alt="Delicious pizza"
                        className="w-full max-w-sm mx-auto mb-8 rounded-2xl shadow-2xl"
                    />
                    <h2 className="text-4xl font-extrabold text-white mb-4">
                        Join Zwiggy today
                    </h2>
                    <p className="text-white/80 text-lg">
                        Get access to exclusive offers and lightning fast delivery
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="inline-block mb-8">
                        <span className="text-3xl font-black text-[#fc8019]">Zwiggy</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#3d4152] mb-2">Sign up</h1>
                        <p className="text-[#7e808c]">
                            or{' '}
                            <Link to="/login" className="text-[#fc8019] font-medium hover:underline">
                                login to your account
                            </Link>
                        </p>
                    </div>

                    {/* Decorative Line */}
                    <div className="w-8 h-0.5 bg-[#3d4152] mb-8"></div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full px-4 py-4 border border-gray-300 rounded-none text-[#3d4152] placeholder:text-[#93959f] focus:border-[#fc8019] focus:outline-none transition-colors"
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-4 border border-gray-300 rounded-none text-[#3d4152] placeholder:text-[#93959f] focus:border-[#fc8019] focus:outline-none transition-colors"
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            className="w-full px-4 py-4 border border-gray-300 rounded-none text-[#3d4152] placeholder:text-[#93959f] focus:border-[#fc8019] focus:outline-none transition-colors"
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
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

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="w-full px-4 py-4 border border-gray-300 rounded-none text-[#3d4152] placeholder:text-[#93959f] focus:border-[#fc8019] focus:outline-none transition-colors"
                            required
                        />

                        <div className="flex items-start gap-3 py-2">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 text-[#fc8019] border-gray-300 rounded focus:ring-[#fc8019]"
                            />
                            <span className="text-sm text-[#7e808c]">
                                I agree to the{' '}
                                <a href="#" className="text-[#3d4152] font-medium">Terms of Service</a>{' '}
                                and{' '}
                                <a href="#" className="text-[#3d4152] font-medium">Privacy Policy</a>
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#fc8019] hover:bg-[#e67309] text-white font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader className="w-5 h-5 animate-spin" />}
                            {loading ? 'Creating account...' : 'Continue'}
                        </button>
                    </form>

                    {/* Already have account */}
                    <p className="mt-6 text-center text-[#7e808c]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#fc8019] font-medium hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
