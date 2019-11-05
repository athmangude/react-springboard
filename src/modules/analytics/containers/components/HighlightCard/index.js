/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';

import Title from '../Title';
import ActionButton from 'SharedComponents/action-button-styled';
import './index.css';

const HightlightCard = ({ metric }) => (
  <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
    <Title title={metric.title} subtitle={metric.subtitle} />
    <div className="highlight-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: 10 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
            {
              metric.valueContextLeft ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', color: '#4a4a4a', font: '300 14px/14px Roboto,sans-serif', letterSpacing: 0, margin: '0 5px 5px 0', textAlign: 'left' }}>{metric.valueContextLeft}</div>
              ) : null
            }
            <div style={{ color: '#4a4a4a', font: '300 30px Roboto,sans-serif', letterSpacing: 0, textAlign: 'right' }}>{metric.value > 999 ? numeral(metric.value).format('0.0 a').toUpperCase().replace(' ', '') : metric.value}</div>
            {
              metric.valueContextRight ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', color: '#4a4a4a', font: '300 14px/14px Roboto,sans-serif', letterSpacing: 0, margin: '0 5px 5px 5px', textAlign: 'right' }}>{metric.valueContextRight}</div>
              ) : null
            }
          </div>
          <div style={{ color: '#4a4a4a', font: '300 14px/14px Roboto,sans-serif', letterSpacing: 0, marginBottom: 5, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', lineHeight: 1.4 }}>
            {/* <span style={{ marginRight: 10 }}>{metric.name}</span> */}
            <i className="material-icons" style={{ fontSize: 25, marginBottom: -5 }}>{metric.icon}</i>
          </div>
        </div>
        {
          metric.bottomComponent ? (metric.bottomComponent) : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderTop: '1px solid #dddddd' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: 0, minHeight: 9, font: '300 12px/14px Roboto,sans-serif', letterSpacing: 0.01 }}>
                <i className="material-icons" style={{ fontSize: 13, fontWeight: 'bold', color: metric.performance > 0 ? '#0f9d58' : metric.performance < 0 ? '#db4437' : 'inherit' }}>
                  {metric.performance > 0 ? 'arrow_upward' : metric.performance < 0 ? 'arrow_downward' : 'arrow_forward' }
                </i>
                &nbsp;
                <span style={{ color: metric.performance > 0 ? '#0f9d58' : metric.performance < 0 ? '#db4437' : 'inherit' }}>{`${metric.performance}%`}</span>
                &nbsp;
                <span>
                  in the last
                  &nbsp;
                  {metric.rangeDays || 30}
                  &nbsp;
                  days
                </span>
              </div>
              {
                metric.action ? (
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ActionButton text={metric.action.text} icon={metric.action.icon} />
                  </div>
                ) : null
              }
            </div>
          )
        }

      </div>
    </div>
  </div>
);

HightlightCard.propTypes = {
  metric: PropTypes.object,
};

export default HightlightCard;

