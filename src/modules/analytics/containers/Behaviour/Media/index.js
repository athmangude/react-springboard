import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import SocialMedia from './SocialMedia';
import Websites from './Websites';
import Traditional from './Traditional';

const Media = ({ width }) => (
  <Col xl={6} lg={6} md={6} sm={12} xs={12} style={{ padding: width > 425 ? '0 10px 0 10px' : 0, borderRadius: 8 }}>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)', marginBottom: 20 }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Media</div>
      <SocialMedia />
      <Websites />
      <Traditional />
    </div>
  </Col>
);

Media.propTypes = {
  width: PropTypes.number,
};

export default Media;
