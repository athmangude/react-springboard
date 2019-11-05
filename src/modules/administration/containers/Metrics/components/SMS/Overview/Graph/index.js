/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import CustomTooltip from './CustomTooltip';
import IconButton from 'SharedComponents/icon-button';

export default class Graph extends Component {
  static propTypes = {
    data: PropTypes.array,
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

  componentWillReceiveProps(newProps) {
    const { data: oldData } = this.props;
    const { data: newData } = newProps;
    if (oldData.length !== newData.length) {
      const right = newData.length > 10 ? -40 * (newData.length - 10) : 0;
      this.state = {
        left: 0,
        right,
      };
    }
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
    const { data, chartType } = this.props;
    const { left, right } = this.state;
    const positionLeft = left ? 35 : 0;
    const positionRight = right ? 35 : 0;
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <defs>
                    <linearGradient id="incoming" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f26b50" stopOpacity={1} />
                      <stop offset="100%" stopColor="#f26b50" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="outgoing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fcda6e" stopOpacity={1} />
                      <stop offset="100%" stopColor="#fcda6e" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="reminders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a3d39c" stopOpacity={1} />
                      <stop offset="100%" stopColor="#a3d39c" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="incoming" fill="url(#incoming)" maxBarSize={10} radius={[5, 5, 0, 0]} />
                  <Bar dataKey="outgoing" fill="url(#outgoing)" maxBarSize={10} radius={[5, 5, 0, 0]} />
                  <Bar dataKey="reminders" fill="url(#reminders)" maxBarSize={10} radius={[5, 5, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} />
                  <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                  <YAxis tickLine={false} hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="linear" dataKey="incoming" stroke="#f26b50" strokeWidth={2} dot={{ stroke: '#f26b50', strokeWidth: 2, r: 4 }} />
                  <Line type="linear" dataKey="outgoing" stroke="#fcda6e" strokeWidth={2} dot={{ stroke: '#fcda6e', strokeWidth: 2, r: 4 }} />
                  <Line type="linear" dataKey="reminders" stroke="#a3d39c" strokeWidth={2} dot={{ stroke: '#a3d39c', strokeWidth: 2, r: 4 }} />
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
