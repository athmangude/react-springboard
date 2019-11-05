import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import CustomTooltip from './CustomTooltip';

const SpendGraph = ({ data }) => (
  <div style={{ width: '100%', height: 150 }}>
    <ResponsiveContainer>
      <BarChart
        barCategoryGap={5}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis allowDataOverflow tickLine={false} dataKey="period" />
        <YAxis tickLine={false} hide />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <defs>
          <linearGradient id="engagements" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2574a6" stopOpacity={1} />
            <stop offset="100%" stopColor="#c86dd7" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Bar dataKey="engagements" fill="url(#engagements)" maxBarSize={10} radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

SpendGraph.propTypes = {
  data: PropTypes.array,
};

export default SpendGraph;
