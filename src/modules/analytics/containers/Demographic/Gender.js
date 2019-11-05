import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import DemographicGraph from './Graph';

const dataSchema = [
  { min: 18, max: 24, ageGroup: '18-24', male: 0, female: 0 },
  { min: 25, max: 34, ageGroup: '25-34', male: 0, female: 0 },
  { min: 35, max: 44, ageGroup: '35-44', male: 0, female: 0 },
  { min: 45, max: 54, ageGroup: '45-54', male: 0, female: 0 },
  { min: 55, max: 64, ageGroup: '55-64', male: 0, female: 0 },
  { min: 65, max: 100, ageGroup: '65+', male: 0, female: 0 },
];

const xAxis = { key: 'ageGroup', label: 'Age Group' };
const yAxis = { key: 'gender', label: 'Gender', bars: ['male', 'female'] };

const Gender = ({ data, width }) => {
  dataSchema.forEach((group, index) => {
    let { male, female } = group;
    if (data) {
      data.filter((record) => parseInt(record.age, 10) >= group.min && parseInt(record.age, 10) <= group.max)
        .forEach((record) => {
          male += parseInt(record.male, 10);
          female += parseInt(record.female, 10);
        });
    }
    dataSchema[index] = { ...dataSchema[index], male, female };
  });

  return (
    <Col xl={4} lg={4} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Gender</div>
        <DemographicGraph data={dataSchema} xAxis={xAxis} yAxis={yAxis} />
      </div>
    </Col>
  );
};

Gender.propTypes = {
  width: PropTypes.number,
  data: PropTypes.array,
};

export default Gender;
