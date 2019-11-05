/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

import MwambaLabelWithIcon from 'SharedComponents/mwamba-label-with-icon';

const Chart = ({ data, title, value, percentageIncrease, label }) => (
  <div style={{ width: '100%', height: 150, position: 'relative' }}>
    <div style={{ position: 'absolute', width: '100%', height: 150 }}>
      <div style={{ height: 150, right: 20, top: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#6d6e71', margin: '0 auto' }}>
        <div style={{ fontSize: 16, fontWeight: 900, textTransform: 'capitalize' }}>{title}</div>
        <div style={{ textTransform: 'capitalize' }}>
          {label}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>{value}</div>
        <MwambaLabelWithIcon icon={percentageIncrease > 0 ? 'trending_up' : percentageIncrease < 0 ? 'trending_down' : 'trending_flat'} text={`${percentageIncrease.toFixed(2)}%`} style={{ backgroundColor: percentageIncrease > 0 ? '#52bf8a' : percentageIncrease < 0 ? '#ae84a7' : 'rgb(136, 136, 136)' }} />
      </div>
    </div>
    <ResponsiveContainer>
      <PieChart>
        <defs>
          <linearGradient id="interaction" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2574a6" stopOpacity={1} />
            <stop offset="100%" stopColor="#c86dd7" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Pie data={data} innerRadius={55} outerRadius={65} fill="#e2e4eb" startAngle={90} endAngle={450}>
          {
            data.map((entry) => {
              if (entry.name === 'current') {
                return (<Cell fill="url(#interaction)" />);
              }
              return (<Cell fill="#e2e4eb" />);
            })
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

Chart.propTypes = {
  data: PropTypes.array,
  value: PropTypes.number,
  title: PropTypes.string,
  percentageIncrease: PropTypes.number,
  label: PropTypes.string,
};

export default Chart;
