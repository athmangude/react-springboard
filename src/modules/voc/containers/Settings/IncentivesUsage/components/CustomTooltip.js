import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

const months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ payload, active, interval }) => {
  if (active && payload !== null) {
    const record = payload[0].payload;
    const { amount, contacted } = record;
    let { period } = record;
    if (interval === 'daily') {
      const dateArray = period.split('-');
      period = dateArray.length > 1 ? dateArray[1].concat(' ').concat(months[parseInt(dateArray[0], 10) - 1]) : dateArray[0];
    }

    return (
      <div style={{ width: 100, display: 'flex', flexDirection: 'column', marginTop: 10, boxShadow: '1px 1px 1px 0 rgba(217, 217, 217, 0.3)' }}>
        <div style={{ width: 100, backgroundColor: '#002366', padding: 5, fontFamily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#ffffff' }}>
          <div>{period}</div>
          <div style={{ fontWeight: 'bold' }}>Contacted</div>
          <div><span style={{ fontWeight: 'bold' }}>{numeral(contacted).format('0 a')}</span></div>
        </div>
        <div style={{ width: 100, backgroundColor: '#33597f', padding: 5, fontFamily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#ffffff' }}>
          <div style={{ fontWeight: 'bold' }}>Incentives</div>
          <div><span style={{ fontWeight: 'bold' }}>{numeral(amount).format('0 a')}</span></div>
        </div>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  payload: PropTypes.object,
  interval: PropTypes.string,
  active: PropTypes.bool,
};

export default CustomTooltip;
