import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, BookOpen, GraduationCap, LayoutDashboard, Filter, Upload } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import Button from './Button';

const Navbar = () => {
    const { user, logout, isGuest } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const isTeacher = user?.role === 'TEACHER';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Study<span className="text-primary">Vault</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user || isGuest() ? (
                        <div className="flex items-center gap-1 sm:gap-4">
                            <div className="hidden md:flex items-center gap-2">
                                <Link to={isTeacher ? '/teacher' : '/dashboard'}>
                                    <Button variant="ghost" className="flex items-center gap-2 px-4 py-2.5">
                                        <LayoutDashboard size={20} />
                                        {isTeacher ? 'Panel' : 'Dashboard'}
                                    </Button>
                                </Link>
                                <Link to="/materials">
                                    <Button variant="ghost" className="flex items-center gap-2 px-4 py-2.5">
                                        <BookOpen size={20} />
                                        Materials
                                    </Button>
                                </Link>
                                <Link to="/quizzes">
                                    <Button variant="ghost" className="flex items-center gap-2 px-4 py-2.5">
                                        <GraduationCap size={20} />
                                        Quizzes
                                    </Button>
                                </Link>
                                {isTeacher && (
                                    <Link to="/upload">
                                        <Button className="flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                            <Upload size={20} />
                                            Upload
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block mx-2"></div>

                            <div className="flex items-center gap-3">
                                {user ? (
                                    <>
                                        <div className="flex flex-col items-end hidden lg:flex">
                                            <span className="text-sm font-semibold">{user.name}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">{user.role}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login">
                                        <Button size="sm">Join Now</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button>Sign Up Now</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
