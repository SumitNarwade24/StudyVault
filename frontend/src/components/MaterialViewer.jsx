import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download } from 'lucide-react';
import Button from './Button';

const MaterialViewer = ({ material, onClose }) => {
    if (!material) return null;

    const isYouTube = material.filePath?.includes('youtube.com') || material.filePath?.includes('youtu.be');

    // Convert normal YT link to embed link
    const getEmbedUrl = (url) => {
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    const fileUrl = isYouTube ? getEmbedUrl(material.filePath) : `http://localhost:8080/api/materials/view/${material.filePath}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="text-primary">{material.type}</span>
                                <span className="text-slate-400">/</span>
                                {material.title}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isYouTube && (
                                <a href={fileUrl} download target="_blank" rel="noreferrer">
                                    <Button variant="secondary" className="p-2.5">
                                        <Download size={20} />
                                    </Button>
                                </a>
                            )}
                            <Button variant="ghost" className="p-2.5 text-slate-400" onClick={onClose}>
                                <X size={24} />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow bg-slate-100 dark:bg-slate-950 overflow-hidden">
                        {isYouTube ? (
                            <iframe
                                src={fileUrl}
                                title={material.title}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (material.type === 'VIDEO' || material.filePath?.match(/\.(mp4|webm|ogg)$/i)) ? (
                            <video
                                src={fileUrl}
                                controls
                                className="w-full h-full object-contain"
                                title={material.title}
                            />
                        ) : material.type === 'PDF' || material.filePath?.match(/\.pdf$/i) ? (
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&view=FitH`}
                                title={material.title}
                                className="w-full h-full border-none"
                                type="application/pdf"
                            />
                        ) : (
                            <iframe
                                src={fileUrl}
                                title={material.title}
                                className="w-full h-full border-none"
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MaterialViewer;
