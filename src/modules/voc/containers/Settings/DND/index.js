/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';

import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button-styled';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as dndActions from './flux/actions';
import DND from './components/DND';
import DNDEdit from './components/DNDEdit';
import DNDUpload from './DNDUpload';

@connect((state) => ({
  dndlists: state.dndlists,
}),
(dispatch) => ({
  dndActions: bindActionCreators(dndActions, dispatch),
  dispatch,
}))
class DNDLists extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dndlists: PropTypes.object.isRequired,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    dndActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onAddDND = this.onAddDND.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.fetchDNDLists = this.fetchDNDLists.bind(this);

    this.state = {
      isFetchingDNDLists: false,
      sidePanel: null,
      showSidePanel: false,
      status: true,
    }
  }

  componentDidMount() {
    this.fetchDNDLists();
  }

  onAddDND() {
    const { EventHandler, alertActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<DNDUpload onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onEdit(dnd) {
    const { EventHandler, alertActions, dndActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<DNDEdit onCloseSidePanel={this.onCloseSidePanel} dnd={dnd} dndActions={dndActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onDelete(dnd) {
    const { EventHandler, alertActions, dndActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<DNDDelete onCloseSidePanel={this.onCloseSidePanel} dnd={dnd} dndActions={dndActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  async fetchDNDLists() {
    const { dndActions, alertActions, EventHandler, dispatch } = this.props;
    const { status } = this.state;
    try {
      this.setState({ isFetchingDNDLists: true });
      const fetchDNDListsResult = await dndActions.fetchDNDLists(status);
      dndActions.setDNDLists(fetchDNDListsResult.data.data.Response, fetchDNDListsResult.data.data.Response.length, 1);
      EventHandler.trackEvent({ category: 'DND', action: 'fetch DNDs', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'DND', action: 'fetch DNDs', value: false });
      ActivityHandler.handleException(exception, dispatch);
    } finally {
      this.setState({ isFetchingDNDLists: false });
      EventHandler.trackEvent({ category: 'DND', action: 'fetch DNDs' });
    }
  }

  render() {
    const { EventHandler, alertActions, dndActions, dndlists } = this.props;
    const { isFetchingDNDLists, showSidePanel, sidePanel } = this.state;

    return (
      <SettingsNavigationContainer
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
        <CircularButton className="primary cta" style={{ position: 'fixed', top: 115, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onAddDND} />
        {
          isFetchingDNDLists ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Loading DND list</span>
            </div>
          ) : !dndlists.items.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You do not have any numbers black-listed</h2>
              <ActionButton className="primary" large icon="add" text="Add DND" onClick={this.onAddDND} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <Container fluid style={{ margin: 0, padding: 0 }}>
                <Row style={{ margin: 0, padding: 0 }}>
                  {
                    dndlists.items.map((dnd) => (
                      <DND key={dnd.id} dnd={dnd} onDelete={this.onDelete} onEdit={this.onEdit} dndActions={dndActions} EventHandler={EventHandler} alertActions={alertActions} />
                    ))
                  }
                </Row>
              </Container>
            </div>
          )
        }
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(DNDLists);
