import React from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const data = [
  { name: 'Sports', percentage: 43.1 },
  { name: 'News', percentage: 23.6 },
  { name: 'Movies', percentage: 12.3 },
  { name: 'Children & Family', percentage: 10.9 },
  { name: 'Other', percentage: 9.9 },
];

const Interests = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)', marginBottom: 20 }}>
    <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Interests</div>
    <HorizontalBarChart data={data} />
  </div>
);

Interests.propTypes = {
  width: PropTypes.number,
};

export default Interests;
