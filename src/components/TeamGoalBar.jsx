import React from 'react';
import PropTypes from 'prop-types';
import './TeamGoalBar.css';

const TeamGoalBar = ({ progressMads, progressClara }) => {
    const totalProgress = progressMads + progressClara;
    const combinedCompletion = (totalProgress / 2).toFixed(2); // Assuming 100 is the max

    return (
        <div className="goal-bar">
            <div className="progress" style={{ width: `${combinedCompletion}%`, background: 'linear-gradient(to right, blue, rose)' }}>
                {combinedCompletion}%
            </div>
        </div>
    );
};

TeamGoalBar.propTypes = {
    progressMads: PropTypes.number.isRequired,
    progressClara: PropTypes.number.isRequired,
};

export default TeamGoalBar;
