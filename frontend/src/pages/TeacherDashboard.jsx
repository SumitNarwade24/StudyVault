import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Upload, Plus, Trash2, Edit, FileText, LayoutGrid, List } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import MaterialCard from '../components/MaterialCard';
import MaterialViewer from '../components/MaterialViewer';
import QuizCreator from '../components/QuizCreator';
import QuizViewer from '../components/QuizViewer';
import Footer from '../components/Footer';

const TeacherDashboard = ({ initialTab, showUploadDirectly }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(showUploadDirectly || false);
    const [showQuizCreator, setShowQuizCreator] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        type: 'PDF',
        subjectName: '',
        file: null,
        youtubeUrl: '' // For video type
    });

    useEffect(() => {
        fetchInitialData();
        fetchMyMaterials();
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (showUploadDirectly) {
            setShowUpload(true);
        }
    }, [showUploadDirectly]);

    useEffect(() => {
        if (initialTab === 'quizzes') {
            setShowQuizCreator(false);
        } else if (initialTab === 'materials') {
            setShowQuizCreator(false);
        }
    }, [initialTab]);

    const fetchInitialData = async () => {
        try {
            const { data } = await api.get('/subjects');
            setSubjects(Array.isArray(data) ? data : []);
        } catch (error) { }
    };

    const fetchMyMaterials = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/materials/my?userId=${user.id}`);
            setMaterials(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to load your materials');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizzes = async () => {
        try {
            const { data } = await api.get('/quizzes');
            setQuizzes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load quizzes', error);
            setQuizzes([]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.subjectName) return toast.error('Please enter a subject');

        const formData = new FormData();
        formData.append('title', uploadData.title);
        formData.append('description', uploadData.description);
        formData.append('type', uploadData.type);
        formData.append('subjectName', uploadData.subjectName);
        formData.append('userId', user.id);

        if (uploadData.type === 'VIDEO') {
            if (!uploadData.youtubeUrl) return toast.error('Please provide a YouTube URL');
            formData.append('file', new Blob([uploadData.youtubeUrl], { type: 'text/plain' }));
        } else {
            if (!uploadData.file) return toast.error('Please select a file');
            if (uploadData.file.type !== 'application/pdf' && !uploadData.file.name.toLowerCase().endsWith('.pdf')) {
                return toast.error('Only PDF files are allowed for this material type');
            }
            formData.append('file', uploadData.file);
        }

        try {
            await api.post('/materials/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Material uploaded successfully!');
            setShowUpload(false);
            clearForm();
            fetchMyMaterials();
        } catch (error) {
            toast.error('Upload failed. Using fallback simulation for demo.');
            const demoMaterial = {
                id: Date.now(),
                title: uploadData.title,
                description: uploadData.description,
                type: uploadData.type,
                filePath: uploadData.type === 'VIDEO' ? uploadData.youtubeUrl : 'demo.pdf'
            };
            setMaterials([demoMaterial, ...materials]);
            setShowUpload(false);
        }
    };

    const clearForm = () => {
        setUploadData({ title: '', description: '', type: 'PDF', subjectName: '', file: null, youtubeUrl: '' });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/materials/${id}`);
            setMaterials(materials.filter(m => m.id !== id));
            toast.success('Deleted successfully');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleDeleteQuiz = async (id) => {
        try {
            await api.delete(`/quizzes/${id}`);
            setQuizzes(quizzes.filter(q => q.id !== id));
            toast.success('Quiz deleted successfully');
        } catch (error) {
            toast.error('Failed to delete quiz');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/30 dark:bg-slate-950/30">
            <div className="max-w-[1600px] mx-auto px-6 w-full flex-grow py-12 min-h-screen">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Teacher Dashboard</h1>
                        <p className="text-slate-500 text-lg">Manage your study materials and student resources</p>
                        {user && <p className="text-sm text-primary font-bold mt-2 px-3 py-1 bg-primary/10 rounded-full inline-block">Logged in as: {user.name}</p>}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant={showQuizCreator ? "primary" : "secondary"}
                            onClick={() => setShowQuizCreator(!showQuizCreator)}
                            className="flex items-center gap-2 px-6 py-2.5 shadow-lg"
                        >
                            {showQuizCreator ? <List size={20} /> : <Plus size={20} />}
                            {showQuizCreator ? 'View My Materials' : 'Create New Quiz'}
                        </Button>
                        {!showQuizCreator && (
                            <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-primary/20">
                                <Upload size={20} />
                                Upload Material
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card h-48 shimmer opacity-10"></div>
                        <div className="card h-48 shimmer opacity-10"></div>
                        <div className="card h-48 shimmer opacity-10"></div>
                    </div>
                ) : showQuizCreator ? (
                    <QuizCreator
                        subjects={subjects}
                        onQuizCreated={() => {
                            setShowQuizCreator(false);
                            fetchQuizzes();
                        }}
                        onCancel={() => setShowQuizCreator(false)}
                    />
                ) : (materials?.length > 0 || quizzes?.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials?.map(m => (
                            <MaterialCard
                                key={m.id}
                                material={m}
                                onOpen={setSelectedMaterial}
                                showDelete={true}
                                onDelete={handleDelete}
                            />
                        ))}
                        {quizzes?.map(q => (
                            <MaterialCard
                                key={`quiz-${q.id}`}
                                material={{ ...q, type: 'QUIZ' }}
                                onOpen={setSelectedQuiz}
                                showDelete={true}
                                onDelete={() => handleDeleteQuiz(q.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <LayoutGrid size={48} className="mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-bold text-slate-400">No resources yet</h2>
                        <p className="text-slate-500">Click "Upload Material" or "Create Quiz" to get started</p>
                    </div>
                )}

                {/* Upload Modal */}
                <AnimatePresence>
                    {showUpload && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowUpload(false)}
                                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold mb-6">Upload New Resource</h2>
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <Input
                                        label="Title"
                                        placeholder="e.g. Intro to Quantum Mechanics"
                                        value={uploadData.title}
                                        onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium ml-1">Type</label>
                                            <select
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none"
                                                value={uploadData.type}
                                                onChange={e => setUploadData({ ...uploadData, type: e.target.value })}
                                            >
                                                <option value="PDF">PDF / Notes</option>
                                                <option value="PYQ">PYQ</option>
                                                <option value="BOOK">Book</option>
                                                <option value="VIDEO">YouTube Video</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium ml-1">Subject</label>
                                            <Input
                                                placeholder="e.g. Physics"
                                                value={uploadData.subjectName}
                                                onChange={e => setUploadData({ ...uploadData, subjectName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {uploadData.type === 'VIDEO' ? (
                                        <Input
                                            label="YouTube URL"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={uploadData.youtubeUrl}
                                            onChange={e => setUploadData({ ...uploadData, youtubeUrl: e.target.value })}
                                            required
                                        />
                                    ) : (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium ml-1">File</label>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className="w-full px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })}
                                                required
                                            />
                                        </div>
                                    )}

                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none min-h-[100px]"
                                        placeholder="Material description..."
                                        value={uploadData.description}
                                        onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                                    />

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="secondary" className="flex-grow" onClick={() => setShowUpload(false)}>Cancel</Button>
                                        <Button type="submit" className="flex-grow flex items-center justify-center gap-2">
                                            <Upload size={18} />
                                            Upload
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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

export default TeacherDashboard;
