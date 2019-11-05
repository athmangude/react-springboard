import React from 'react';
import PropTypes from 'prop-types';

const DatePresenter = ({ today, previousDate, currentDate, padding = 20 }) => {
  if (currentDate !== previousDate) {
    return (
      <div style={{ height: 40, fontFamily: 'Lato', fontSize: 11, fontWeight: 'bold', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: `15px ${padding}px` }}>
        <div style={{ color: '#d9d9d9', textAlign: 'right', width: 'calc(100% - 150px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          {today === currentDate && (
            'Today'
          )}
        </div>
        <div style={{ letterSpacing: 0.6, textAlign: 'right', color: '#d9d9d9', width: 150, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',justifyContent: 'flex-end' }}>
          {currentDate === null ? previousDate : currentDate}
        </div>
      </div>
    );
  }
  return null;
};

DatePresenter.propTypes = {
  today: PropTypes.string,
  currentDate: PropTypes.string,
  previousDate: PropTypes.string,
  padding: PropTypes.number,
};

export default DatePresenter;
