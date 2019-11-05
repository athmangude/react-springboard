import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import MwambaLabelWithIcon from 'SharedComponents/mwamba-label-with-icon';

const Visit = ({ label, visit }) => {
  const color = visit.totalVisitorsPercentageIncrease > 0 ? '#52bf8a' : '#ae84a7';
  return (
    <div style={{ width: '100%', padding: 5 }}>
      <div style={{ width: '100%', borderRadius: 10, border: 'solid 1px #d9d9d9', backgroundColor: '#f8f9fa', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textTransform: 'capitalize', height: 38, fontSize: 14, fontWeight: 900, color: '#6d6e71', width: '100%', textAlign: 'left' }}>{label}</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', width: '100%' }}>
              <i className="material-icons" style={{ marginRight: 10, color }}>person_add</i>
              <div style={{ fontSize: 20, color: '#6d6e71' }}>{visit.totalVisitors < 1000 ? numeral(visit.totalVisitors).format('0 a') : numeral(visit.totalVisitors).format('0.0 a')}</div>
              <div style={{ fontSize: 11, color: '#6d6e71' }}>
                &nbsp;
                (
                {visit.totalVisitorsPercentageIncrease.toFixed(1)}
                %
                )
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left' }}>Visitors</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end', width: '100%' }}>
              <i className="material-icons" style={{ marginRight: 10, color: visit.totalVisitorsPercentageIncrease > 0 ? '#52bf8a' : '#ae84a7' }}>people</i>
              <div style={{ fontSize: 20, color: '#6d6e71' }}>{visit.uniqueVisitors < 1000 ? numeral(visit.uniqueVisitors).format('0 a') : numeral(visit.totalVisitors).format('0.0 a')}</div>
              <div style={{ fontSize: 11, color: '#6d6e71' }}>
                &nbsp;
                (
                {visit.uniqueVisitorsPercentageIncrease.toFixed(1)}
                %
                )
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'right' }}>Unique Visitors</div>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <MwambaLabelWithIcon icon={visit.totalVisitorsPercentageIncrease < 0 ? 'expand_more' : 'expand_less'} text={`${visit.totalVisitorsPercentageIncrease.toFixed(1)}%`} style={{ backgroundColor: color }} />
          <div style={{ fontSize: 11, color: '#6d6e71', marginLeft: 5 }}>from previous visits</div>
        </div>
      </div>
    </div>
  );
};

Visit.propTypes = {
  label: PropTypes.string,
  visit: PropTypes.object,
};

export default Visit;
