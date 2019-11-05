/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

export default class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    nodes: PropTypes.array,
  }

  render() {
    const { data: original, nodes } = this.props;
    const data = original.filter((record) => nodes.includes(record.theme));
    return (
      <div style={{ width: '100%', height: 430, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius={150} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="theme" />
            <PolarRadiusAxis />
            <Legend />
            <Tooltip />
            <Radar name="NPS" dataKey="nps" stroke="rgb(191,42,44)" fill="rgb(191,42,44)" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
