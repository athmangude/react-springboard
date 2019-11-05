/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';

const Description = ({ activeSegment }) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', pading: 10, fontSize: 14, color: '#808285', padding: 10 }}>
    {activeSegment.name}
    &nbsp;(800 customers)
  </div>
);

Description.propTypes = {
  activeSegment: PropTypes.object,
};

export default Description;
