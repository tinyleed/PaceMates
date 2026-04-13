import React from 'react';
import PropTypes from 'prop-types';
import './Calendar.css';

const Calendar = ({ data }) => {
  const getColor = (distance) => {
    if (distance >= 20) return 'rgba(0, 128, 0, 1)'; // deep green
    if (distance >= 10) return 'rgba(144, 238, 144, 1)'; // medium green
    if (distance >= 5) return 'rgba(144, 255, 144, 1)'; // light green
    return 'rgba(0, 0, 0, 0)'; // transparent
  };

  return (
    <div className="calendar">
      {Object.entries(data).map(([date, distance]) => (
        <div key={date} className="calendar-day" style={{ backgroundColor: getColor(distance) }}>
          {date}
          <div className="distance">{distance} km</div>
        </div>
      ))}
    </div>
  );
};

Calendar.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Calendar;
