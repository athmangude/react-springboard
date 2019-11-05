/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NewUSSD from './NewUSSD';
import EditUSSD from './EditUSSD';
import DeleteUSSD from './DeleteUSSD';

export default class SidePanel extends Component {
  static propTypes = {
    accountId: PropTypes.number,
    survey: PropTypes.object,
    showSidePanel: PropTypes.bool.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    fetchUSSDSurveys: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
  }

  state = {
    windowWidth: window.innerWidth,
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
    });
  }

  render() {
    const params = (new URL(document.location)).searchParams;
    const { showSidePanel, onCloseSidePanel, EventHandler, alertActions, fetchUSSDSurveys, accountId, survey } = this.props;
    const { windowWidth } = this.state;
    return (
      <div style={{ height: '100vh', transition: 'width 0.1s', width: !showSidePanel ? 0 : windowWidth > 425 ? 425 : '100vw', overflowY: 'auto', position: 'fixed', right: 0, top: 60, backgroundColor: '#fff', boxShadow: '3px 0 10px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
        {
          params.get('panelView') === 'configureUSSD' && !survey ? (
            <NewUSSD onCloseSidePanel={onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} fetchUSSDSurveys={fetchUSSDSurveys} accountId={accountId} />
          ) : params.get('panelView') === 'configureUSSD' && survey ? (
            <EditUSSD onCloseSidePanel={onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} fetchUSSDSurveys={fetchUSSDSurveys} accountId={accountId} survey={survey} />
          ) : params.get('panelView') === 'deleteUSSD' && survey ? (
            <DeleteUSSD onCloseSidePanel={onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} fetchUSSDSurveys={fetchUSSDSurveys} accountId={accountId} survey={survey} />
          ) : null
        }
      </div>
    );
  }
}
