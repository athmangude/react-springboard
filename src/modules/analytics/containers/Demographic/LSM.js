/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import DemographicGraph from './Graph';

const dataSchema = [
  { min: 1, max: 4, lsmGroup: '1-4', count: 0 },
  { min: 5, max: 8, lsmGroup: '5-8', count: 0 },
  { min: 9, max: 12, lsmGroup: '9-12', count: 0 },
  { min: 13, max: 17, lsmGroup: '13-17', count: 0 },
];

const xAxis = { key: 'lsmGroup', label: 'LSM Group' };
const yAxis = { key: 'count', label: 'Count', bars: ['count'] };

const LSM = ({ data, width }) => {
  const total = data && Object.values(data).length ? Object.values(data).reduce((previousValue, currentValue) => previousValue + currentValue) : 1;
  dataSchema.forEach((group, index) => {
    let { count } = group;
    if (data) {
      Object.keys(data)
        .filter((key) => parseInt(key, 10) >= group.min && parseInt(key, 10) <= group.max)
        .forEach((key) => {
          count += parseInt(data[key], 10);
        });
    }
    const percentage = parseInt(((count / total) * 100), 10);
    dataSchema[index] = { ...dataSchema[index], count, percentage };
  });
  return (
    <Col xl={4} lg={4} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>LSM</div>
        <DemographicGraph data={dataSchema} xAxis={xAxis} yAxis={yAxis} />
      </div>
    </Col>
  );
};

LSM.propTypes = {
  width: PropTypes.number,
  data: PropTypes.object,
};

export default LSM;
