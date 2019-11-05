import React from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const data = [
  { name: 'Direct to Bizz', percentage: 66.1 },
  { name: 'OnlineReferral', percentage: 33.6 },
  { name: 'Other', percentage: 13.6 },
];

const Source = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
    <div style={{ fontSize: 12, fontWeight: 900, color: '#6d6e71', width: '100%', height: 25, backgroundColor: '#e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10 }}>Sources</div>
    <HorizontalBarChart data={data} />
  </div>
);

Source.propTypes = {
  width: PropTypes.number,
};

export default Source;
