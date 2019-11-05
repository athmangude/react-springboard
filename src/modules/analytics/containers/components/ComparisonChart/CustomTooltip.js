/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';

/**
 * @TODO
 * @param {String} date
 * @param {Number} rangeDays
 * @param {String} chartType
 */
const currentDateLabel = (date, rangeDays, chartType, interval) => {
  if (chartType === 'line') {

    return interval === 'weekly' ? date+' - '+moment(date).add('days', 6).format("DD MMM") : date;

  } if (['bar', 'stacked'].includes(chartType)) {
    return interval === 'weekly' ? date+' - '+moment(date).add('days', 6).format("DD MMM") : date;
  }
  return null;
};

/**
 * @TODO
 * @param {String} initialDate
 * @param {Number} rangeDays
 * @param {String} chartType
 */
const previousDateLabel = (initialDate, rangeDays, chartType) => {
  if (chartType === 'line') {
    return '4th Feb';
  } if (['bar', 'stacked'].includes(chartType)) {
    return '5th Jan - 4th Feb';
  }
  return null;
};

const CustomTooltip = ({ payload, active, xKey, nonLinear, dataKeys, chartType, benchmark, interval = null }) => {  
  if (active && payload !== null && payload.length) {
    const record = payload[0].payload;
    const performance = (record.current - record.previous) / record.previous * 100;
    if (benchmark) {
      dataKeys = [...dataKeys, 'benchmark'];
    }

    return (
      <div style={{ minWidth: 150, borderRadius: 5, boxShadow: '0 3px 4px 0 rgba(0, 0, 0, 0.15)', border: 'solid 1px #f6f7f9', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', letterSpacing: 0, color: '#4a4a4a', font: '300 14px/1.4 Roboto, sans-serif' }}>
          {
            dataKeys.map((key, index) => {
              let label = key;
              if (key === 'current') {
                label = currentDateLabel(record[xKey], record.rangeDays, chartType, interval);
              } else if (label === 'previous') {
                label = previousDateLabel(record[xKey], record.rangeDays, chartType);
              }
              return (
                <div key={key} style={{ width: '100%', paddingLeft: 15, paddingRight: 15, paddingTop: index === 0 ? 15 : 0, paddingBottom: 5 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginRight: 25 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: payload.length ? payload[index].color : null, marginRight: 10 }} />
                      <div style={{ textTransform: 'capitalize' }}>{label}</div>
                    </div>
                    <div>{numeral(record[key]).format('0,0')}</div>
                  </div>
                </div>
              );
            })
          }
          {/* {
            !nonLinear ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #dddddd', paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                <div>Growth</div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <i className="material-icons" style={{ fontSize: 13, color: performance > 0 ? '#0f9d58' : performance < 0 ? '#db4437' : 'inherit' }}>
                    {performance > 0 ? 'arrow_upward' : performance < 0 ? 'arrow_downward' : 'arrow_forward' }
                  </i>
                  &nbsp;
                  <span style={{ color: performance > 0 ? '#0f9d58' : performance < 0 ? '#db4437' : 'inherit' }}>{`${numeral(performance).format('0.0')}%`}</span>
                </div>
              </div>
            ) : null
          } */}
        </div>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  payload: PropTypes.object,
  active: PropTypes.bool,
  xKey: PropTypes.string,
  nonLinear: PropTypes.bool,
  dataKeys: PropTypes.array,
  chartType: PropTypes.string,
  benchmark: PropTypes.bool,
};

export default CustomTooltip;
