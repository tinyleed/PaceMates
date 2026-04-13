import React from 'react';
import PropTypes from 'prop-types';

const TeamGoalBar = ({ monthHistory }) => {
    const entries = Object.values(monthHistory || {});
    const stats = [
        {
            key: 'strava',
            icon: '🏋️',
            count: entries.filter((day) => Boolean(day?.strava)).length
        },
        {
            key: 'diet',
            icon: '🥗',
            count: entries.filter((day) => Boolean(day?.diet)).length
        },
        {
            key: 'meditation',
            icon: '🧘',
            count: entries.filter((day) => Boolean(day?.meditation)).length
        },
        {
            key: 'sleep',
            icon: '😴',
            count: entries.filter((day) => Boolean(day?.sleep)).length
        }
    ];

    return (
        <div className="mb-6 grid grid-cols-4 gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            {stats.map((item) => (
                <div key={item.key} className="text-center">
                    <div className="text-xl">{item.icon}</div>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">{item.count}</p>
                    <p className="text-sm text-slate-500">dage</p>
                </div>
            ))}
        </div>
    );
};

TeamGoalBar.propTypes = {
    monthHistory: PropTypes.object
};

TeamGoalBar.defaultProps = {
    monthHistory: {}
};

export default TeamGoalBar;
