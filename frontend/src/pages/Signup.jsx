import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UserPlus, User as UserIcon, GraduationCap, BadgeCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Footer from '../components/Footer';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/signup', formData);
            login(data);
            toast.success('Account created successfully! Welcome to StudyVault.');
            navigate(data.role === 'TEACHER' ? '/teacher' : '/dashboard');
        } catch (error) {
            toast.error(error.response?.data || 'Email already exists');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="max-w-[1600px] mx-auto mt-12 px-6 flex-grow flex justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card shadow-2xl space-y-6 w-full max-w-md"
                >
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-4 bg-accent1/10 rounded-2xl text-accent1 mb-2">
                            <UserPlus size={32} />
                        </div>
                        <h1 className="text-3xl font-bold">Join StudyVault</h1>
                        <p className="text-slate-500 dark:text-slate-400">Create your account to start learning</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'STUDENT'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-500'
                                    }`}
                            >
                                <GraduationCap size={24} />
                                <span className="font-bold text-xs uppercase tracking-wider">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'TEACHER' })}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'TEACHER'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-500'
                                    }`}
                            >
                                <BadgeCheck size={24} />
                                <span className="font-bold text-xs uppercase tracking-wider">Teacher</span>
                            </button>
                        </div>

                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
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

                        <div className="flex gap-3 mt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/')}
                                className="w-1/3 py-4 text-lg"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="accent1" className="flex-1 py-4 text-lg" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Sign Up Now'}
                            </Button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
