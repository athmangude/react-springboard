/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';
import RatingOverTime from '../../../Customers/Graph/RatingOverTime';
import ChartTypes from 'Modules/analytics/containers/components/ChartTypes';
import Intervals from 'Modules/analytics/containers/components/Intervals';

export default class Rating extends Component {
  static propTypes = {
    width: PropTypes.string,
    data: PropTypes.array,
    title: PropTypes.string,
    style: PropTypes.object,
    isLoading: PropTypes.bool,
    chartType: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { chartType } = props;

    this.state = {
      chartType: chartType || 'line',
    };

    this.onChangeChartType = this.onChangeChartType.bind(this);
  }

  onChangeChartType(chartType) {
    this.setState({ chartType });
  }

  render() {
    const { chartType } = this.state;
    const { width, title, data, isLoading, style } = this.props;

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0px 10px 10px' }}>
        {
          title ? (
            <div style={{ height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>{title}</div>
          ) : null
        }
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)', ...style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <ChartTypes defaultChartType={chartType} chartOptions={['line', 'bar']} onChange={this.onChangeChartType} width={width} />
              <Intervals onIntervalChange={() => console.log('Interval')} defaultInterval="daily" width={width} />
            </div>
          </div>
          <div style={{ width: '100%', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
            <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {
                  isLoading ? (
                    <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                    </div>
                  ) : !data.filter((record) => parseInt(record.passives + record.detractors + record.promoters, 10) !== 0).length ? (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
                  ) : (
                    <RatingOverTime data={data} chartType={chartType} />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
