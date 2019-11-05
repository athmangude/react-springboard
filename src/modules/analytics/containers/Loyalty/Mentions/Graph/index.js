/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import CustomTooltip from './CustomTooltip';
import IconButton from 'SharedComponents/icon-button';

export default class CommentsGraph extends Component {
  static propTypes = {
    data: PropTypes.array,
    themes: PropTypes.array,
    colors: PropTypes.array,
    chartType: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const right = props.data.length > 10 ? -40 * (props.data.length - 10) : 0;
    this.state = {
      left: 0,
      right,
    };

    this.onPanLeft = this.onPanLeft.bind(this);
    this.onPanRight = this.onPanRight.bind(this);
  }

  onPanLeft() {
    const { left, right } = this.state;
    if ((left + 100) >= 50) return;
    this.setState({ right: right - 100, left: left + 100 });
  }

  onPanRight() {
    const { left, right } = this.state;
    if ((right + 100) >= 50) return;
    this.setState({ left: left - 100, right: right + 100 });
  }

  render() {
    const { themes, data, colors, chartType } = this.props;
    const { left, right } = this.state;
    const positionLeft = left && themes.length ? 35 : 0;
    const positionRight = right && themes.length ? 35 : 0;
    return (
      <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {positionLeft ? (<IconButton icon="arrow_back_ios" onClick={this.onPanLeft} style={{ margin: 0, padding: 0, border: '1px solid #d9d9d9' }} />) : null}
        <div style={{ width: `calc(100% - ${positionLeft + positionRight}px)`, height: 300 }}>
          <ResponsiveContainer>
            {
              chartType === 'bar' ? (
                <BarChart barCategoryGap={5} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} />
                  <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                  <YAxis tickLine={false} hide />
                  <Tooltip content={<CustomTooltip themes={themes} colors={colors} />} />
                  <Legend />
                  {
                    themes.map((theme, index) => (
                      <defs>
                        <linearGradient id={theme} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors[index]} stopOpacity={1} />
                          <stop offset="100%" stopColor={colors[index]} stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                    ))
                  }
                  {
                    themes.map((theme) => (
                      <Bar dataKey={theme} fill={`url(#${theme})`} maxBarSize={10} radius={[5, 5, 0, 0]} />
                    ))
                  }
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} />
                  <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                  <YAxis tickLine={false} hide />
                  <Tooltip content={<CustomTooltip themes={themes} colors={colors} />} />
                  <Legend />
                  {
                    themes.map((theme, index) => (
                      <Line type="linear" dataKey={theme} stroke={colors[index]} strokeWidth={2} dot={{ stroke: colors[index], strokeWidth: 2, r: 4 }} />
                    ))
                  }
                </LineChart>
              )
            }
          </ResponsiveContainer>
        </div>
        {positionRight ? (<IconButton icon="arrow_forward_ios" onClick={this.onPanRight} style={{ margin: 0, padding: 0, border: '1px solid #d9d9d9' }} />) : null}
      </div>
    );
  }
}
