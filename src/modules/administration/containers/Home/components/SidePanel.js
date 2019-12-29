/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NewAccount from './NewAccount';

export default class SidePanel extends Component {
  static propTypes = {
    showSidePanel: PropTypes.bool.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    fetchAccounts: PropTypes.func.isRequired,
  };

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
    const params = (new URL(document.location)).searchParams;
    return (
      <div style={{ height: '100vh', transition: 'width 0.1s', width: !this.props.showSidePanel ? 0 : this.state.windowWidth > 425 ? 425 : '100vw', overflowY: 'auto', position: 'fixed', right: 0, top: 0, backgroundColor: '#fff', boxShadow: '3px 0 10px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
        {
          params.get('panelView') === 'createAccount' ? (
            <NewAccount onCloseSidePanel={this.props.onCloseSidePanel} EventHandler={this.props.EventHandler} alertActions={this.props.alertActions} fetchAccounts={this.props.fetchAccounts} />
          ) : null
        }
      </div>
    );
  }
}
