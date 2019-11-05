/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar';

const Gender = (props) => {
  const { stats } = props;
  let metadataExists = null;
  let male = {};
  let female = {};
  if (Object.keys(stats).length) {
    male = stats[0];
    female = stats[1];
    metadataExists = !!male.count || !!female.count;
  }


  return (
    <div style={{ width: '100%', margin: '0 0 20px' }}>
      <span style={{ color: '#3d4553', fontSize: 13, fontWeight: 'bold' }}>Gender</span>
      {metadataExists ?
        ([
          <Bar key="male" label="Male" percentage={`${male.count === 0 ? '0' : (male.count / (female.count + male.count) * 100).toFixed(1)}%`} value={male.count} />,
          <Bar key="female" label="Female" percentage={`${female.count === 0 ? '0' : (female.count / (female.count + male.count) * 100).toFixed(1)}%`} value={female.count} />
        ])
        : (
          <p style={{ color: '#808285', fontSize: 11 }}>No data exists</p>
        )}
    </div>
  );
};

Gender.propTypes = {
  stats: PropTypes.object.isRequired,
};

export default Gender;
