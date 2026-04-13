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

    const themeConfig = {
        Mads: {
            bg: 'gradient-mads',
            accent: 'blue-600',
            light: 'blue-50',
            button: 'bg-blue-600 hover:bg-blue-700'
        },
        Clara: {
            bg: 'gradient-clara',
            accent: 'rose-600',
            light: 'rose-50',
            button: 'bg-rose-600 hover:bg-rose-700'
        }
    };

    const theme = themeConfig[profile];

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

    return (
        <div className={`min-h-screen ${theme.bg} p-6 transition-colors duration-500`}> <TeamGoalBar profileData={profileData} /> {showNudgeToast && ( <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-lg z-50"> 🔥 {partnerProfile} is cheering you on! </motion.div> )} <div className="max-w-4xl mx-auto"> <div className="flex justify-between items-center mb-8"> <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center flex-1"> <h1 className={`text-4xl font-black text-${theme.accent}`}>{profile === 'Mads' ? '👨' : '👩'} {profile}</h1> <p className="text-slate-600 mt-2">{todayDate}</p> </motion.div> <motion.button onClick={onLogout} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"> Switch </motion.button> </div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> <div className="lg:col-span-2"> <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 soft-shadow mb-6"> <h2 className="text-2xl font-bold mb-4">Today's Habits</h2> <div className="grid grid-cols-2 gap-4"> <HabitCard habit="diet" emoji="🍎" label="Diet" checked={today.diet} onChange={() => handleHabitToggle('diet')} theme={theme} /> <HabitCard habit="meditation" emoji="🧘" label="Meditation" checked={today.meditation} onChange={() => handleHabitToggle('meditation')} theme={theme} /> <HabitCard habit="sleep" emoji="😴" label="Sleep" checked={today.sleep} onChange={() => handleHabitToggle('sleep')} theme={theme} /> <HabitCard habit="strava" emoji="⚡" label="Exercise" checked={!!today.strava} onChange={handleConnectStrava} disabled={!!today.strava} theme={theme} stravaData={today.strava} /> </div> {!userProfile.strava?.accessToken && ( <motion.button onClick={handleConnectStrava} className={`${theme.button} text-white font-bold py-2 px-6 rounded-lg mt-4 w-full transition-all duration-300`}> Connect Strava </motion.button> )} </motion.div> <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 soft-shadow"> <Calendar profile={profile} profileData={profileData} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} /> </motion.div> </div> <div className="lg:col-span-1"> <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 soft-shadow"> <h2 className="text-xl font-bold mb-4">Actions</h2> <motion.button onClick={handleSendNudge} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${theme.button} text-white font-bold py-3 px-4 rounded-lg w-full mb-4 transition-all duration-300`}> 🔥 Nudge {partnerProfile} </motion.button> <div className="text-sm text-slate-600"> <p className="font-semibold mb-2">Partner: {partnerProfile}</p> <p>Keep each other motivated! Send nudges to encourage your partner.</p> </div> </motion.div> </div> </div> </div> </div> ); }; 

export default ProfileView;
