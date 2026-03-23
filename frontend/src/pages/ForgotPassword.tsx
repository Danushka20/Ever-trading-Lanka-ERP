import { useState } from 'react';
import axios from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await axios.post('forgot-password', { email });
            setMessage('A password reset link has been sent to your email.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please check your email address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-[420px] shadow-2xl border-0">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                         <div className="p-3 bg-blue-600 rounded-2xl shadow-lg ring-4 ring-blue-100">
                           <KeyRound className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="pl-10 h-11 focus-visible:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        {message && (
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                                {error}
                            </div>
                        )}
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </div>
                            ) : 'Send Reset Link'}
                        </Button>
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="flex items-center justify-center w-full text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;

