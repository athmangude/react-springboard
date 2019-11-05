import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './Age.css';

const AgeFilter = (props) => (
  <div className="aod-report-age-filter" style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', marginTop: 20 }}>
    <span style={{ fontSize: 12, color: '#3d4553' }}>Age Distribution</span>
    <div style={{ backgroundColor: '#fff', width: '100%', padding: 10, border: 'solid 1px #d9d9d9', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <i className="material-icons" style={{ color: '#d9d9d9', marginRight: 10, width: 30 }}>accessibility</i>
      <InputRange
        style={{ width: 'calc(100% - 30)' }}
        className="filter-className"
        maxValue={100}
        minValue={0}
        value={props.value}
        onChange={(value) => props.onAgeChanged(value)}
        onChangeComplete={(value) => props.onAgeChanged(value)}
        formatLabel={(value, type) => {
          if (type === 'value') {
            return (
              <span style={{ position: 'absolute', top: 46, left: 0, fontSize: 14, color: '#808285' }}>{value}</span>
            );
          }
          return (
            <span style={{ position: 'absolute', top: 0, fontSize: 14 }}>{value}</span>
          );
        }}
      />
    </div>
  </div>
);

AgeFilter.propTypes = {
  onAgeChanged: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
};

export default AgeFilter;
