/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const npsColorScale = ['#fd9681', '#fcda6e', '#80c582'];

const MwambaBar = ({ bar, total, barColor = '#487db3', nps }) => {
  if (nps) {
    const percentageDetractors = `${bar.detractors / bar.count * 100}%`;
    const percentagePassives = `${bar.passives / bar.count * 100}%`;
    const percentagePromoters = `${bar.promoters / bar.count * 100}%`;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginBottom: 10 }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <span style={{ color: '#8898aa', fontSize: 12, width: '100%' }}>{bar.name}</span>
          <span style={{ color: '#8898aa', fontSize: 12, width: '100%' }}>{bar.nps.toFixed(1)}</span>
        </div>
        <div style={{ width: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: '100%', height: 5, backgroundColor: '#e9ecef', borderRadius: '.25rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)', overflow: 'hidden', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div className="mwamba-bar-value" style={{ backgroundColor: npsColorScale[2], width: percentagePromoters, height: 10, WebkitTransition: 'width 1s', transition: 'width 1s', borderRadius: 0, boxShadow: 'none' }}></div>
            <div className="mwamba-bar-value" style={{ backgroundColor: npsColorScale[1], width: percentagePassives, height: 10, WebkitTransition: 'width 1s', transition: 'width 1s', borderRadius: 0, boxShadow: 'none' }}></div>
            <div className="mwamba-bar-value" style={{ backgroundColor: npsColorScale[0], width: percentageDetractors, height: 10, WebkitTransition: 'width 1s', transition: 'width 1s', borderRadius: 0, boxShadow: 'none' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = bar.count === 0 || total === 0 ? '0%' : `${(bar.count / total * 100).toFixed(1)}%`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginBottom: 10 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <span style={{ color: '#9e9e9e', fontSize: 12, width: '100%' }}>{bar.name}</span>
        <span style={{ color: '#9e9e9e', fontSize: 12, width: '100%' }}>{`${percentage} (${bar.count})`}</span>
      </div>
      <div style={{ width: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', height: 5, backgroundColor: '#e9ecef', borderRadius: '.25rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)', overflow: 'hidden' }}>
          <div className="mwamba-bar-value" style={{ backgroundColor: barColor, width: percentage, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderRadius: 0, boxShadow: 'none' }}>
          </div>
        </div>
      </div>
    </div>
  );
};

MwambaBar.propTypes = {
  bar: PropTypes.object,
  total: PropTypes.number,
  nps: PropTypes.bool,
  barColor: PropTypes.number,
};

export default MwambaBar;
