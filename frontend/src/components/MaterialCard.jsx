import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PlayCircle, Book, HelpCircle, FileDown, ExternalLink, Trash2, CheckCircle2 } from 'lucide-react';
import Button from './Button';

const MaterialCard = ({ material, onOpen, onDelete, showDelete = false, isAttempted = false }) => {
    const getIcon = () => {
        switch (material.type) {
            case 'PDF': return <FileText className="text-red-500" />;
            case 'VIDEO': return <PlayCircle className="text-blue-500" />;
            case 'BOOK': return <Book className="text-emerald-500" />;
            case 'QUIZ': return <HelpCircle className="text-purple-500" />;
            default: return <FileText className="text-slate-500" />;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            className="card flex flex-col h-full !p-8 group"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-primary/10 transition-colors duration-300">
                    {React.cloneElement(getIcon(), { size: 28 })}
                </div>
                <div className="flex items-center gap-2">
                    {isAttempted && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Attempted
                        </span>
                    )}
                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                        {material.type}
                    </span>
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">{material.title}</h3>
            <p className="text-base text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 flex-grow leading-relaxed">
                {material.description || 'Access high-quality study resources, notes, and interactive content designed for your success.'}
            </p>

            <div className="flex items-center gap-3 mt-auto">
                <Button
                    variant="secondary"
                    className="flex-grow flex items-center justify-center gap-2 text-base py-3 font-bold"
                    onClick={() => onOpen(material)}
                >
                    {material.type === 'VIDEO' ? <PlayCircle size={20} /> : <ExternalLink size={20} />}
                    Open Resource
                </Button>
                {showDelete && (
                    <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl"
                        onClick={() => onDelete(material.id)}
                    >
                        <Trash2 size={22} />
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export default MaterialCard;
