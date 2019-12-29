/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

import themes from 'SharedComponents/themes';

const theme = themes.light;

const { secondaryColor } = theme;

const CircularProgressbar = ({ label, percent }) => {
  const data = [
    { name: 'remaining', value: 100 - parseFloat(percent, 10) },
    { name: 'used', value: parseFloat(percent, 10) },
  ];

  return (
    <div style={{ width: '100%', height: 100, position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: 100 }}>
        <div
          style={{
            height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#6d6e71', margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 900 }}>{`${percent}%`}</div>
          <div>{label}</div>
        </div>
      </div>
      <ResponsiveContainer>
        <PieChart>
          <defs>
            <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={secondaryColor} stopOpacity={1} />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity={1} />
            </linearGradient>
          </defs>
          <Pie data={data} innerRadius={35} outerRadius={45} fill="#e2e4eb" startAngle={90} endAngle={450}>
            {
              data.map((entry) => {
                if (entry.name === 'used') {
                  return (<Cell fill="url(#spend)" />);
                }
                return (<Cell fill="#e2e4eb" />);
              })
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

CircularProgressbar.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number,
};

export default CircularProgressbar;
