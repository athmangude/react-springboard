import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import './Date.css';

const DateFilter = (props) => (
  <div className="aod-report-date-filter" style={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ fontSize: 12, color: '#3d4553' }}>Date</span>
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
      <div style={{ flexGrow: 1, position: 'relative', margin: '0px 5px 0px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <DayPickerInput
          value={props.value.from.format('YYYY-MM-DD')}
          onDayChange={(date) => props.onChange('from', date)}
          style={{ backgroundColor: '#fff', border: 'solid 1px #d9d9d9' }}
          dayPickerProps={{
            month: new Date(props.value.from),
            disabledDays: {
              after: props.value.to.toDate(),
            },
          }}
        />
        <i className="material-icons" style={{ color: '#808285', fontSize: 20, position: 'absolute', right: 10 }}>today</i>
      </div>
      <span>&nbsp;&nbsp; – &nbsp;&nbsp;</span>
      <div className="overlay-right-origin" style={{ flexGrow: 1, position: 'relative', margin: '0px 0px 0px 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <DayPickerInput
          value={props.value.to.format('YYYY-MM-DD')}
          onDayChange={(date) => props.onChange('to', date)}
          style={{ backgroundColor: '#fff', border: 'solid 1px #d9d9d9' }}
          dayPickerProps={{
            month: new Date(props.value.from),
            disabledDays: {
              before: props.value.from.toDate(),
              after: props.value.to.toDate(),
            },
          }}
        />
        <i className="material-icons" style={{ color: '#808285', fontSize: 20, position: 'absolute', right: 10 }}>today</i>
      </div>
    </div>
  </div>
);

DateFilter.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateFilter;
