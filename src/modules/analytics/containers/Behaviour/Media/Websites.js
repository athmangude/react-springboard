import React from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const data = [
  { name: 'Safaricom', percentage: 63.1 },
  { name: 'Nation', percentage: 23.6 },
  { name: 'Standard Media', percentage: 42.3 },
  { name: 'Jumia', percentage: 50.9 },
  { name: 'Olx', percentage: 19.9 },
  { name: 'Ghafla', percentage: 5.9 },
];

const Websites = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
    <div style={{ fontSize: 12, fontWeight: 900, color: '#6d6e71', width: '100%', height: 25, backgroundColor: '#e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10 }}>Websites</div>
    <HorizontalBarChart data={data} />
  </div>
);

Websites.propTypes = {
  width: PropTypes.number,
};

export default Websites;
