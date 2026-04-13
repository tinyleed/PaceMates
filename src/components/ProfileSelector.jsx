import React from 'react';
import { motion } from 'framer-motion';

const ProfileSelector = ({ onSelectProfile, profiles }) => {
    const themeColors = {
        Mads: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
        Clara: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
                <h1 className="text-5xl font-black mb-2">⚡ PaceMates</h1>
                <p className="text-xl text-slate-600">Couples Habit Tracker</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
                {profiles.map((profile, idx) => (
                    <motion.button key={profile} initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} onClick={() => onSelectProfile(profile)} className={`${themeColors[profile].bg} text-white font-bold text-xl py-8 px-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                        {profile === 'Mads' ? '👨' : '👩'} {profile}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default ProfileSelector;
