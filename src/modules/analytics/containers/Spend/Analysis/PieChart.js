/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const CustomPieChart = ({ title, amount, data, color }) => {
  const used = data.find((d) => d.name === 'used');
  return (
    <div style={{ width: '100%', height: 195, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', fontSize: 11, fontWeight: 900, letterSpacing: 0.6, textAlign: 'center', color: '#6d6e71', height: 35 }}>{title}</div>
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
          <div style={{ height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.3, color }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>{used.value}%</div>
            <i className="material-icons">{used.value > 0 ? 'trending_up' : used.value < 0 ? 'trending_down' : 'trending_flat'}</i>
          </div>
        </div>
      </div>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} innerRadius={30} outerRadius={40} fill="#e2e4eb" startAngle={90} endAngle={450}>
            {
              data.map((entry) => {
                const renderColor = entry.name === 'used' ? color : '#e2e4eb';
                return (<Cell fill={renderColor} />);
              })
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ width: '100%', fontSize: 20, fontWeight: 900, letterSpacing: 0.6, textAlign: 'center', color: '#6d6e71' }}><span style={{ fontSize: 12 }}>Kshs. </span> {amount}</div>
    </div>
  );
};

CustomPieChart.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.number,
  data: PropTypes.array,
  color: PropTypes.string,
};

export default CustomPieChart;
