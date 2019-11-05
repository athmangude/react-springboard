/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar';

const AgeDistribution = (props) => {
  const { stats } = props;
  const total = stats.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
  const metadataExists = !!stats.filter((stat) => stat.count > 0).length;
  return (
    <div style={{ width: '100%', margin: '0 0 20px' }}>
      <span style={{ color: '#3d4553', fontSize: 13, fontWeight: 'bold' }}>Age</span>
      {metadataExists ?
        (
          stats.filter((stat) => stat.count > 0).map((stat, index) => (
            <Bar label={stat.ageRange} percentage={`${stat.count === 0 ? '0' : (stat.count / total * 100).toFixed(1)}%`} value={stat.count} key={`${index}-bar`} />
          ))
        )
        : (
          <p style={{ color: '#808285', fontSize: 11 }}>No data exists</p>
        )}
    </div>
  );
};

AgeDistribution.propTypes = {
  stats: PropTypes.array.isRequired,
};

export default AgeDistribution;
