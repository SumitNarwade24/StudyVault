import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronRight, Trophy, AlertCircle } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import Button from './Button';

const QuizViewer = ({ quiz, onClose }) => {
    const { user } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    const questions = quiz.questions || [];
    const currentQ = questions[currentQuestion];

    if (!currentQ && !showResult) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
                <motion.div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center">
                    <h2 className="text-xl font-bold mb-4">No questions available for this quiz.</h2>
                    <Button onClick={onClose}>Close</Button>
                </motion.div>
            </div>
        );
    }

    const handleOptionSelect = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleConfirm = () => {
        if (selectedOption.correct) {
            setScore(score + 1);
        }
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="font-bold text-xl">{quiz.title}</h2>
                    <Button variant="ghost" onClick={onClose} className="p-2">
                        <X size={24} />
                    </Button>
                </div>

                <div className="p-8">
                    {!showResult ? (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                                <span>QUESTION {currentQuestion + 1} OF {questions.length}</span>
                                <span className="text-primary">{Math.round(((currentQuestion) / questions.length) * 100)}% COMPLETE</span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">{currentQ.questionText}</h3>

                                <div className="grid gap-3">
                                    {currentQ.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            disabled={isAnswered}
                                            onClick={() => handleOptionSelect(opt)}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedOption?.id === opt.id
                                                ? (isAnswered
                                                    ? (opt.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10' : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10')
                                                    : 'border-primary bg-primary/5 text-primary'
                                                )
                                                : (isAnswered && opt.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10' : 'border-slate-100 dark:border-slate-800')
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{opt.optionText}</span>
                                                {isAnswered && opt.correct && <CheckCircle2 size={20} className="text-emerald-500" />}
                                                {isAnswered && selectedOption?.id === opt.id && !opt.correct && <AlertCircle size={20} className="text-red-500" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end items-center pt-4">
                                {!isAnswered ? (
                                    <Button
                                        disabled={!selectedOption}
                                        onClick={handleConfirm}
                                        className="px-8"
                                    >
                                        Confirm Answer
                                    </Button>
                                ) : (
                                    <Button onClick={handleNext} className="flex items-center gap-2 px-8">
                                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                        <ChevronRight size={20} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 space-y-6">
                            <div className="inline-flex p-6 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-500 rounded-full">
                                <Trophy size={64} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                                <p className="text-slate-500">You scored {score} out of {questions.length} questions.</p>
                            </div>

                            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(score / questions.length) * 100}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    // Track quiz attempt locally for this specific user
                                    const storageKey = user ? `completedQuizzes_${user.id}` : 'completedQuizzes_guest';
                                    const completedQuizzes = JSON.parse(localStorage.getItem(storageKey) || '{}');
                                    completedQuizzes[quiz.id] = true;
                                    localStorage.setItem(storageKey, JSON.stringify(completedQuizzes));
                                    onClose();
                                }}
                                className="w-full py-4 text-lg"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QuizViewer;
