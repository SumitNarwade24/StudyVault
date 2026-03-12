import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import Button from './Button';
import Input from './Input';
import api from '../services/api';

const QuizCreator = ({ onQuizCreated, onCancel, subjects }) => {
    const [quizData, setQuizData] = useState({
        title: '',
        subjectName: '',
        questions: [
            {
                questionText: '',
                options: [
                    { optionText: '', isCorrect: true },
                    { optionText: '', isCorrect: false }
                ]
            }
        ]
    });

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                {
                    questionText: '',
                    options: [
                        { optionText: '', isCorrect: true },
                        { optionText: '', isCorrect: false }
                    ]
                }
            ]
        });
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = quizData.questions.filter((_, i) => i !== qIndex);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addOption = (qIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options.push({ optionText: '', isCorrect: false });
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const toggleCorrect = (qIndex, oIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, i) => ({
            ...opt,
            isCorrect: i === oIndex
        }));
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const updateQuestion = (qIndex, text) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].questionText = text;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const updateOption = (qIndex, oIndex, text) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options[oIndex].optionText = text;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quizData.subjectName) return toast.error('Please enter a subject name');
        if (quizData.questions.some(q => !q.questionText || q.options.some(o => !o.optionText))) {
            return toast.error('Please fill all questions and options');
        }

        try {
            // Backend expects subject entity, but we simplified to subjectId
            // In production, backend should resolve this, but here we transform if needed
            const payload = {
                title: quizData.title,
                subjectName: quizData.subjectName,
                questions: quizData.questions
            };
            await api.post('/quizzes', payload);
            toast.success('Quiz created successfully!');
            onQuizCreated();
        } catch (error) {
            toast.error('Failed to create quiz');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Create New Quiz</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Quiz Title"
                        placeholder="e.g. History Final Quiz"
                        value={quizData.title}
                        onChange={e => setQuizData({ ...quizData, title: e.target.value })}
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium ml-1">Subject</label>
                        <Input
                            placeholder="e.g. Mathematics"
                            value={quizData.subjectName}
                            onChange={e => setQuizData({ ...quizData, subjectName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {quizData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Question {qIndex + 1}</span>
                                {quizData.questions.length > 1 && (
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 p-1 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <textarea
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none mb-4 font-semibold"
                                placeholder="Type your question here..."
                                value={q.questionText}
                                onChange={e => updateQuestion(qIndex, e.target.value)}
                                required
                            />

                            <div className="space-y-3">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleCorrect(qIndex, oIndex)}
                                            className={`p-3 rounded-xl border-2 transition-all ${opt.isCorrect
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-500'
                                                : 'border-white dark:border-slate-800 text-slate-300'
                                                }`}
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                        <input
                                            type="text"
                                            className="flex-grow px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={opt.optionText}
                                            onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                                            required
                                        />
                                        {q.options.length > 2 && (
                                            <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {q.options.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => addOption(qIndex)}
                                        className="ml-14 text-sm font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Option
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="button" variant="secondary" onClick={addQuestion} className="flex items-center gap-2">
                        <Plus size={20} /> Add Question
                    </Button>
                    <Button type="submit" className="flex-grow">Create Quiz</Button>
                </div>
            </form>
        </div>
    );
};

export default QuizCreator;
