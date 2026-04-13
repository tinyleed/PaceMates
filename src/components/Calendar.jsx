import React from 'react';
import PropTypes from 'prop-types';

const weekdayLabels = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

const Calendar = ({ month, history, onChangeMonth }) => {
  const safeHistory = history && typeof history === 'object' && !Array.isArray(history) ? history : {};
  const selectedMonth = month instanceof Date ? month : new Date();
  const year = selectedMonth.getFullYear();
  const monthIndex = selectedMonth.getMonth();

  const monthLabel = selectedMonth.toLocaleDateString('da-DK', {
    month: 'long',
    year: 'numeric'
  });

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

  const monthEntries = Object.entries(safeHistory).reduce((acc, [date, data]) => {
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      acc[d.getDate()] = data;
    }
    return acc;
  }, {});

  const buildDayCells = () => {
    const cells = [];

    for (let i = 0; i < startOffset; i += 1) {
      cells.push(<div key={`empty-${i}`} className="h-16" />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dayData = monthEntries[day] || {};
      const distance = dayData?.strava?.distance;
      const hasWorkout = typeof distance === 'number';

      cells.push(
        <div key={`day-${day}`} className="h-16 rounded-lg border border-transparent px-2 py-1 hover:border-slate-200">
          <div className="text-sm text-slate-900">{day}</div>
          {hasWorkout ? (
            <div className="mt-1 text-[11px] leading-tight text-indigo-700">
              <span>👟</span>
              <span className="ml-1">{distance.toFixed(1)}k</span>
            </div>
          ) : null}
        </div>
      );
    }

    return cells;
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-medium capitalize text-slate-900">{monthLabel}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="h-8 w-8 rounded-full text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            className="h-8 w-8 rounded-full text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 px-2">
        {weekdayLabels.map((label, index) => (
          <div key={`${label}-${index}`} className="text-sm text-slate-700">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">{buildDayCells()}</div>
    </section>
  );
};

Calendar.propTypes = {
  month: PropTypes.instanceOf(Date),
  history: PropTypes.object,
  onChangeMonth: PropTypes.func
};

Calendar.defaultProps = {
  month: new Date(),
  history: {},
  onChangeMonth: () => {}
};

export default Calendar;
