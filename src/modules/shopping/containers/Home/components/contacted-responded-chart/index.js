/* eslint-disable jsx-a11y/interactive-supports-focus, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Statistic, Divider } from 'semantic-ui-react';
import { BarChart, Bar, CartesianGrid, Tooltip } from 'recharts';
import moment from 'moment';
import numeral from 'numeral';
import ContainerDimensions from 'react-container-dimensions';
import MonthPicker from '../month-picker';

import './index.css';

const styles = {
  statisticValue: {
    color: '#808285',
    fontSize: 20,
  },
  statisticLabel: {
    textTransform: 'capitalize',
    color: '#808285',
    fontWeight: 'lighter',
    fontSize: 10,
  },
};

export default class ContactedRespondedChart extends Component {
  static propTypes = {
    totalContacted: PropTypes.number.isRequired,
    contacted: PropTypes.array.isRequired,
    date: PropTypes.object,
    isFetchingContacted: PropTypes.bool.isRequired,
    handleDateChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onScrollLeft = this.onScrollLeft.bind(this);
    this.onScrollRight = this.onScrollRight.bind(this);
  }

  state = {
    canScrollRight: true,
    canScrollLeft: false,
  }

  onScrollLeft() {
    const before = this.barChartContainer.scrollLeft;
    this.barChartContainer.scrollLeft -= 20;
    const after = this.barChartContainer.scrollLeft;

    if (before === after) {
      return this.setState({ canScrollLeft: false });
    }

    return this.setState({ canScrollLeft: true, canScrollRight: true });
  }

  onScrollRight() {
    const before = this.barChartContainer.scrollLeft;
    this.barChartContainer.scrollLeft += 20;
    const after = this.barChartContainer.scrollLeft;

    if (before === after) {
      return this.setState({ canScrollRight: false });
    }

    return this.setState({ canScrollLeft: true, canScrollRight: true });
  }

  render() {
    return (
      <div className="contacted-responded-chart" style={{ width: '100%', margin: '10px 0' }}>
        <ContainerDimensions>
          {
            ({ width }) => (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <b style={{ color: '#6d6e71', fontSize: 14 }}>{this.props.totalContacted > 999 ? numeral(this.props.totalContacted).format('0.0a') : numeral(this.props.totalContacted).format('0a')}&nbsp;People Contacted</b>
                  <MonthPicker currentSelectionDate={this.props.date} isFetchingContacted={this.props.isFetchingContacted} handleDateChanged={this.props.handleDateChanged} />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <div style={{ width, position: 'relative' }}>
                    {
                      this.state.canScrollLeft ? (
                        <div className="scroll-button" role="button" onClick={this.onScrollLeft} style={{ position: 'absolute', top: 50, left: -5, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30, width: 30, borderRadius: 15 }}>
                          <i className="material-icons" style={{ color: '#808285' }}>chevron_left</i>
                        </div>
                      ) : null
                    }
                    {
                      this.state.canScrollRight ? (
                        <div className="scroll-button" role="button" onClick={this.onScrollRight} style={{ position: 'absolute', top: 50, right: -10, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30, width: 30, borderRadius: 15 }}>
                          <i className="material-icons" style={{ color: '#808285' }}>chevron_right</i>
                        </div>
                      ) : null
                    }
                    <div ref={(div) => this.barChartContainer = div} className="bar-chart-container" style={{ width: width - 35, margin: '10px 20px', overflowX: 'scroll', position: 'relative' }}>
                      <BarChart
                        width={600}
                        height={100}
                        data={this.props.contacted}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Tooltip
                          offset={-10}
                          cursor={{ fill: '#f0f0f0', fillOpacity: 0.5 }}
                          content={({ payload }) => {
                            if (payload && payload.length) {
                              return (
                                <div style={{ height: 36, width: 58, borderRadius: 15, backgroundColor: '#33597f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative', left: -20 }}>
                                  <span style={{ color: '#FFFFFF', fontSize: 6, margin: 0 }}>{moment(payload[0].payload.date).format('MMM DD, YYYY')}</span>
                                  <span style={{ color: '#FFFFFF', fontSize: 10, margin: -10 }}>{payload[0].value}</span>
                                  <span style={{ color: '#FFFFFF', fontSize: 6, margin: 0 }}>{payload[0].name}</span>
                                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #33597f', position: 'absolute', bottom: -5 }} />
                                </div>
                              );
                            }

                            return (
                              <div />
                            );
                          }}
                        />
                        <CartesianGrid
                          stroke="#eee"
                          strokeDasharray="0 0"
                        />
                        <Bar
                          dataKey="respondents"
                          maxBarSize={80}
                          minPointSize={1}
                          barCategoryGap="1%"
                          fill="#aed8f2"
                          stackId="a"
                        />
                      </BarChart>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </ContainerDimensions>
        <Divider />
      </div>
    );
  }
}
