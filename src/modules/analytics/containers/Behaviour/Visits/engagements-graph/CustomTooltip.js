import React from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ payload, active }) => {
  if (active && payload !== null) {
    const record = payload[0].payload;
    return (
      <div
        style={{
          width: 150, borderRadius: 5, boxShadow: '0 3px 4px 0 rgba(0, 0, 0, 0.15)', border: 'solid 1px #f6f7f9', backgroundColor: '#ffffff', padding: 16,
        }}
      >
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', fontSize: 11, fontWeight: 900, letterSpacing: -0.3, color: '#6d6e71',
          }}
        >
          <div>{record.period}</div>
          <div>
            Engagements:&nbsp;
            <span style={{ fontWeight: 100 }}>{record.engagements}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  payload: PropTypes.object,
  active: PropTypes.bool,
};

export default CustomTooltip;
