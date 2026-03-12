import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LogIn, User as UserIcon, GraduationCap, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Footer from '../components/Footer';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', formData);
            login(data);
            toast.success(`Welcome back, ${data.name}!`);
            navigate(data.role === 'TEACHER' ? '/teacher' : '/dashboard');
        } catch (error) {
            toast.error(error.response?.data || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const tryAsGuest = () => {
        login(null); // Explicitly ensure no registered user
        toast.info('Browsing as Guest');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="max-w-[1600px] mx-auto mt-12 px-6 flex-grow flex justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card shadow-2xl space-y-8 w-full max-w-md"
                >
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-4 bg-primary/10 rounded-2xl text-primary mb-2">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Log in to access your StudyVault</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/')}
                                className="w-1/3 py-4 text-lg"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 py-4 text-lg" disabled={loading}>
                                {loading ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 font-medium tracking-widest">Or</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="secondary" onClick={tryAsGuest} className="flex items-center justify-center gap-2">
                            Try as Guest
                        </Button>
                    </div>

                    <div className="text-center space-y-3">
                        <p className="text-sm text-slate-500">Don't have an account?</p>
                        <Link to="/signup">
                            <Button variant="accent1" className="w-full py-3">Create Free Account</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
