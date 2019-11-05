/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';

export default class IndustrySidePanel extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    title: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
  }

  state = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  }

  componentDidMount() {
    window.addEventListener('resize', this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onUpdateDimensions);
  }

  onUpdateDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }

  render() {
    return (
      <div style={{ height: '100vh', transition: 'width 0.1s', width: !this.props.open ? 0 : this.state.windowWidth > 425 ? 425 : '100vw', position: 'fixed', right: 0, top: 0, backgroundColor: '#fff', boxShadow: '3px 0 10px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
        <div style={{ display: 'flex', padding: '0 10px', alignItems: 'center', justifyContent: 'space-between', height: 64, backgroundColor: '#0000000d' }}>
          <span style={{ fontSize: 20 }}>{this.props.title}</span>
          <IconButton icon="close" onClick={this.props.onCloseSidePanel} />
        </div>
        <div style={{ height: '100vh - 64px', overflowY: 'auto' }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
