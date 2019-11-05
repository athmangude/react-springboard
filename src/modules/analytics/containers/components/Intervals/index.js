/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import ActionButton from 'SharedComponents/action-button-styled';
import './index.css';

const intervalOptions = [
  { key: 'daily', text: 'Daily', value: 'daily' },
  { key: 'weekly', text: 'Weekly', value: 'weekly' },
  { key: 'monthly', text: 'Monthly', value: 'monthly' },
  { key: 'yearly', text: 'Yearly', value: 'yearly' },
];

class Intervals extends PureComponent {
  static propTypes = {
    onIntervalChange: PropTypes.func,
    defaultInterval: PropTypes.string,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);

    const { defaultInterval } = props;
    this.state = {
      menuOpen: false,
      selected: defaultInterval || 'daily',
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(selected) {
    const { onIntervalChange } = this.props;
    this.setState({ selected, menuOpen: false });
    onIntervalChange(selected);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { width } = this.props;
    const { selected, menuOpen } = this.state;
    const currentOption = intervalOptions.find((option) => option.value === selected);

    return (
      <div style={{ position: 'relative', margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', font: '300 14px/1.4 Roboto, sans-serif' }}>
        {
          width > 768 ? (
            <ul className="button-group">
              {
                intervalOptions.map((option) => (
                  <li key={option.key}>
                    <button type="button" onClick={() => this.onChange(option.key)} className="button hide-active-border" style={{ backgroundColor: option.key === selected ? '#dddddd' : '#ffffff' }}>{option.text}</button>
                  </li>
                ))
              }
            </ul>
          ) : (
            <div style={{ minWidth: 100 }}>
              <ActionButton icon="date_range" text={currentOption.text} onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb' }} />
              {
                menuOpen ? (
                  <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 0, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', width: 80 }}>
                    {
                      intervalOptions.map((option) => (
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

export default enhanceWithClickOutside(Intervals);
