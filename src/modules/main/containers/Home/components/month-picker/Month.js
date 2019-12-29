/* eslint-disable radix, jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import monthsHash from './monthsHash';

const Month = (props) => {
  const now = moment();
  const thisMonth = moment(`${props.newYear}-${props.monthId}-01 00:00:00`);

  return (
    <div role="button" className={`month-container ${(props.newMonth === props.monthId) && (now > thisMonth) ? 'selected' : ''} ${now > thisMonth ? '' : 'disabled'}`} onClick={() => props.onMonthChanged(props.monthId)}><span style={{ textTransform: 'uppercase' }}>{monthsHash[props.monthId - 1]}</span></div>
  );
};

Month.propTypes = {
  newMonth: PropTypes.number.isRequired,
  onMonthChanged: PropTypes.func.isRequired,
  monthId: PropTypes.number.isRequired,
  newYear: PropTypes.number.isRequired,
};

export default Month;
