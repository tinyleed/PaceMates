import React from 'react';
import { motion } from 'framer-motion';

const ProfileSelector = ({ onSelectProfile, profiles }) => {
    const themeColors = {
        Mads: { border: 'border-blue-400', bubble: 'bg-blue-100 text-blue-600' },
        Clara: { border: 'border-rose-300', bubble: 'bg-rose-100 text-rose-600' }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f3f4f6] p-4">
            <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.35 }} className="mx-auto mt-20 max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-4xl text-slate-900">PaceMates</h1>
                <p className="mb-8 text-slate-600">Vælg profil for at fortsætte</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {profiles.map((profile) => (
                        <motion.button
                            key={profile}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => onSelectProfile(profile)}
                            className={`rounded-lg border bg-white px-4 py-4 text-left transition-colors hover:bg-slate-50 ${themeColors[profile].border}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${themeColors[profile].bubble}`}>
                                    {profile.slice(0, 2).toUpperCase()}
                                </span>
                                <span className="text-xl text-slate-900">{profile}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProfileSelector;
