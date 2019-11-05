import React from 'react';
import PropTypes from 'prop-types';

const MwambaInitialsCircle = ({ initials = 'NN', backgroundColor = '#d9d9d9' }) => (
  <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 25, backgroundColor }}>
    <span style={{ color: '#FFFFFF', backgroundColor: 'transparent', height: 22, fontFamily: 'Lato', fontSize: 18, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.4 }}>{initials}</span>
  </div>
);

MwambaInitialsCircle.propTypes = {
  initials: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default MwambaInitialsCircle;
