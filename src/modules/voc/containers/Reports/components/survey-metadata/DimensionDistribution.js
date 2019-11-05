import React, { Component } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { Button } from 'semantic-ui-react';

import Bar from './Bar';

export default class DimensionDistribution extends Component {
  static propTypes = {
    stats: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { stats } = props;
    const total = stats.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
    const metadataExists = !!stats.filter((stat) => stat.count > 0).length;
    let sortedStats = [];
    if (metadataExists) {
      sortedStats = orderBy(stats, ['count'], ['desc']).filter((stat) => stat.count > 0);
    }
    this.state = {
      defaultDisplay: 5,
      increment: 5,
      display: 5,
      stats,
      total,
      metadataExists,
      sortedStats,
    };

    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.stats !== this.props.stats) {
      const { stats } = newProps;
      const total = stats.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
      const metadataExists = !!stats.filter((stat) => stat.count > 0).length;
      let sortedStats = [];
      if (metadataExists) {
        sortedStats = orderBy(stats, ['count'], ['desc']).filter((stat) => stat.count > 0);
      }
      this.setState({
        stats,
        total,
        metadataExists,
        sortedStats,
      });
    }
  }

  showMore() {
    const { sortedStats, display, increment } = this.state;
    if (display < sortedStats.length) {
      this.setState({
        display: display + increment,
      });
    }
  }

  showLess() {
    const { defaultDisplay } = this.state;
    this.setState({ display: defaultDisplay });
  }

  render() {
    const { showLess, showMore } = this;
    const { defaultDisplay, display, metadataExists, sortedStats, total } = this.state;

    return (
      <div style={{ width: '100%', margin: '0 0 20px' }}>
        <span style={{ color: '#3d4553', fontSize: 13, fontWeight: 'bold' }}>Locations</span>
        {metadataExists ?
          (
            <div>
              {
                sortedStats.slice(0, display).map((stat, index) => (
                  <Bar label={stat.name} percentage={`${stat.count === 0 ? '0' : ((stat.count / total) * 100).toFixed(1)}%`} value={stat.count} key={`${index}-bar`} />
                ))
              }
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <Button disabled={display >= sortedStats.length} size="mini" onClick={showMore}>
                  <i className="material-icons" style={{ fontSize: 15 }}>add</i>
                </Button>
                <Button disabled={display === defaultDisplay} size="mini" onClick={showLess}>
                  <i className="material-icons" style={{ fontSize: 15 }}>expand_less</i>
                </Button>
              </div>
            </div>
          )
          : (
            <p style={{ color: '#808285', fontSize: 11 }}>No data exists</p>
          )}
      </div>
    );
  }
}
