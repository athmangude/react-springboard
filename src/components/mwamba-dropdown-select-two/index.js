/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus, no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import IconButton from '../icon-button';
import styled from 'styled-components';

import styles from './index.css';

const MwambaDropDownSelectTwoWrapper = styled.div`${styles}`;

class MwambaDropDownSelectTwo extends Component {
  static propTypes = {
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    iconStyle: PropTypes.object,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    textTransform: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onToggleDropDown = this.onToggleDropDown.bind(this);
  }

  state = {
    isOpen: false,
    hoveredItem: null,
  }

  onToggleDropDown() {
    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  }

  onMouseEnter(hoveredItem) {
    this.setState({ hoveredItem });
  }

  onMouseLeave() {
    this.setState({ hoveredItem: null });
  }

  onSelect(option) {
    const { onChange } = this.props;

    if ((Object.keys(option).includes('active') && !option.active)) {
      // do nothing if the option is not active
      return;
    }
    this.setState({ isOpen: false });

    onChange(option);
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  render() {
    const { value, placeholder, options, style, textTransform: textTransformation, buttonStyle } = this.props;
    const { isOpen, hoveredItem } = this.state;
    const selected = options.find((option) => option === value);
    const label = selected || null;
    const textTransform = textTransformation || null;

    return (
      <MwambaDropDownSelectTwoWrapper style={{ flexWrap: 'wrap', display: 'flex'}}>
        <div style={{ position: 'relative', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '10px' }}>
          <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgb(217, 217, 217)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: (!isOpen) ? '20px' : '0px', borderBottomRightRadius: (!isOpen) ? '20px' : '0px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 0 }}>
              <div className="mwamba-country-picker" style={{ width: 200, position: 'relative', margin: '10px 0', ...style }}>
                <div role="button" onClick={this.onToggleDropDown} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: 20, paddingLeft: 10, ...buttonStyle }}>
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
                    <IconButton icon={!isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} onClick={this.onToggleDropDown} style={{ margin: '1px 5px 3px', height: '30px', width: '30px' }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            (isOpen) ? (
              <div className="options hide-scroll-bar" style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'absolute', top: 40, left: 0, border: '1px solid rgb(217, 217, 217)', backgroundColor: '#fff', zIndex: 1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                {
                  options.map((option, index) => (
                    <div className="option" role="button" onClick={() => this.onSelect(option)} onMouseEnter={() => this.onMouseEnter(index)} onMouseLeave={this.onMouseLeave} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', cursor: (Object.keys(option).includes('active') && !option.active) ? 'not-allowed' : 'pointer', borderBottomLeftRadius: (index === options.length - 1) ? '20px' : '0px', borderBottomRightRadius: (index === options.length - 1) ? '20px' : '0px', backgroundColor: hoveredItem === index ? 'rgba(0, 0, 0, 0.1)' : '#fff', padding: '10px 10px' }}>
                      <span style={{ textTransform }}>{option}</span>
                    </div>
                  ))
                }
              </div>
            ) : null
          }
        </div>
      </MwambaDropDownSelectTwoWrapper>
    );
  }
}

export default enhanceWithClickOutside(MwambaDropDownSelectTwo);
