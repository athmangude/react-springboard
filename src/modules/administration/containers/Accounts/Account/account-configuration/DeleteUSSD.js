/* eslint-disable no-return-assign, radix */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Label } from 'semantic-ui-react';

import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button';

import * as accountsActions from '../../flux/actions';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}), (dispatch) => ({
  accountsActions: bindActionCreators(accountsActions, dispatch),
  dispatch,
}))
export default class DeleteUSSD extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    accountId: PropTypes.object.isRequired,
    survey: PropTypes.object,
    onCloseSidePanel: PropTypes.func.isRequired,
    adminAuthentication: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { survey } = props;
    const ussd = survey.surveyMetadata.find((metadata) => metadata.name === 'ussd') || {};
    this.state = {
      ussd,
      isDeletingUSSD: false,
    }

    this.onDeleteUSSD = this.onDeleteUSSD.bind(this);
  }

  async onDeleteUSSD() {
    this.setState({ isDeletingUSSD: true });

    try {
      const { accountId, survey } = this.props;
      const { ussd } = this.state;
      await this.props.accountsActions.deleteUSSD(accountId, survey.id, ussd.id);
      this.props.alertActions.addAlert({ type: 'success', message: 'The USSD was successfully deleted' });
      this.props.fetchUSSDSurveys();
      this.props.onCloseSidePanel();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isDeletingUSSD: false });
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Delete USSD</h2>
          <IconButton icon="close" onClick={this.props.onCloseSidePanel} />
        </div>
        <div style={{ padding: 10, height: 'calc(100% - 63px)', overflowY: 'auto' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Survey USSD Details</h2>
          <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
            <small>SURVEY</small>
            <div>{this.props.survey.title}</div>
          </div>
          <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
            <small>USSD</small>
            <div>{this.state.ussd.value}</div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ActionButton onClick={this.onDeleteUSSD} className="primary" text="Delete" disabled={this.state.isDeletingUSSD || !this.props.survey.id} loading={this.state.isDeletingUSSD} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
