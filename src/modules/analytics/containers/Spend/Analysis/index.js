import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import CustomPieChart from './PieChart';

const colors = ['#2574a6', '#f8b721', '#e45f56', '#ae84a7', '#52bf8a'];

const data = {
  averageSpend: {
    title: 'Av. Spend Per Customer',
    amount: 1200,
    ratio: [
      { name: 'remaining', value: 25 },
      { name: 'used', value: 75 },
    ],
  },
  averageRevenue: {
    title: 'Av. Revenue Per Customer (ARPU)',
    amount: 2400,
    ratio: [
      { name: 'remaining', value: 83 },
      { name: 'used', value: -17 },
    ],
  },
  hltv: {
    title: 'Highest Lifetime Value (HLTV)',
    amount: 1800,
    ratio: [
      { name: 'remaining', value: 87 },
      { name: 'used', value: -13 },
    ],
  },
  lvc: {
    title: 'Av. Lifetime Value (LVC)',
    amount: 1800,
    ratio: [
      { name: 'remaining', value: 25 },
      { name: 'used', value: 75 },
    ],
  },
};

const Analysis = ({ width }) => (
  <Col xl={6} lg={6} md={6} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Analysis</div>
      <div style={{ display: 'flex', flexDirection: width > 728 ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 5 }}>
        {
          Object.keys(data).map((key, index) => (<CustomPieChart key={key} data={data[key].ratio} title={data[key].title} amount={data[key].amount} color={colors[index]} />))
        }
      </div>
    </div>
  </Col>
);

Analysis.propTypes = {
  width: PropTypes.number,
};

export default Analysis;
