/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import MwambaHorizontalBarChart from 'Utils/mwamba-horizontal-bar-chart';

const HorizontalBarChart = ({ data, title, large = false }) => {
  const total = data ? Object.values(data).reduce((previousValue, currentValue) => previousValue + currentValue, 0) : 1;
  const dataSchema = data ? Object.keys(data).map((key) => ({ name: key, count: data[key], percentage: ((data[key] / total) * 100).toFixed(0) })) : [];
  return (
    <Col xl={large ? 6 : 4} lg={large ? 6 : 4} md={large ? 12 : 6} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>{title}</div>
        <MwambaHorizontalBarChart data={dataSchema} />
      </div>
    </Col>
  );
};

HorizontalBarChart.propTypes = {
  large: PropTypes.bool,
  data: PropTypes.object,
  title: PropTypes.string,
};

export default HorizontalBarChart;
