/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-grid-system';

import Overview from './Overview';
import Metadata from './Metadata';

const metadata = {
  age: [
    { name: '20s', count: 183 },
    { name: '30s', count: 70 },
    { name: '40s', count: 35 },
    { name: '50s', count: 15 },
    { name: '65+', count: 10 },
  ],
  gender: [
    { name: 'Male', count: 183 },
    { name: 'Female', count: 70 },
  ],
  lsm: [
    { name: '1-3', count: 183 },
    { name: '4-7', count: 70 },
    { name: '8-10', count: 35 },
    { name: '11-13', count: 15 },
  ],
  location: [
    { name: 'Nairobi', count: 183 },
    { name: 'Limuru', count: 70 },
    { name: 'Kiambu', count: 35 },
    { name: 'Murang\'a', count: 15 },
    { name: 'Kajiado', count: 10 },
  ],
};

const overview = [
  { name: 'Average Age', value: 29, percentage: 3.48 },
  { name: 'Average Spend', value: 2750, percentage: -0.98 },
  { name: 'Top location', value: 'ABC Place', percentage: -1.4 },
  { name: 'Bottom location', value: 'Hurlingham', percentage: -10.5 },
  { name: 'Biggest Spender', value: 'John Doe', amount: 56000, percentage: 19.7 },
  { name: 'Lowest Spender', value: 'John Doe', amount: 100, percentage: 1.6 },
];

const Summary = ({ width, isLoading }) => (
  <div style={{ width: '100%', padding: width > 425 ? '0 10px 0 10px' : 0 }}>
    <Row style={{ width: '100%', margin: 0, padding: 0 }}>
      <Col xl={8} lg={8} md={8} sm={12} xs={12} style={{ padding: 0 }}>
        <Overview overview={overview} isLoading={isLoading} />
      </Col>
      <Col xl={4} lg={4} md={4} sm={12}>
        <Metadata metadata={metadata} isLoading={isLoading} />
      </Col>
    </Row>
  </div>
);

Summary.propTypes = {
  width: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default Summary;
