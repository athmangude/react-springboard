import React from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const data = [
  { name: 'Traditional', percentage: 43.1 },
  { name: 'Modern', percentage: 23.6 },
];

const Style = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
    <div style={{ fontSize: 12, fontWeight: 900, color: '#6d6e71', width: '100%', height: 25, backgroundColor: '#e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10 }}>Styles</div>
    <HorizontalBarChart data={data} />
  </div>
);

Style.propTypes = {
  width: PropTypes.number,
};

export default Style;
