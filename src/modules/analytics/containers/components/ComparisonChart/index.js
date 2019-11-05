/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary, prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Sector, Cell, Surface, Symbols } from 'recharts';

import CustomTooltip from './CustomTooltip';
import ChartTypes from '../ChartTypes';
import Intervals from '../Intervals';
import Title from '../Title';
import IconButton from 'SharedComponents/icon-button';

export default class ComparisonChart extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    width: PropTypes.number,
    chartOptions: PropTypes.array,
    defaultChartType: PropTypes.string,
    defaultInterval: PropTypes.string,
    hideInterval: PropTypes.bool,
    benchmark: PropTypes.bool,
    nonLinear: PropTypes.bool,
    dataKeys: PropTypes.array,
    yAxis: PropTypes.string,
    colors: PropTypes.array,
    isLoading: PropTypes.bool,
    onIntervalChange: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const { defaultChartType, data, chartOptions, dataKeys = ['current'] } = this.props;
    const right = data.length > 10 ? -40 * (data.length - 10) : 0;

    let chartType = null;
    if (defaultChartType) {
      chartType = defaultChartType;
    } else if (chartOptions.length) {
      chartType = chartOptions[0];
    }
    const opacity = {};
    dataKeys.forEach((key) => {
      opacity[key] = 1;
    });

    this.state = {
      left: 0,
      right,
      chartType,
      activeIndex: 0,
      opacity,
      dataKeys,
    };

    this.onMouseEnterLegend = this.onMouseEnterLegend.bind(this);
    this.onMouseLeaveLegend = this.onMouseLeaveLegend.bind(this);
    this.onChartTypeChange = this.onChartTypeChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onDateFilterOptionChange = this.onDateFilterOptionChange.bind(this);
    this.onPanLeft = this.onPanLeft.bind(this);
    this.onPanRight = this.onPanRight.bind(this);
    this.onPieEnter = this.onPieEnter.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
    this.renderCusomizedLegend = this.renderCusomizedLegend.bind(this);
    this.renderActiveShape = this.renderActiveShape.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { nonLinear, data: newData, dataKeys: newDataKeys } = newProps;
    const { data: oldData, dataKeys: oldDataKeys } = this.props;
    if (!nonLinear) {
      if (oldData.length !== newData.length) {
        const right = newData.length > 10 ? -40 * (newData.length - 10) : 0;
        this.setState(() => ({ left: 0, right, dataKeys: newDataKeys || ['previous', 'current'] }));
      }
      if (oldDataKeys !== newDataKeys) {
        this.setState({ dataKeys: newDataKeys || ['previous', 'current'] });
      }
    } else if (oldDataKeys !== newDataKeys) {
      this.setState({ dataKeys: newDataKeys || ['previous', 'current'] });
    }
  }

  onMouseEnterLegend(o) {
    const { dataKey } = o;
    const { opacity } = this.state;

    Object.keys(opacity).forEach((key) => {
      opacity[key] = 0;
    });

    this.setState({ opacity: { ...opacity, [dataKey]: 1 } });
  }

  onMouseLeaveLegend() {
    const { opacity } = this.state;

    Object.keys(opacity).forEach((key) => {
      opacity[key] = 1;
    });

    this.setState({ opacity: { ...opacity } });
  }

  onChartTypeChange(chartType) {
    const { data } = this.props;
    const { dataKeys } = this.state;
    let { right } = this.state;
    if (['stacked'].includes(chartType)) {
      right = dataKeys.length > 10 ? -40 * (dataKeys.length - 10) : 0;
    } else if (chartType === 'line') {
      right = data.length > 10 ? -40 * (data.length - 10) : 0;
    }
    this.setState({ chartType, left: 0, right });
  }

  onIntervalChange(interval) {
    const { onIntervalChange } = this.props;
    onIntervalChange(interval);
  }

  onDateFilterOptionChange(range) {
    console.log(range);
    // Call method
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

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }

  onGoTo(path) {
    const { router } = this.context;
    return router.history.push(path);
  }

  renderCusomizedLegend(props) {
    const { payload, verticalAlign, rangeDays } = props;

    return (
      <div className="hide-scrollbars" style={{ width: '100%', display: 'flex', flexDirection: verticalAlign === 'middle' ? 'column' : 'row', alignItems: verticalAlign === 'middle' ? 'flex-start' : 'center', justifyContent: 'center', color: '#4a4a4a', font: '300 14px/1.4 Roboto, sans-serif', position: 'absolute', right: 10, height: '100%', overflowX: verticalAlign === 'middle' ? 'none' : 'scroll' }}>
        {
          payload.map((entry) => {
            const { dataKey, color, value } = entry;
            let label = dataKey || value;
            if (dataKey === 'previous') {
              label += ` (Last ${rangeDays} days)`;
            } else if (dataKey === 'current') {
              label += ' (X)';
            }
            return (
              <span style={{ marginLeft: 10, marginRight: 10 }} onMouseEnter={() => this.onMouseEnterLegend(entry)} onMouseLeave={() => this.onMouseLeaveLegend(entry)}>
                <Surface width={10} height={10} viewBox="0 0 10 10">
                  <Symbols cx={5} cy={5} type="rect" size={50} fill={color} />
                </Surface>
                <span style={{ marginLeft: 5, textTransform: 'capitalize' }}>{label}</span>
              </span>
            );
          })
        }
      </div>
    );
  }

  renderActiveShape(props) {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="svg-text-style">{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="svg-text-style">{`${payload.name} ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="svg-text-style">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  }

  render() {
    const { data: rawData, title, width, chartOptions, defaultChartType, defaultInterval, hideInterval, nonLinear, yAxis, benchmark, colors, isLoading } = this.props;
    const { left, right, chartType, activeIndex, dataKeys, opacity } = this.state;
    let data = rawData;
    const positionLeft = left ? 35 : 0;
    const positionRight = right ? 35 : 0;
    if (['stacked'].includes(chartType)) {
      const sumOfKeys = {};
      dataKeys.forEach((key) => {
        if (yAxis) {
          const rec = data.filter((record) => record.name === key)[0];
          sumOfKeys[key] = rec ? rec[yAxis] : 0;
        } else {
          sumOfKeys[key] = data.reduce((accumulator, currentValue) => accumulator + (Number.isNaN(currentValue[key]) ? 0 : currentValue[key]), 0);
        }
      });
      data = [{ period: 'Cumulative', ...sumOfKeys }];
    }

    return (
      <div style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <div style={{ width: '100%' }}>
          <Title title={title} />
        </div>
        <div style={{ height: 40, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <ChartTypes onChange={this.onChartTypeChange} chartOptions={chartOptions} defaultChartType={defaultChartType} width={width} />
          {
            !hideInterval ? (
              <Intervals onIntervalChange={this.onIntervalChange} defaultInterval={defaultInterval || 'daily'} width={width} />
            ) : null
          }
        </div>
        {
          isLoading ? (
            <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
            </div>
          ) : (!dataKeys.length) ? (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
          ) : (
            <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '2px 5px', font: '300 12px/14px Roboto,sans-serif', letterSpacing: 0.01, position: 'relative' }}>
              {positionLeft ? (<IconButton icon="keyboard_arrow_left" onClick={this.onPanLeft} style={{ margin: 0, padding: 0, border: '1px solid #d9d9d9' }} />) : null}
              <div style={{ width: `calc(100% - ${positionLeft + positionRight}px)`, height: 300 }}>
                <ResponsiveContainer>
                  {
                    chartType === 'bar' ? (
                      <BarChart barCategoryGap={5} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="0 0" vertical={false} />
                        <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                        <YAxis tickLine={false} hide />
                        <Tooltip content={<CustomTooltip xKey="period" nonLinear={nonLinear} dataKeys={dataKeys} chartType={chartType} interval={defaultInterval} />} />
                        <Legend content={this.renderCusomizedLegend} rangeDays={30} />
                        <ReferenceLine y={0} stroke="#000" />
                        {
                          dataKeys.map((dataKey, index) => (
                            <Bar dataKey={dataKey} fill={colors ? colors[index % colors.length] : `rgba(21, 78, 137, ${(dataKeys.length - index) / dataKeys.length})`} maxBarSize={40} />
                          ))
                        }
                      </BarChart>
                    ) : chartType === 'stacked' ? (
                      <BarChart barCategoryGap={5} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="0 0" vertical={false} />
                        <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                        <YAxis tickLine={false} hide />
                        <Tooltip content={<CustomTooltip xKey="period" nonLinear={nonLinear} dataKeys={dataKeys} chartType={chartType} interval={defaultInterval}  />} />
                        <Legend content={this.renderCusomizedLegend} rangeDays={30} />
                        {
                          dataKeys.map((dataKey, index) => (
                            <Bar dataKey={dataKey} stackId="a" fill={colors ? colors[index % colors.length] : `rgba(21, 78, 137, ${(dataKeys.length - index) / dataKeys.length})`} maxBarSize={40} />
                          ))
                        }
                      </BarChart>
                    ) : chartType === 'line' ? (
                      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="0 0" vertical={false} />
                        <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                        <YAxis tickLine={false} hide />
                        <Tooltip content={<CustomTooltip xKey="period" nonLinear={nonLinear} dataKeys={dataKeys} chartType={chartType} benchmark={benchmark} interval={defaultInterval}  />} />
                        <Legend content={this.renderCusomizedLegend} rangeDays={30} />
                        {
                          dataKeys.map((dataKey, index) => (
                            <Line key={dataKey} type="linear" dataKey={dataKey} stroke={colors ? colors[index % colors.length] : `rgba(21, 78, 137, ${(index + 1) / dataKeys.length})`} strokeOpacity={opacity[dataKey]} strokeWidth={2} dot={false} strokeDasharray={dataKey === 'previous' ? '5 5' : ''} />
                          ))
                        }
                        {
                          benchmark ? (
                            <Line key="benchmark" type="linear" dataKey="benchmark" stroke="rgba(191, 42, 44, 0.7)" strokeWidth={1} dot={false} strokeDasharray="" />
                          ) : null
                        }
                      </LineChart>
                    ) : chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={this.renderActiveShape}
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="rgb(72, 125, 179)"
                          dataKey="count"
                          startAngle={-270}
                          onMouseEnter={this.onPieEnter}
                        >
                          {
                            data.map((entry, index) => (<Cell key={`cell-${entry.name}`} fill={colors ? colors[index % colors.length] : `rgba(72, 125, 179, ${(data.length - index) / data.length})`} />))
                          }
                        </Pie>
                        <Legend content={this.renderCusomizedLegend} verticalAlign="middle" />
                      </PieChart>
                    ) : (<div></div>)
                  }
                </ResponsiveContainer>
              </div>
              {positionRight ? (<IconButton icon="keyboard_arrow_right" onClick={this.onPanRight} style={{ margin: 0, padding: 0, border: '1px solid #d9d9d9' }} />) : null}
            </div>
          )
        }
      </div>
    );
  }
}
