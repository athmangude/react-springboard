import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

const CustomTooltip = ({ payload, active, themes, colors }) => {
  if (active && payload !== null) {
    const record = payload[0].payload;
    return (
      <div style={{ width: 150, borderRadius: 5, boxShadow: '0 3px 4px 0 rgba(0, 0, 0, 0.15)', border: 'solid 1px #f6f7f9', backgroundColor: '#ffffff', padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', fontSize: 11, fontWeight: 900, letterSpacing: -0.3, color: '#6d6e71' }}>
          <div>{record.period}</div>
          {
            themes.map((theme, index) => (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                <div style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: colors[index], marginRight: 10 }}></div>
                <div style={{ textTransform: 'capitalize' }}>{record[theme] > 999 ? numeral(record[theme]).format('0.0 a') : numeral(record[theme]).format('0 a')}<span style={{ fontWeight: 100, marginLeft: 5 }}>{theme}</span></div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  payload: PropTypes.object,
  active: PropTypes.bool,
  themes: PropTypes.array,
  colors: PropTypes.array,
};

export default CustomTooltip;
