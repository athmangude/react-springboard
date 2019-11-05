import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import CustomTooltip from './CustomTooltip';

const max = 100;
const min = 0;

const DemographicGraph = ({ data, xAxis, yAxis, loading, bars = 8 }) => {
  if (loading) {
    return (
      <div style={{ width: '100%', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: 150, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {
            Array.from(new Array(bars), (val, index) => index + 1).map((bar) => (
              <div key={bar} style={{ width: '100%', height: '100%', position: 'relative' }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', height: `${Math.floor(Math.random() * (max - min)) + min}%`, position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><RectShape color="#d9d9d9" style={{ width: 10, height: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5, marginRight: 0 }} /></div>} />
              </div>
            ))
          }
          <div style={{ position: 'absolute', width: '100%', top: 0, backgroundColor: 'rgba(204, 204, 204, 0.5)', height: 1 }}></div>
          <div style={{ position: 'absolute', width: '100%', top: '25%', backgroundColor: 'rgba(204, 204, 204, 0.5)', height: 1 }}></div>
          <div style={{ position: 'absolute', width: '100%', top: '50%', backgroundColor: 'rgba(204, 204, 204, 0.5)', height: 1 }}></div>
          <div style={{ position: 'absolute', width: '100%', top: '75%', backgroundColor: 'rgba(204, 204, 204, 0.5)', height: 1 }}></div>
          <div style={{ position: 'absolute', width: '100%', top: '100%', backgroundColor: 'rgba(204, 204, 204, 0.5)', height: 1 }}></div>
        </div>
        <div style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RoundShape color="#d9d9d9" style={{ width: 15, height: 15, marginRight: 10 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 70, height: 15 }} /></div>} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RoundShape color="#d9d9d9" style={{ width: 15, height: 15, marginRight: 10 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 70, height: 15 }} /></div>} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <BarChart barCategoryGap={5} data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="0 0" vertical={false} />
          <XAxis allowDataOverflow tickLine={false} dataKey={xAxis.key} />
          <YAxis tickLine={false} hide />
          <Tooltip content={<CustomTooltip xAxis={xAxis} yAxis={yAxis} />} />
          <Legend iconType="circle" />
          <defs>
            <linearGradient id="bar-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2574a6" stopOpacity={1} />
              <stop offset="100%" stopColor="#c86dd7" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="bar-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#429321" stopOpacity={1} />
              <stop offset="100%" stopColor="#b4ec51" stopOpacity={1} />
            </linearGradient>
          </defs>
          {
            yAxis.bars.map((bar, index) => (
              <Bar key={bar} dataKey={bar} fill={`url(#bar-${index + 1})`} maxBarSize={yAxis.bars.length > 1 ? 10 : 20} radius={yAxis.bars.length > 1 ? [5, 5, 0, 0] : [10, 10, 0, 0]} />
            ))
          }
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

DemographicGraph.propTypes = {
  data: PropTypes.array,
  xAxis: PropTypes.object,
  yAxis: PropTypes.object,
  loading: PropTypes.bool,
  bars: PropTypes.number,
};

export default DemographicGraph;
