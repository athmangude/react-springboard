
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'react-switch';

import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button-styled';

import themes from 'SharedComponents/themes';

const { primaryColor, lightPrimaryColor } = themes.light;

import actionDropDownStyles from './actionDropDownStyles';

const ActionDropdownWrapper = styled.div`${actionDropDownStyles}`;

export default class ActionDropdown extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    clearFeed: PropTypes.bool.isRequired,
    scrollLeft: PropTypes.number.isRequired,
    parent: PropTypes.node.isRequired,
    windowDimensions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.onMenuOpen = this.onMenuOpen.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);

    this.container = React.createRef();
    this.actionDropDownRef = React.createRef();
  }

  state = {
    isOpen: false,
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.onClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClickOutside, false);
  }

  onMenuOpen() {
    this.setState({ isOpen: true });
  }

  onMenuClose() {
    this.setState({ isOpen: false });
  }

  onClickOutside(event) {
    if (!this.container.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const {
      title, options, onChange, clearFeed, parent, scrollLeft, windowDimensions,
    } = this.props;

    const { isOpen } = this.state;
    return (
      <ActionDropdownWrapper ref={this.actionDropDownRef} open={isOpen} container={this.container} scrollLeft={scrollLeft} parent={parent} windowDimensions={windowDimensions}>
        <div className="container" ref={this.container} onScroll={this.onScroll}>
          <ActionButton
            className="menu-trigger"
            text={(
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ textTransform: 'capitalize' }}>{title}</span>
                <i className="material-icons" style={{ fontSize: 15, margin: '0 0 0 10px' }}>keyboard_arrow_down</i>
              </div>
            )}
            onClick={isOpen ? this.onMenuClose : this.onMenuOpen}
            style={isOpen ? {} : { border: 'solid 1px #e8eaed', borderRadius: 19 }}
          >
          </ActionButton>
          {
            isOpen ? (
              <div className="menu">
                <div className="header" onClick={isOpen ? this.onMenuClose : this.onMenuOpen} style={isOpen ? {} : { border: 'solid 1px #e8eaed', borderRadius: 19 }}>
                  <span style={{ margin: '0 0 0 10px', textTransform: 'capitalize' }}>{title}</span>
                  <IconButton icon={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} onClick={() => this.onMenuClose(true)} style={{ width: 30, height: 30, margin: '0 0 0 10px' }} />
                </div>
                <div className="options">
                  {
                    options.map((option) => (
                      // <div
                      //   className="option"
                      //   key={option.key}
                      //   tabIndex={0}
                      //   onKeyPress={() => {}}
                      //   role="button"
                      //   onClick={() => {
                          // if (option.nullIsTrue) {
                          //   onChange({ [option.property]: !option.value ? null : false }, clearFeed);
                          // } else {
                          //   onChange({ [option.property]: !option.value }, clearFeed);
                          // }
                      //   }}
                      // >
                        <div className="option" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                          <Switch
                            checked={option.value}
                            onChange={(change) => {
                                if (option.nullIsTrue) {
                                  onChange({ [option.property]: !option.value ? null : false }, clearFeed)
                                } else {
                                  onChange({ [option.property]: change }, clearFeed)
                                }
                              }
                            }
                            onColor={lightPrimaryColor}
                            onHandleColor={primaryColor}
                            handleDiameter={15}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={10}
                            width={24}
                            className="react-switch"
                            id="material-switch"
                          />
                          <span>&nbsp;&nbsp;</span>
                          <span style={{ textTransform: 'capitalize' }}>
                            {option.label}
                          </span>
                          {
                            option.icon ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <span>&nbsp;&nbsp;</span>
                                <i className="material-icons" style={{ color: option.color }}>{option.icon}</i>
                              </div>
                            ) : null
                          }
                        </div>
                        // {
                        //   option.icon ? (
                        //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        //       <span>&nbsp;&nbsp;</span>
                        //       <i className="material-icons" style={{ color: option.color }}>{option.icon}</i>
                        //     </div>
                        //   ) : null
                        // }
                      // </div>
                    ))
                  }
                </div>
              </div>
            ) : null
          }
        </div>
      </ActionDropdownWrapper>
    );
  }
}
