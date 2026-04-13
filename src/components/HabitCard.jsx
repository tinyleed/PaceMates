import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HabitCard = ({ habitName, onToggle }) => {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
        setIsActive(!isActive);
        onToggle(habitName);
    };

    return (
        <motion.div
            className={`habit-card ${isActive ? 'active' : ''}`}
            onClick={handleToggle}
            initial={{ scale: 1 }}
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <h3>{habitName}</h3>
        </motion.div>
    );
};

export default HabitCard;
