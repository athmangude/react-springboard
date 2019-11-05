/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IconButton from '../icon-button';
import ActionButton from '../action-button-styled';

import styles from './styles.css';

const ActionDropdownWrapper = styled.div`${styles}`;

export default class ActionDropdown extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    clearFeed: PropTypes.bool.isRequired,
    scrollLeft: PropTypes.number.isRequired,
    parent: PropTypes.node.isRequired,
    windowDimensions: PropTypes.object.isRequired,
    dialogComponent: PropTypes.node,
    closeOnSelect: PropTypes.bool,
    position: PropTypes.string,
    top: PropTypes.number,
  };

  static childContextTypes = {
    componentStyle: PropTypes.object,
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
    showDialog: false,
    dialogOption: null,
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
    this.setState({ isOpen: false, showDialog: false, dialogOption: null });
  }

  onClickOutside(event) {
    if (!this.container.current.contains(event.target)) {
      this.setState({ isOpen: false, showDialog: false, dialogOption: null });
    }
  }

  render() {
    const {
      title, options, onChange, clearFeed, closeOnSelect, parent, scrollLeft, windowDimensions, dialogComponent, position, top,
    } = this.props;

    const { isOpen, showDialog, dialogOption } = this.state;
    return (
      <ActionDropdownWrapper ref={this.actionDropDownRef} open={isOpen} container={this.container} scrollLeft={scrollLeft} parent={parent} windowDimensions={windowDimensions} top={top} position={position}>
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
              <div className="menu hide-scrollbars">
                <button type="button" className="header" onClick={isOpen ? this.onMenuClose : this.onMenuOpen} style={isOpen ? {} : { border: 'solid 1px #e8eaed', borderRadius: 19 }}>
                  <span style={{ margin: '0 0 0 10px', textTransform: 'capitalize', whitespace: 'nowrap' }}>{title}</span>
                  <IconButton icon={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} onClick={() => this.onMenuClose(true)} style={{ width: 30, height: 30, margin: '0 0 0 10px' }} />
                </button>
                {
                  !showDialog ? (
                    <div className="options">
                      {
                        options.map((option) => (
                          <div
                            className="option"
                            key={option.key}
                            tabIndex={0}
                            onKeyPress={() => {}}
                            role="button"
                            style={{ backgroundColor: option.label === title ? '#e8eaed' : '' }}
                            onClick={() => {
                              if (option.dialogTrigger) {
                                return this.setState({ showDialog: true, dialogOption: option });
                              }

                              if (closeOnSelect) {
                                this.onMenuClose();
                              }

                              return onChange(option);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                              <span style={{ textTransform: 'capitalize' }}>
                                {option.label}
                              </span>
                            </div>
                            {
                              option.icon ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                  <span>&nbsp;&nbsp;</span>
                                  <i className="material-icons" style={{ color: option.color }}>{option.icon}</i>
                                </div>
                              ) : null
                            }
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="custom-dialog-component-container" style={{ minWidth: 300, minHeight: 100, padding: 10 }}>
                      {React.cloneElement(dialogComponent, { onChange, changes: dialogOption, onMenuClose: this.onMenuClose })}
                    </div>
                  )
                }
              </div>
            ) : null
          }
        </div>
      </ActionDropdownWrapper>
    );
  }
}
