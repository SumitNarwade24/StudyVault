import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Info } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';
import MaterialCard from '../components/MaterialCard';
import MaterialFilters from '../components/MaterialFilters';
import MaterialViewer from '../components/MaterialViewer';
import QuizViewer from '../components/QuizViewer';

import Footer from '../components/Footer';

const StudentDashboard = ({ initialTab }) => {
    const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        subjectId: null,
        type: null // Default to null for all types
    });

    useEffect(() => {
        setFilters({
            title: '',
            subjectId: null,
            type: initialTab === 'quizzes' ? 'QUIZ' : null
        });
    }, [initialTab]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            await Promise.all([fetchMaterials(), fetchQuizzes()]);
            setLoading(false);
        };

        const delayDebounceFn = setTimeout(fetchAll, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    const fetchInitialData = async () => {
        try {
            const { data } = await api.get('/subjects');
            setSubjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load subjects', error);
        }
    };

    const fetchMaterials = async () => {
        if (filters.type === 'QUIZ') {
            setMaterials([]);
            return;
        }
        try {
            const params = {};
            if (filters.title) params.title = filters.title;
            if (filters.subjectId) params.subjectId = filters.subjectId;
            if (filters.type) params.type = filters.type;

            const { data } = await api.get('/materials', { params });
            setMaterials(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch materials');
            setMaterials([]);
        }
    };

    const fetchQuizzes = async () => {
        // Show quizzes only if type is QUIZ or null (All Types)
        if (filters.type && filters.type !== 'QUIZ') {
            setQuizzes([]);
            return;
        }
        try {
            const params = {};
            if (filters.subjectId) params.subjectId = filters.subjectId;
            // Search by title for quizzes if possible (backend support needed, or filter locally)
            const { data } = await api.get('/quizzes', { params });
            let filteredQuizzes = Array.isArray(data) ? data : [];
            if (filters.title) {
                filteredQuizzes = filteredQuizzes.filter(q =>
                    q.title.toLowerCase().includes(filters.title.toLowerCase())
                );
            }
            setQuizzes(filteredQuizzes);
        } catch (error) {
            console.error('Failed to fetch quizzes', error);
            setQuizzes([]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/30 dark:bg-slate-950/30">
            <div className="max-w-[1600px] mx-auto px-6 w-full flex-grow py-12 min-h-screen">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Explore Materials</h1>
                        <p className="text-slate-500 dark:text-slate-400">Search and discover resources to boost your learning</p>
                        {!localStorage.getItem('user') && !sessionStorage.getItem('user') && (
                            <p className="text-sm text-primary font-bold mt-2 px-3 py-1 bg-primary/10 rounded-full inline-block italic">Browsing as Guest - Login to upload or track progress</p>
                        )}
                    </div>
                </div>

                <MaterialFilters
                    filters={filters}
                    setFilters={setFilters}
                    subjects={subjects}
                />

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="card h-64 relative overflow-hidden">
                                <div className="shimmer absolute inset-0 opacity-10"></div>
                                <div className="h-full flex flex-col gap-4">
                                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                                    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                    <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (materials.length > 0 || quizzes.length > 0) ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {materials.map(m => (
                                <MaterialCard
                                    key={m.id}
                                    material={m}
                                    onOpen={setSelectedMaterial}
                                />
                            ))}
                            {quizzes.map(q => {
                                const storageKey = user ? `completedQuizzes_${user.id}` : 'completedQuizzes_guest';
                                const completedQuizzes = JSON.parse(localStorage.getItem(storageKey) || '{}');
                                return (
                                    <MaterialCard
                                        key={`quiz-${q.id}`}
                                        material={{ ...q, type: 'QUIZ' }}
                                        isAttempted={!!completedQuizzes[q.id]}
                                        onOpen={setSelectedQuiz}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <Info size={48} className="mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-bold text-slate-400">No materials found</h2>
                        <p className="text-slate-500">Try adjusting your filters or search query</p>
                    </div>
                )}

                {selectedMaterial && (
                    <MaterialViewer
                        material={selectedMaterial}
                        onClose={() => setSelectedMaterial(null)}
                    />
                )}

                {selectedQuiz && (
                    <QuizViewer
                        quiz={selectedQuiz}
                        onClose={() => setSelectedQuiz(null)}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default StudentDashboard;
