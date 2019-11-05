/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import IconButton from '../icon-button';
import styled from 'styled-components';

import styles from './index.css';

const MwambaDropDownSelectDescriptiveWrapper = styled.div`${styles}`;

class MwambaDropDownSelectDescriptive extends Component {
  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
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
    if ((Object.keys(option).includes('active') && !option.active)) {
      // do nothing if the option is not active
      return;
    }

    this.props.onChange(option);
    this.setState({ isOpen: false });
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <MwambaDropDownSelectDescriptiveWrapper className="mwamba-country-picker" style={{ width: '100%', minWidth: 'fit-content', position: 'relative', margin: '0 10px', ...this.props.style }}>
        <div role="button" onClick={this.onToggleDropDown} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: 40 }}>
          <div>
            {
            !this.props.value ? (
              <div>
                <span>{this.props.placeholder || 'Select a an option'}</span>
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <span style={{ textTransform: 'capitalize' }}>{this.props.options.find((option) => option.value === this.props.value).label}</span>
                <small style={{ textTransform: 'capitalize', color: 'rgba(0, 0, 0, 0.7)' }}>{this.props.options.find((option) => option.value === this.props.value).description}</small>
              </div>
            )
          }
          </div>
          <div>
            <IconButton icon={!this.state.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} onClick={this.onToggleDropDown} style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </div>
        </div>
        {
          this.state.isOpen ? (
            <div className="options" style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'static', top: 40, left: 0, boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', zIndex: 1 }}>
              {
                this.props.options.map((option) => (
                  <div className="option" role="button" onClick={() => this.onSelect(option)} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', cursor: (Object.keys(option).includes('active') && !option.active) ? 'not-allowed' : 'pointer', backgroundColor: option.value === this.props.value ? '#d9d9d9' : (Object.keys(option).includes('active') && !option.active) ? 'rgba(0, 0, 0, 0.1)' : '#fff', padding: '10px 4px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{option.label}</span>
                    <small style={{ textTransform: 'capitalize' }}>{option.description}</small>
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </MwambaDropDownSelectDescriptiveWrapper>
    );
  }
}

export default enhanceWithClickOutside(MwambaDropDownSelectDescriptive);
