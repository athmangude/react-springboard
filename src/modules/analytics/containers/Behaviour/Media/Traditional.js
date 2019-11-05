import React from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const data = [
  { name: 'Radio', percentage: 43.1 },
  { name: 'Tv', percentage: 23.6 },
  { name: 'Newspaper', percentage: 12.3 },
  { name: 'Other', percentage: 10.9 },
];

const Traditional = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
    <div style={{ fontSize: 12, fontWeight: 900, color: '#6d6e71', width: '100%', height: 25, backgroundColor: '#e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10 }}>Offline &amp; Traditinal</div>
    <HorizontalBarChart data={data} />
  </div>
);

Traditional.propTypes = {
  width: PropTypes.number,
};

export default Traditional;
