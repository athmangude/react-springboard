/* eslint-disable jsx-a11y/href-no-hash, jsx-a11y/interactive-supports-focus, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCountryFlag from 'react-country-flag';
import enhanceWithClickOutside from 'react-click-outside';
import styled from 'styled-components';

import IconButton from '../icon-button';

import styles from './index.css.js';
const MwambaCountryPickerWrapper = styled.div`${styles}`;

class MwambaCountryPicker extends Component {
  static propTypes = {
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    optionStyle: PropTypes.object,
    large: PropTypes.bool,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onToggleDropDown = this.onToggleDropDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    isOpen: false,
    hoveredItem: null,
  }

  onToggleDropDown() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onSelect(option) {
    const { onChange } = this.props;
    onChange(option);
    this.setState({ isOpen: false });
  }

  onMouseEnter(option) {
    this.setState({ hoveredItem: option.code });
  }

  onMouseLeave() {
    this.setState({ hoveredItem: null });
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  render() {
    const { options, value, style, buttonStyle, optionStyle, large } = this.props;
    const { isOpen, hoveredItem } = this.state;
    let code = options.find((option) => option.code === value);
    code = code ? code.code : '';
    return (
      <MwambaCountryPickerWrapper className="mwamba-country-picker" style={{ width: 200, position: 'relative', ...style }}>
        <div onClick={this.onToggleDropDown} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: 40, borderBottom: 'solid 2px #808285', width: '100%', ...buttonStyle }}>
          <div>
            {
              !value ? (
                <div>
                  <span>Select a country</span>
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <div style={{ margin: '3px 10px' }}>
                    <ReactCountryFlag code={code} svg />
                  </div>
                  <span>{options.find((option) => option.code === value).name}</span>
                </div>
              )
            }
          </div>
          <div>
            <IconButton icon={!isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} onClick={this.onToggleDropDown} large={large}/>
          </div>
        </div>
        {
          isOpen ? (
            <div className="options" style={{ width: '100%', height: 200, overflowY: 'scroll', display: 'flex', flexDirection: 'column', position: 'absolute', top: 40, left: 0, boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', zIndex: 1, ...optionStyle }}>
              {
                options.map((option) => (
                  <div className="option" onMouseEnter={(e) => this.onMouseEnter(option)} onMouseLeave={this.onMouseLeave} onClick={() => this.onSelect(option)} style={{ width: '100%', display: 'flex', cursor: 'pointer', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: option.code === value ? '#d9d9d9' : hoveredItem === option.code ? '#d9d9d9' : '#ffffff', padding: '10px 4px', minHeight: 40 }}>
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
      </MwambaCountryPickerWrapper>
    );
  }
}

export default enhanceWithClickOutside(MwambaCountryPicker);
