import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent italic">
                                StudyVault
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                            Empowering students and teachers with a modern, high-performance study material hub. Your success begins here.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -3 }}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Explore Materials', 'Quizzes', 'Top Subjects', 'Recent Uploads'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Community</h4>
                        <ul className="space-y-4">
                            {['Become a Teacher', 'Study Groups', 'Forums', 'Student Stories'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-900 text-slate-400 text-sm">
                    <p>© 2026 StudyVault. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-4 md:mt-0">
                        Made with <Heart size={14} className="text-red-500 fill-red-500" /> for education
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
