import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    'w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 text-slate-900 dark:text-white',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 ml-1 mt-1">{error}</p>}
        </div>
    );
};

export default Input;
