/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCountryFlag from 'react-country-flag';
import enhanceWithClickOutside from 'react-click-outside';

import IconButton from '../icon-button';

import './index.scss';

class MwambaCountryPicker extends Component {
  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onToggleDropDown = this.onToggleDropDown.bind(this);
  }

  state = {
    isOpen: false,
    value: null,
  }

  onToggleDropDown() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  onSelect(option) {
    this.props.onChange(option);
    this.setState({ isOpen: false });
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  render() {
    const code = this.props.options.find((option) => option.id === this.props.value).code;
    return (
      <div className="mwamba-country-picker" style={{ width: 200, position: 'relative', ...this.props.style }}>
        <div role="button" onClick={this.onToggleDropDown} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: 40, borderBottom: 'solid 2px #808285' }}>
          <div>
            {
            !this.props.value ? (
              <div>
                <span>Select a country</span>
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div style={{ margin: '3px 10px' }}>
                  <ReactCountryFlag code={code} svg />
                </div>
                <span>{this.props.options.find((option) => option.id === this.props.value).name}</span>
              </div>
            )
          }
          </div>
          <div>
            <IconButton icon={!this.state.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} onClick={this.onToggleDropDown} />
          </div>
        </div>
        {
          this.state.isOpen ? (
            <div className="options" style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'absolute', top: 40, left: 0, boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', zIndex: 1 }}>
              {
                this.props.options.map((option) => (
                  <div className="option" role="button" onClick={() => this.onSelect(option)} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: option.code === this.props.value ? '#d9d9d9' : '#fff', padding: '10px 4px' }}>
                    <div style={{ margin: '3px 10px' }}>
                      <ReactCountryFlag code={option.code} svg />
                    </div>
                    <span>{option.name}</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(MwambaCountryPicker);
