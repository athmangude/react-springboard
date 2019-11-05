/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import CustomTooltip from './CustomTooltip';
import IconButton from 'SharedComponents/icon-button';
import themes from 'SharedComponents/themes';
const { primaryColor, lightPrimaryColor } = themes.light;

export default class SpendOverTime extends Component {
  static propTypes = {
    data: PropTypes.array,
    payments: PropTypes.array,
    chartType: PropTypes.string,
    currency: PropTypes.string,
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
    const { data, chartType, currency } = this.props;
    const { left, right } = this.state;
    const positionLeft = left ? 35 : 0;
    const positionRight = right ? 35 : 0;
    const toolTipData = [
      {
        labelName: currency || 'KES',
        dataKey: 'amount',
      },
    ];
    
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
                  <Tooltip content={<CustomTooltip toolTipData={toolTipData} />} />
                  <Legend />
                  <Bar dataKey="amount" fill={primaryColor} maxBarSize={40} />
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} />
                  <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                  <YAxis tickLine={false} hide />
                  <Tooltip content={<CustomTooltip toolTipData={toolTipData} />} />
                  <Legend />
                  <Line type="linear" dataKey="amount" stroke={primaryColor} strokeWidth={2} dot={{ stroke: primaryColor, strokeWidth: 2, r: 4 }} />
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
