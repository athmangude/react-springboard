import React from 'react';
import PropTypes from 'prop-types';

const months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ payload, active, interval }) => {
  if (active && payload !== null) {
    const record = payload[0].payload;
    const { promoters, passives, detractors, contacted, nps } = record;
    let { period } = record;
    if (interval === 'daily') {
      const dateArray = period.split('-');
      period = dateArray.length > 1 ? dateArray[1].concat(' ').concat(months[parseInt(dateArray[0], 10) - 1]) : dateArray[0];
    }

    const total = promoters + passives + detractors;
    return (
      <div style={{ width: 100, display: 'flex', flexDirection: 'column', marginTop: 10, boxShadow: '1px 1px 1px 0 rgba(217, 217, 217, 0.3)' }}>
        <div style={{ width: 100, backgroundColor: '#487db3', padding: 5, fontFamily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#ffffff' }}>
          <div>{period}</div>
          <div style={{ fontWeight: 'bold' }}>Responses</div>
          <div>Participants: <span style={{ fontWeight: 'bold' }}>{contacted}</span></div>
        </div>
        <div style={{ width: 100, backgroundColor: '#33597f', padding: 5, fontFamily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#ffffff' }}>
          <div style={{ fontWeight: 'bold' }}>NPS Score</div>
          <div>Score: <span style={{ fontWeight: 'bold' }}>{nps}</span></div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <i className="material-icons" style={{ color: '#80c582', fontSize: 20 }}>sentiment_very_satisfied</i>
              <span style={{ fontWeight: 'bold' }}>{Math.round((promoters / total) * 100)}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <i className="material-icons" style={{ color: '#ffac28', fontSize: 20 }}>sentiment_satisfied</i>
              <span style={{ fontWeight: 'bold' }}>{Math.round((passives / total) * 100)}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <i className="material-icons" style={{ color: '#f26b50', fontSize: 20 }}>sentiment_dissatisfied</i>
              <span style={{ fontWeight: 'bold' }}>{Math.round((detractors / total) * 100)}%</span>
            </div>
          </div>
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
