import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from './Input';
import Button from './Button';

const MaterialFilters = ({ filters, setFilters, subjects }) => {
    const types = ['PDF', 'PYQ', 'BOOK', 'NOTES', 'VIDEO', 'QUIZ'];

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                        value={filters.title}
                        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 outline-none font-medium "
                        value={filters.subjectId || ''}
                        onChange={(e) => setFilters({ ...filters, subjectId: e.target.value || null })}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <Button
                        variant="secondary"
                        className="md:hidden"
                        onClick={() => setFilters({ title: '', subjectId: null, type: null })}
                    >
                        <X size={20} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilters({ ...filters, type: null })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${!filters.type
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                >
                    All Types
                </button>
                {types.map(t => (
                    <button
                        key={t}
                        onClick={() => setFilters({ ...filters, type: t })}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filters.type === t
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MaterialFilters;
