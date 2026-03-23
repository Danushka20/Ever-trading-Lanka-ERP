import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/api';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
    const { login, token } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Redirect if already logged in
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('login', credentials);
            
            const { token, user } = response.data;
            
            login(token, user);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
            <div className="grid w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-3xl md:grid-cols-2 min-h-[600px]">
                {/* Brand / Illustration panel */}
                <div className="relative flex-col items-start justify-between hidden p-12 text-white md:flex bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-md">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase">GrowLedger</h2>
                                <p className="text-xs font-medium tracking-widest uppercase opacity-80 text-sky-100">Enterprise Resource Planning</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold leading-tight">
                                Manage your <br />
                                <span className="text-sky-200">Business</span> with <br />
                                Confidence.
                            </h1>
                            
                            <div className="w-full max-w-sm mt-8 transition-transform transform hover:scale-105">
                                <img src="/src/assets/erp.png" alt="ERP illustration" className="w-full border shadow-2xl rounded-2xl border-white/10 opacity-95" />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 p-4 border rounded-2xl bg-white/10 backdrop-blur-sm border-white/10">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-center w-10 h-10 text-xs font-bold text-blue-600 border-2 border-blue-600 rounded-full bg-slate-200">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium">Joined by 2,000+ businesses</p>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 -mb-32 -ml-32 rounded-full bg-sky-400/20 blur-3xl"></div>
                </div>

                {/* Form panel */}
                <div className="flex flex-col justify-center p-8 md:p-16">
                    <div className="mb-10">
                        <h3 className="mb-2 text-3xl font-bold text-slate-900">Sign In</h3>
                        <p className="text-slate-500">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute w-5 h-5 transition-colors left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="e.g. admin@growledger.com"
                                    required
                                    className="h-12 pl-12 transition-all border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-600 rounded-xl"
                                    value={credentials.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                                <a href="/forgot-password" title="Forgot Password" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute w-5 h-5 transition-colors left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    required
                                    className="h-12 pl-12 pr-12 transition-all border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-600 rounded-xl"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility} 
                                    className="absolute transition-colors right-4 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 text-sm font-medium text-red-700 border border-red-100 rounded-xl bg-red-50">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" className="w-5 h-5 transition-all border-2 rounded-md appearance-none checked:bg-blue-600 checked:border-blue-600 border-slate-300" />
                                    <div className="absolute text-white transition-opacity opacity-0 pointer-events-none check-icon">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                                <span className="text-sm font-medium transition-colors text-slate-600 group-hover:text-slate-900">Remember me for 30 days</span>
                            </label>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full h-14 text-base font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : 'Sign Into Dashboard'}
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-4 font-bold tracking-widest bg-white text-slate-400">Secure Access</span>
                            </div>
                        </div>
                    </form>

                    <p className="mt-8 text-sm font-medium text-center text-slate-500">
                        New to GrowLedger? <a href="/register" className="font-bold text-blue-600 hover:underline">Create an account</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

