/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import ActionButton from 'SharedComponents/action-button';

const intervalOptions = [
  { key: 'daily', text: 'Daily', value: 'daily' },
  { key: 'weekly', text: 'Weekly', value: 'weekly' },
  { key: 'monthly', text: 'Monthly', value: 'monthly' },
  { key: 'yearly', text: 'Yearly', value: 'yearly' },
];

class Intervals extends Component {
  static propTypes = {
    onIntervalChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onToggleIntervalMenu = this.onToggleIntervalMenu.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
  }

  state = {
    menuOpen: false,
    interval: 'monthly',
  };

  onToggleIntervalMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onIntervalChange(interval) {
    const { onIntervalChange } = this.props;
    this.setState({ interval, menuOpen: false });
    onIntervalChange(interval);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { interval, menuOpen } = this.state;
    const currentOption = intervalOptions.find((option) => option.value === interval);

    return (
      <div style={{ position: 'relative', margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        <ActionButton icon="date_range" text={currentOption.text} onClick={this.onToggleIntervalMenu} style={{ border: 'solid 1px #e2e4eb' }} />
        {
          menuOpen ? (
            <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 0, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', width: 80 }}>
              {
                intervalOptions.map((option) => (
                  <ActionButton key={option.key} text={option.text} onClick={() => this.onIntervalChange(option.key)} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%' }} />
                ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(Intervals);
