/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import CustomTooltip from './CustomTooltip';
import IconButton from 'SharedComponents/icon-button';

const toolTipData= [
  {
    labelName: 'Promoter',
    dataKey: 'promoters',
  },
  {
    labelName: 'Passives',
    dataKey: 'passives',
  },
  {
    labelName: 'Detractors',
    dataKey: 'detractors',
  },
];

export default class RatingOverTime extends Component {
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="promoters" stackId="a" fill="#80C582" />
                  <Bar dataKey="passives" stackId="a" fill="#FCDA6E" />
                  <Bar dataKey="detractors" stackId="a" fill="#F79480" />
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} />
                  <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                  <YAxis tickLine={false} hide />
                  <Tooltip content={<CustomTooltip toolTipData={toolTipData} />} />
                  <Legend />
                  <Line type="monotone" dataKey="promoters" stroke="#80C582" activeDot={{ r: 8 }} dot={{ stroke: '#80C582', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="passives" stroke="#FCDA6E" strokeWidth={2} dot={{ stroke: '#FCDA6E', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="detractors" stroke="#F79480" strokeWidth={2} dot={{ stroke: '#F79480', strokeWidth: 2, r: 4 }} />
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
