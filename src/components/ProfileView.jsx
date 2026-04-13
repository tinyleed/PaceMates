import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamGoalBar from './TeamGoalBar';
import HabitCard from './HabitCard';
import Calendar from './Calendar';
import { getStravaAuthUrl } from '../utils/strava';

const ProfileView = ({ profile, profileData, setProfileData, onLogout }) => {
    const [todayDate] = useState(new Date().toISOString().split('T')[0]);
    const [showNudgeToast, setShowNudgeToast] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const userProfile = profileData.profiles[profile];
    const partnerProfile = Object.keys(profileData.profiles).find(p => p !== profile);

    const today = profileData.profiles[profile].history[todayDate] || { diet: false, meditation: false, sleep: false, strava: null };

    useEffect(() => {
        const checkForNudge = () => {
            if (profileData.shared.nudges?.[profile]?.active) {
                setShowNudgeToast(true);
                const timer = setTimeout(() => {
                    setShowNudgeToast(false);
                    setProfileData({ ...profileData, shared: { ...profileData.shared, nudges: { ...profileData.shared.nudges, [profile]: { ...profileData.shared.nudges[profile], active: false } } } });
                }, 4000);
                return () => clearTimeout(timer);
            }
        };
        checkForNudge();
    }, [profileData, profile, setProfileData]);

    const handleHabitToggle = (habit) => {
        const newHistory = { ...userProfile.history, [todayDate]: { ...today, [habit]: !today[habit] } };
        setProfileData({ ...profileData, profiles: { ...profileData.profiles, [profile]: { ...userProfile, history: newHistory } } });
    };

    const handleSendNudge = () => {
        setProfileData({ ...profileData, shared: { ...profileData.shared, nudges: { ...profileData.shared.nudges, [partnerProfile]: { from: profile, timestamp: new Date().toISOString(), active: true } } } });
        alert(`Nudge sent to ${partnerProfile}! 🔥`);
    };

    const handleConnectStrava = () => {
        const authUrl = getStravaAuthUrl(profile);
        window.location.href = authUrl;
    };

    const handleMonthChange = (delta) => {
        setSelectedMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + delta, 1));
    };

    const selectedYear = selectedMonth.getFullYear();
    const selectedMonthNum = selectedMonth.getMonth();
    const monthHistory = Object.entries(userProfile.history || {})
        .filter(([date]) => {
            const d = new Date(date);
            return d.getFullYear() === selectedYear && d.getMonth() === selectedMonthNum;
        })
        .reduce((acc, [date, dayData]) => {
            acc[date] = dayData;
            return acc;
        }, {});

    const completedToday = [today.strava, today.diet, today.meditation, today.sleep].filter(Boolean).length;
    const activeTheme = profile === 'Mads' ? 'blue' : 'rose';

    return (
        <div className="min-h-screen bg-[#f3f4f6] px-4 py-5 sm:px-8">
            {showNudgeToast && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed left-1/2 top-8 z-50 -translate-x-1/2 rounded-full bg-orange-100 px-6 py-3 text-sm font-bold text-orange-700 shadow"
                >
                    🔥 {partnerProfile} is cheering you on!
                </motion.div>
            )}

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {Object.keys(profileData.profiles).map((name) => {
                            const selected = name === profile;
                            return (
                                <div
                                    key={name}
                                    className={`flex items-center gap-3 rounded-md border px-5 py-3 ${
                                        selected ? 'border-blue-500 bg-white' : 'border-transparent bg-transparent'
                                    }`}
                                >
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${name === 'Mads' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-2xl text-slate-900">{name}</span>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Skift profil
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl text-slate-900">I dag</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl bg-white p-4 shadow-sm"
                >
                    <div className="space-y-2">
                        <HabitCard
                            emoji="🏋️"
                            label="Exercise"
                            checked={Boolean(today.strava)}
                            onChange={handleConnectStrava}
                            disabled={Boolean(today.strava)}
                            badge={profile === 'Mads' ? 'Mads' : undefined}
                        />
                        <HabitCard emoji="🥗" label="Diet" checked={today.diet} onChange={() => handleHabitToggle('diet')} />
                        <HabitCard emoji="🧘" label="Meditation" checked={today.meditation} onChange={() => handleHabitToggle('meditation')} />
                        <HabitCard emoji="😴" label="Sleep" checked={today.sleep} onChange={() => handleHabitToggle('sleep')} />
                    </div>

                    {!userProfile.strava?.accessToken && (
                        <button
                            type="button"
                            onClick={handleConnectStrava}
                            className={`mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white ${activeTheme === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-rose-500 hover:bg-rose-600'}`}
                        >
                            Connect Strava
                        </button>
                    )}
                </motion.div>

                <div className="mt-5 mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-600">{todayDate}</p>
                    <button
                        type="button"
                        onClick={handleSendNudge}
                        className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700"
                    >
                        🔥 Nudge {partnerProfile}
                    </button>
                </div>

                <TeamGoalBar monthHistory={monthHistory} />

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                >
                    <Calendar month={selectedMonth} history={userProfile.history || {}} onChangeMonth={handleMonthChange} />
                </motion.div>

                <p className="mt-6 text-sm text-slate-700">
                    Husk at indsætte din nye Client Secret i koden når du har genereret den. Apple Health kan tilføjes senere.
                </p>

                <p className="mt-2 text-sm text-slate-700">Fuldført i dag: {completedToday} / 4</p>
            </div>
        </div>
    );
};

export default ProfileView;
