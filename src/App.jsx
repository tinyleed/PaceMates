import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useLocalStorage from './hooks/useLocalStorage';
import ProfileView from './components/ProfileView';
import ProfileSelector from './components/ProfileSelector';
import { initializeStravaOAuth } from './utils/strava';

const App = () => {
    const [currentProfile, setCurrentProfile] = useState(null);
    const [profileData, setProfileData] = useLocalStorage('paceMates_data', {
        profiles: {
            Mads: { theme: 'blue', strava: {}, history: {} },
            Clara: { theme: 'rose', strava: {}, history: {} }
        },
        shared: { nudges: {} }
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const profile = params.get('profile');

        if (code && profile) {
            initializeStravaOAuth(code, profile, profileData, setProfileData);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleProfileSelect = (profile) => {
        setCurrentProfile(profile);
    };

    const handleLogout = () => {
        setCurrentProfile(null);
    };

    if (!currentProfile) {
        return <ProfileSelector onSelectProfile={handleProfileSelect} profiles={Object.keys(profileData.profiles)} />;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <ProfileView profile={currentProfile} profileData={profileData} setProfileData={setProfileData} onLogout={handleLogout} />
        </motion.div>
    );
};

export default App;
