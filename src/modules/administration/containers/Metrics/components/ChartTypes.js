/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import ActionButton from 'SharedComponents/action-button';

const chartOptions = [
  { key: 'bar', text: (<span>Bar&nbsp;Chart</span>), value: 'bar' },
  { key: 'line', text: (<span>Line&nbsp;Chart</span>), value: 'line' },
];

class ChartTypes extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    menuOpen: false,
    selected: 'bar',
  };

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(selected) {
    const { onChange } = this.props;
    this.setState({ selected, menuOpen: false });
    onChange(selected);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { selected, menuOpen } = this.state;
    const currentOption = chartOptions.find((option) => option.value === selected);

    return (
      <div style={{ position: 'relative', margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        <ActionButton icon="bar_chart" text={currentOption.text} onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb' }} />
        {
          menuOpen ? (
            <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 0, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', width: 100 }}>
              {
                chartOptions.map((option) => (
                  <ActionButton key={option.key} text={option.text} onClick={() => this.onChange(option.key)} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%' }} />
                ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(ChartTypes);
