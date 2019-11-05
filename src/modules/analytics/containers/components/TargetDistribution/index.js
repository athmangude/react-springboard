/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';

import Title from '../Title';
import MonthPicker from '../MonthPicker';
import TargetDistributionChart from '../TargetDistributionChart';
import './index.css';

const npsColorScale = {
  detractor: '#fd9681',
  passive: '#fbc027',
  promoter: '#80c582',
};

const TargetDistribution = ({ metric, data, hideActions = false }) => (
  <div
    className="grid-item"
    style={{ width: '100%', padding: '0 10px 10px 10px' }}
  >
    <Title title={metric.title} subtitle={metric.subtitle} />
    <div
      className="target-distribution-card"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow:
          '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)',
        marginBottom: 20,
        marginTop: 1,
        marginLeft: -20,
      }}
    >
      <div style={{ width: '100%' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: 20,
            paddingRight: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              padding: 20,
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            {metric.valueContextLeft ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  color: '#4a4a4a',
                  font: '300 14px/14px Roboto,sans-serif',
                  letterSpacing: 0,
                  margin: '0 5px 5px 0',
                  textAlign: 'right',
                }}
              >
                {metric.valueContextLeft}
              </div>
            ) : null}
            <div
              style={{
                color: '#4a4a4a',
                font: '300 30px Roboto,sans-serif',
                letterSpacing: 0,
                textAlign: 'right',
              }}
            >
              {metric.value > 999
                ? numeral(metric.current)
                  .format('0.0 a')
                  .toUpperCase()
                  .replace(' ', '')
                : metric.current}
            </div>
            {metric.valueContextRight ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  color: '#4a4a4a',
                  font: '300 14px/14px Roboto,sans-serif',
                  letterSpacing: 0,
                  margin: '0 5px 5px 5px',
                  textAlign: 'right',
                }}
              >
                {metric.valueContextRight}
              </div>
            ) : null}
          </div>
          <div
            style={{
              color: '#4a4a4a',
              font: '300 14px/14px Roboto,sans-serif',
              letterSpacing: 0,
              marginBottom: 5,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              lineHeight: 1.4,
              width: '50%',
            }}
          >
            <span style={{ marginRight: 10 }}>{metric.name}</span>
            <i
              className="material-icons"
              style={{ fontSize: 25, marginBottom: -5 }}
            >
              {metric.icon}
            </i>
          </div>
        </div>
        <TargetDistributionChart data={data} colors={npsColorScale} />
        {!hideActions ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              borderTop: '1px solid #dddddd',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <MonthPicker />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

TargetDistribution.propTypes = {
  metric: PropTypes.object,
  data: PropTypes.array,
  hideActions: PropTypes.bool,
};

export default TargetDistribution;
