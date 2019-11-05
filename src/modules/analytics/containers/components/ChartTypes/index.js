/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import ActionButton from 'SharedComponents/action-button-styled';
import './index.css';

const availableOptions = [
  { key: 'pie', text: 'Pie', value: 'pie' },
  { key: 'line', text: 'Line', value: 'line' },
  { key: 'bar', text: 'Bar', value: 'bar' },
  { key: 'stacked', text: 'Stacked', value: 'stacked' },
  { key: 'scatter', text: 'Scatter', value: 'scatter' },
];

class ChartTypes extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    chartOptions: PropTypes.array,
    defaultChartType: PropTypes.string,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { defaultChartType, chartOptions = [] } = props;

    let selected = null;
    if (defaultChartType) {
      selected = defaultChartType;
    } else if (chartOptions.length) {
      selected = chartOptions[0];
    }

    const displayOptions = availableOptions.filter((option) => chartOptions.includes(option.key));

    this.state = {
      menuOpen: false,
      selected,
      displayOptions,
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

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
    const { width } = this.props;
    const { selected, menuOpen, displayOptions } = this.state;
    const currentOption = displayOptions.find((option) => option.value === selected);

    return (
      <div style={{ position: 'relative', margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', font: '300 14px/1.4 Roboto, sans-serif' }}>
        {
          (width > 768) || (width >= 425 && displayOptions.length <= 3) ? (
            <ul className="button-group">
              {
                displayOptions.map((option) => (
                  <li key={option.key}>
                    <button type="button" onClick={() => this.onChange(option.key)} className="button hide-active-border" style={{ backgroundColor: option.key === selected ? '#dddddd' : '#ffffff' }}>{option.text}</button>
                  </li>
                ))
              }
            </ul>
          ) : (
            <div style={{ minWidth: 100 }}>
              <ActionButton icon="keyboard_arrow_down" text={currentOption.text} onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb' }} />
              {
                menuOpen ? (
                  <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 0, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', width: 80 }}>
                    {
                      displayOptions.map((option) => (
                        <ActionButton key={option.key} text={option.text} onClick={() => this.onChange(option.key)} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%' }} />
                      ))
                    }
                  </div>
                ) : null
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(ChartTypes);
