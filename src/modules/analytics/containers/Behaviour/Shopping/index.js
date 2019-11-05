import React from 'react';
import PropTypes from 'prop-types';

import Style from './Style';
import Place from './Place';
import Source from './Source';

const Shopping = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)', marginBottom: 20 }}>
    <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Shopping</div>
    <Style />
    <Place />
    <Source />
  </div>
);

Shopping.propTypes = {
  width: PropTypes.number,
};

export default Shopping;
