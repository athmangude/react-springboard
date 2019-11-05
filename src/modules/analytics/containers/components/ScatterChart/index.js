/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, prefer-destructuring */
import React, { Component } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import PropTypes from 'prop-types';

import ChartTypes from '../ChartTypes';
import Title from '../Title';

export default class Chart extends Component {
  static propTypes = {
    data: PropTypes.array,
    colors: PropTypes.array,
    title: PropTypes.string,
    dataKeys: PropTypes.array,
    xAxis: PropTypes.string,
    yAxis: PropTypes.string,
    defaultChartType: PropTypes.string,
    width: PropTypes.number,
    chartOptions: PropTypes.array,
    domain: PropTypes.array,
    yReferenceLine: PropTypes.number,
    xReferenceLine: PropTypes.number,
    bottomLeftLabel: PropTypes.string,
    bottomRightLabel: PropTypes.string,
    topLeftLabel: PropTypes.string,
    topRightLabel: PropTypes.string,
    diagonalSeparator: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    const { defaultChartType, chartOptions } = this.props;

    let chartType = null;
    if (defaultChartType) {
      chartType = defaultChartType;
    } else if (chartOptions.length) {
      chartType = chartOptions[0];
    }

    this.state = {
      chartType,
    };

    this.onChartTypeChange = this.onChartTypeChange.bind(this);
  }

  onChartTypeChange(chartType) {
    this.setState({ chartType });
  }

  render() {
    const { data, title, width, chartOptions, defaultChartType, xAxis, yAxis, colors, domain, yReferenceLine, xReferenceLine, dataKeys, bottomLeftLabel, bottomRightLabel, topLeftLabel, topRightLabel, diagonalSeparator } = this.props;
    const { chartType } = this.state;

    return (
      <div style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <div style={{ width: '100%' }}>
          <Title title={title} />
        </div>
        <div style={{ height: 40, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <ChartTypes onChange={this.onChartTypeChange} chartOptions={chartOptions} defaultChartType={defaultChartType} width={width} />
        </div>
        <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '2px 5px', font: '300 12px/14px Roboto,sans-serif', letterSpacing: 0.01, position: 'relative' }}>
          <div style={{ width: '100%', position: 'absolute', height: '100%', paddingLeft: 85, paddingRight: 35, paddingTop: 7, paddingBottom: 37 }}>
            {
              diagonalSeparator ? (
                <div style={{ height: '100%', width: '100%', background: 'linear-gradient(to left top, rgba(255, 255, 255, 0) calc(50% - 1px), #000000, rgba(255, 255, 255, 0) 50%)' }}></div>
              ) : null
            }
          </div>
          <div style={{ width: '100%', position: 'absolute', height: '100%', paddingLeft: 85, paddingRight: 35, paddingTop: 7, paddingBottom: 37 }}>
            <div style={{ width: '100%', height: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: 22, opacity: 0.5, textTransform: 'uppercase' }}>{topLeftLabel}</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: 22, opacity: 0.5, textTransform: 'uppercase' }}>{topRightLabel}</div>
            </div>
            <div style={{ width: '100%', height: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: 22, opacity: 0.5, textTransform: 'uppercase' }}>{bottomLeftLabel}</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: 22, opacity: 0.5, textTransform: 'uppercase' }}>{bottomRightLabel}</div>
            </div>
          </div>
          <ResponsiveContainer>
            {
              chartType === 'scatter' ? (
                <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey={xAxis} name={xAxis} tickLine={false} label={{ value: xAxis.charAt(0).toUpperCase() + xAxis.slice(1), position: 'bottom' }} unit="" domain={domain} />
                  <YAxis type="number" dataKey={yAxis} name={yAxis} tickLine={false} label={{ value: yAxis.charAt(0).toUpperCase() + yAxis.slice(1), angle: -90, position: 'insideLeft' }} unit="" />
                  <Tooltip cursor={{ strokeDasharray: '0 0' }} />
                  {
                    yReferenceLine ? (
                      <ReferenceLine y={yReferenceLine} stroke="#000000" strokeDasharray="3 3" />
                    ) : null
                  }
                  {
                    xReferenceLine ? (
                      <ReferenceLine x={xReferenceLine} stroke="#000000" strokeDasharray="3 3" />
                    ) : null
                  }
                  <Scatter name="" data={data} fill="rgb(72, 125, 179)">
                    <LabelList dataKey="name" position="bottom" />
                    {
                      data.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={colors ? colors[index % colors.length] : `rgba(21, 78, 137, ${(dataKeys.length - index) / dataKeys.length})`} />)
                    }
                  </Scatter>
                </ScatterChart>
              ) : null
            }
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
