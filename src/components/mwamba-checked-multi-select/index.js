/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import ActionButton from '../action-button';

class CheckedMultiSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    selectedOptions: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const { options, selectedOptions } = props;

    this.state = {
      menuOpen: false,
      options,
      selectedOptions: selectedOptions || [],
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(event) {
    const { onChange } = this.props;
    let { selectedOptions } = this.state;
    if (event.target.checked) {
      selectedOptions.push(event.target.name);
    } else {
      selectedOptions = selectedOptions.filter((option) => option !== event.target.name);
    }
    this.setState({ selectedOptions });
    onChange(selectedOptions);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { selectedOptions, menuOpen, options } = this.state;

    return (
      <div style={{ position: 'relative', width: 150, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {
          menuOpen ? (
            <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 10, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', minWidth: 40 }}>
              {
                options.map((option) => (
                  <div key={option} style={{ margin: '2px 5px' }}>
                    <label htmlFor={option} style={{ textTransform: 'capitalize' }}>
                      <input
                        name={option}
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={this.onChange}
                        style={{ marginRight: 5 }}
                      />
                      {option}
                    </label>
                  </div>
                ))
              }
            </div>
          ) : (
            <ActionButton icon="settings" text="Options" onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb', margin: '10px 0px 3px' }} />
          )
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(CheckedMultiSelect);
