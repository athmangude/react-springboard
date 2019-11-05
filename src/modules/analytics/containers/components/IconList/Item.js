/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class Item extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    item: PropTypes.object,
    last: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    isMouseOver: false,
  }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  render() {
    const { item, last } = this.props;
    const { isMouseOver } = this.state;
    const colorMix = stringToHexColor(item.name);
    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: last ? 'none' : 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(item.name)}</div>
          <span>{item.name.split(' ').map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)} `)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          {/* {
            Object.keys(item.metrics).map((metric) => (
              <div key={metric} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10, color: item.metrics[metric].color }}>
                {
                  item.metrics[metric].icon ? (
                    <i className="material-icons" style={{ fontSize: 15, marginRight: 5 }}>{item.metrics[metric].icon}</i>
                  ) : null
                }
                <span>{item.metrics.count.value}</span>
              </div>
            ))
          } */}
          <i className="material-icons" style={{ fontSize: 15, marginRight: 5 }}>{ item.metrics.count.icon ? item.metrics.count.icon : 'group' }</i> 
          <span>{item.metrics.count.value}</span>
        </div>
      </div>
    );
  }
}
