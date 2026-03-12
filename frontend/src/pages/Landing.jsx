import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    ShieldCheck,
    GraduationCap,
    ArrowRight,
    Zap,
    FileText,
    Video,
    HelpCircle
} from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../store/AuthContext';
import Footer from '../components/Footer';

const Landing = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const tryAsGuest = () => {
        login(null);
        navigate('/dashboard');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="relative overflow-hidden min-h-screen flex flex-col">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10 blur-3xl rounded-full" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-[1600px] mx-auto space-y-24 py-12 flex-grow"
            >
                {/* Hero Section */}
                <section className="text-center space-y-8 relative">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                        <Zap size={16} />
                        <span>The Ultimate Study Companion</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
                        Master Your Studies with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent1">
                            StudyVault
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Access premium notes, PYQs, and interactive quizzes all in one place.
                        Designed for students, empowered by teachers.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link to="/signup">
                            <Button className="px-10 py-5 text-lg rounded-2xl flex items-center gap-3 group shadow-xl shadow-primary/20">
                                Get Started Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="secondary" onClick={tryAsGuest} className="px-10 py-5 text-lg rounded-2xl bg-white/50 backdrop-blur-md dark:bg-slate-900/50">
                            Try as Guest
                        </Button>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {[
                        {
                            icon: <FileText className="text-red-500" />,
                            title: "Smart Notes",
                            desc: "Hand-picked and verified study materials for every subject.",
                            color: "bg-red-500/10"
                        },
                        {
                            icon: <Video className="text-blue-500" />,
                            title: "Video Tutorials",
                            desc: "Curated YouTube content synchronized with your curriculum.",
                            color: "bg-blue-500/10"
                        },
                        {
                            icon: <HelpCircle className="text-purple-500" />,
                            title: "Interactive Quizzes",
                            desc: "Test your knowledge and track your progress in real-time.",
                            color: "bg-purple-500/10"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 line-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </section>

                {/* Role Showcasing Section */}
                <section className="bg-slate-950 text-white rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent1/20 blur-[100px] -z-0" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <motion.div variants={itemVariants} className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold">Built for the Modern Classroom</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <GraduationCap className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">For Students</h4>
                                        <p className="text-slate-400">Search materials, take quizzes, and boost your performance with a centralized vault.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent1/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="text-accent1" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">For Teachers</h4>
                                        <p className="text-slate-400">Upload materials, create quizzes, and manage resources for your students effortlessly.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="hidden md:block"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/30 to-accent1/30 backdrop-blur-3xl border border-white/10 p-2">
                                <div className="w-full h-full rounded-2xl bg-slate-900 overflow-hidden shadow-2xl">
                                    {/* Mock App UI */}
                                    <div className="h-4 bg-slate-800 w-full mb-4 px-2 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    </div>
                                    <div className="p-4 space-y-4 opacity-50">
                                        <div className="h-6 bg-slate-800 rounded w-1/2" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 bg-slate-800 rounded-xl" />
                                            <div className="h-32 bg-slate-800 rounded-xl" />
                                        </div>
                                        <div className="h-6 bg-slate-800 rounded w-3/4" />
                                        <div className="h-40 bg-slate-800 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="text-center py-12">
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h2 className="text-4xl font-bold">Ready to start your journey?</h2>
                        <div className="flex justify-center gap-4">
                            <Link to="/signup">
                                <Button className="px-8 py-4 rounded-xl">Create Free Account</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" className="px-8 py-4 rounded-xl">Sign In</Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </motion.div>
            <Footer />
        </div>
    );
};

export default Landing;
