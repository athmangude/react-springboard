/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import IconButton from '../icon-button';
import styled from 'styled-components';

import styles from './index.css';

const MwambaDropDownSelectWrapper = styled.div`${styles}`;

class MwambaDropDownSelect extends Component {
  static propTypes = {
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    iconStyle: PropTypes.object,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    textTransform: PropTypes.string,
    customParameters: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.onToggleDropDown = this.onToggleDropDown.bind(this);
  }

  state = {
    isOpen: false,
  }

  onToggleDropDown() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onSelect(option) {
    const { onChange, customParameters } = this.props;

    if ((Object.keys(option).includes('active') && !option.active)) {
      // do nothing if the option is not active
      return;
    }
    this.setState({ isOpen: false });
    
    if (customParameters && Object.keys(customParameters).length) {
      return onChange(option, customParameters);
    }

    onChange(option);
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  render() {
    const { value, placeholder, options, style, textTransform: textTransformation, iconStyle, buttonStyle } = this.props;
    const { isOpen } = this.state;
    const menu = style && Object.keys(style) ? style.menu : null;
    const selected = options.find((option) => option.value === value);
    const label = selected ? selected.label : null;
    const textTransform = textTransformation || null;

    return (
      <MwambaDropDownSelectWrapper className="mwamba-country-picker" style={{ width: 200, position: 'relative', margin: '10px 0', ...style }}>
        <div role="button" onClick={this.onToggleDropDown} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: 40, borderBottom: 'solid 2px #808285', ...buttonStyle }}>
          <div>
            {
              !value ? (
                <div>
                  <span>{placeholder || 'Select a an option'}</span>
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <span style={{ textTransform }}>{label}</span>
                </div>
              )
            }
          </div>
          <div>
            <IconButton icon={!isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} onClick={this.onToggleDropDown} style={{ ...iconStyle }} />
          </div>
        </div>
        {
          isOpen ? (
            <div className="options hide-scroll-bar" style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'absolute', top: 40, left: 0, boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', zIndex: 1, ...menu }}>
              {
                options.map((option) => (
                  <div className="option" role="button" onClick={() => this.onSelect(option)} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', cursor: (Object.keys(option).includes('active') && !option.active) ? 'not-allowed' : 'pointer', backgroundColor: option.value === value ? '#d9d9d9' : (Object.keys(option).includes('active') && !option.active) ? 'rgba(0, 0, 0, 0.1)' : '#fff', padding: '10px 4px' }}>
                    <span style={{ textTransform }}>{option.label}</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </MwambaDropDownSelectWrapper>
    );
  }
}

export default enhanceWithClickOutside(MwambaDropDownSelect);
