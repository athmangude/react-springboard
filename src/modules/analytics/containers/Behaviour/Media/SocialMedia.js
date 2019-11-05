import React from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const data = [
  { name: 'Facebook', percentage: 43.1 },
  { name: 'Twitter', percentage: 23.6 },
  { name: 'LinkedIn', percentage: 12.3 },
  { name: 'Instagram', percentage: 10.9 },
  { name: 'Snapchat', percentage: 9.9 },
];

const SocialMedia = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
    <div style={{ fontSize: 12, fontWeight: 900, color: '#6d6e71', width: '100%', height: 25, backgroundColor: '#e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10 }}>Social Media</div>
    <HorizontalBarChart data={data} />
  </div>
);

SocialMedia.propTypes = {
  width: PropTypes.number,
};

export default SocialMedia;
