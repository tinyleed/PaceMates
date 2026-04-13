import React from 'react';
import { motion } from 'framer-motion';

const HabitCard = ({ emoji, label, checked, onChange, disabled, badge }) => {
    return (
        <motion.button
            type="button"
            onClick={disabled ? undefined : onChange}
            whileTap={disabled ? undefined : { scale: 0.99 }}
            className={`w-full rounded-xl border px-4 py-4 text-left transition-all duration-200 ${
                checked ? 'border-blue-200 bg-blue-50/70' : 'border-transparent bg-white hover:border-slate-200'
            } ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{emoji}</span>
                    <span className="text-xl text-slate-900">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                    {badge ? (
                        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                            {badge}
                        </span>
                    ) : null}

                    {checked ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">✓</span>
                    ) : (
                        <span className="h-7 w-7 rounded-full border border-slate-300" />
                    )}
                </div>
            </div>
        </motion.button>
    );
};

export default HabitCard;
