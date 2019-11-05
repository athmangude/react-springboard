/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-grid-system';
import { Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import TabMenu from 'SharedComponents/tab';
import AccountWebhookEvents from './components/AccountWebhookEvents';
import SurveyWebhookEvents from './components/SurveyWebhookEvents';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as webhookEventsActions from './flux/actions';
import * as webhookEventTypesActions from '../WebhookEventTypes/flux/actions';
import * as conversationActions from '../../Conversations/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

const tabs = [{ label: 'Account' }, { label: 'Survey' }];

@connect((state) => ({
  user: state.authentication.user,
  webhookEventTypes: state.webhookEventTypes,
  webhookEvents: state.webhookEvents,
  conversations: state.conversations,
}),
(dispatch) => ({
  webhookEventsActions: bindActionCreators(webhookEventsActions, dispatch),
  webhookEventTypesActions: bindActionCreators(webhookEventTypesActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))

class WebhookEvents extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    EventHandler: PropTypes.func,
    webhookEventTypes: PropTypes.array,
    webhookEvents: PropTypes.object,
    conversations: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onCreateClicked = this.onCreateClicked.bind(this);
    this.onCancelClicked = this.onCancelClicked.bind(this);
    this.onAddWebhookClicked = this.onAddWebhookClicked.bind(this);
    this.onRemoveWebhookClicked = this.onRemoveWebhookClicked.bind(this);
    this.onChangeWebhook = this.onChangeWebhook.bind(this);
    this.onEditWebhook = this.onEditWebhook.bind(this);
    this.onChangeSurvey = this.onChangeSurvey.bind(this);
    this.isUrlValid = this.isUrlValid.bind(this);
    this.fetchWebhookEventTypes = this.fetchWebhookEventTypes.bind(this);
    this.fetchWebhookEvents = this.fetchWebhookEvents.bind(this);
    this.fetchConversations = this.fetchConversations.bind(this);
    this.saveWebhookEventSettings = this.saveWebhookEventSettings.bind(this);
    this.updateWebhookEvent = this.updateWebhookEvent.bind(this);
    this.deleteWebhookEvent = this.deleteWebhookEvent.bind(this);
  }

  state = {
    isFetchingWebhookEventTypes: false,
    isFetchingWebhookEvents: false,
    isSavingWebhookEvent: false,
    isUpdatingWebhookEvent: false,
    isDeletingWebhookEvent: false,
    selectedTab: 'Account',
    surveyId: null,
    createWebhookEvents: {},
    updateWebhooks: {},
    webhookEventTypeIdBeingSaved: null,
    webhookIdBeingUpdated: null,
    webhookIdBeingDeleted: null,
  };

  componentDidMount() {
    this.fetchWebhookEventTypes();
    this.fetchWebhookEvents();
    this.fetchConversations();
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab, surveyId: null });
  }

  onCreateClicked(webhookEventTypeId) {
    const { createWebhookEvents } = this.state;
    createWebhookEvents[webhookEventTypeId] = [{ id: 1, value: '', valid: true }];
    this.setState({ createWebhookEvents });
    this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'click create web hook', value: webhookEventTypeId });
  }

  onCancelClicked(webhookEventTypeId) {
    const { createWebhookEvents } = this.state;
    delete createWebhookEvents[webhookEventTypeId];
    this.setState({ createWebhookEvents });
    this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'click cancel web hook', value: webhookEventTypeId });
  }

  onAddWebhookClicked(webhookEventTypeId) {
    const { createWebhookEvents } = this.state;
    createWebhookEvents[webhookEventTypeId].push({ id: createWebhookEvents[webhookEventTypeId].length + 1, value: '', valid: true });
    this.setState({ createWebhookEvents });
    this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'click add web hook', value: webhookEventTypeId });
  }

  onRemoveWebhookClicked(webhookEventTypeId, id) {
    const { createWebhookEvents } = this.state;
    const events = createWebhookEvents[webhookEventTypeId].filter((event) => event.id !== parseInt(id, 10));
    createWebhookEvents[webhookEventTypeId] = events;
    this.setState({ createWebhookEvents });
    this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'click remove web hook', value: webhookEventTypeId });
  }

  onChangeWebhook(e, { id, value }) {
    const idArray = id.split('-');
    const webhookEventTypeId = idArray[0];
    const index = idArray[1];
    const { createWebhookEvents } = this.state;
    const idx = createWebhookEvents[webhookEventTypeId].findIndex((event) => event.id === parseInt(index, 10));
    createWebhookEvents[webhookEventTypeId][idx] = { ...createWebhookEvents[webhookEventTypeId][idx], value, valid: this.isUrlValid(value) };

    this.setState({ createWebhookEvents });
  }

  onEditWebhook(e, { id, value }) {
    const { updateWebhooks } = this.state;
    updateWebhooks[id] = { value, valid: this.isUrlValid(value) };
    this.setState({ updateWebhooks });
  }

  onChangeSurvey(e, { name, value }) {
    this.setState({ [name]: value });
  }

  isUrlValid(url) {
    const regExp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regExp.test(url);
  }

  async fetchWebhookEventTypes() {
    this.setState({ isFetchingWebhookEventTypes: true });
    try {
      const fetchWebhookEventTypesResult = await this.props.webhookEventTypesActions.fetchWebhookEventTypes();
      this.props.webhookEventTypesActions.setWebhookEventTypes(fetchWebhookEventTypesResult.data.data.Data);
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'fetch web hook event types', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'fetch web hook event types', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingWebhookEventTypes: false });
    }
  }

  async fetchWebhookEvents() {
    this.setState({ isFetchingWebhookEvents: true });
    try {
      const fetchWebhookEventsResult = await this.props.webhookEventsActions.fetchWebhookEvents();
      this.props.webhookEventsActions.setWebhookEvents(fetchWebhookEventsResult.data.data.Data);
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'fetch web hook events', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'fetch web hook events', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingWebhookEvents: false });
    }
  }

  async fetchConversations(page) {
    this.setState({
      isLoading: true,
    });

    try {
      const fetchConversationsResult = await this.props.conversationActions.fetchConversations(page, 'active');
      this.props.conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  async saveWebhookEventSettings(webhookEventTypeId) {
    this.setState({
      isSavingWebhookEvent: true,
      webhookEventTypeIdBeingSaved: webhookEventTypeId,
    });

    const { createWebhookEvents, surveyId } = this.state;
    const eventDetails = [];
    createWebhookEvents[webhookEventTypeId].forEach((event) => {
      if (event.value.trim()) {
        eventDetails.push(event.value.trim());
      }
    });

    if (!eventDetails.length) {
      return;
    }

    const body = {
      eventDetails,
      status: 'ACTIVE',
      surveyHookConfigId: webhookEventTypeId,
    };

    try {
      await this.props.webhookEventsActions.saveWebhookEvents(body, surveyId);
      this.fetchWebhookEvents();
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully created web hook event' });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'save web hook event settings', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'save web hook event settings', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isSavingWebhookEvent: false,
        webhookEventTypeIdBeingSaved: null,
        createWebhookEvents: {},
      });
    }
  }

  async updateWebhookEvent(event) {
    const { updateWebhooks, surveyId } = this.state;
    const webhookToUpdate = surveyId ? updateWebhooks[event.surveyHookId] : updateWebhooks[event.accountHookId];
    if (!webhookToUpdate) {
      return;
    }

    this.setState({
      isUpdatingWebhookEvent: true,
      webhookIdBeingUpdated: surveyId ? event.surveyHookId : event.accountHookId,
    });

    const body = {
      eventDetails: webhookToUpdate.value,
      surveyHookConfigId: event.surveyHookConfigId,
    };
    if (surveyId) {
      body.surveyHookId = event.surveyHookId;
    } else {
      body.accountHookId = event.accountHookId;
    }

    try {
      await this.props.webhookEventsActions.updateWebhook(body, surveyId);
      this.fetchWebhookEvents();
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully updated web hook' });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'update web hook event settings', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'update web hook event settings', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isUpdatingWebhookEvent: false,
        webhookIdBeingUpdated: null,
      });
    }
  }

  async deleteWebhookEvent(event) {
    const { surveyId } = this.state;

    this.setState({
      isDeletingWebhookEvent: true,
      webhookIdBeingDeleted: surveyId ? event.surveyHookId : event.accountHookId,
    });

    const body = {
      surveyHookConfigId: event.surveyHookConfigId,
    };

    if (surveyId) {
      body.surveyHookId = event.surveyHookId;
    } else {
      body.accountHookId = event.accountHookId;
    }

    try {
      await this.props.webhookEventsActions.deleteWebhook(body, surveyId);
      this.fetchWebhookEvents();
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully deleted web hook' });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'delete a web hook', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'WebhookEvents', action: 'delete a web hook', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isDeletingWebhookEvent: false,
        webhookIdBeingDeleted: null,
      });
    }
  }

  render() {
    const { isFetchingWebhookEvents, isSavingWebhookEvent, createWebhookEvents, surveyId, webhookEventTypeIdBeingSaved, isUpdatingWebhookEvent, webhookIdBeingUpdated, isDeletingWebhookEvent, webhookIdBeingDeleted } = this.state;
    const { webhookEventTypes, webhookEvents, conversations } = this.props;
    const formattedWebhookEventTypes = [];

    webhookEventTypes
      .filter((webhookEventType) => webhookEventType.mode === 'API' && webhookEventType.status === 'ACTIVE')
      .forEach((webhookEventType) => {
        const title = webhookEventType.event.toLowerCase().replace(/_/g, ' ');
        const { status, level } = webhookEventType;
        formattedWebhookEventTypes.push({
          id: webhookEventType.id,
          name: webhookEventType.event,
          title,
          description: `When you listen to this web-hook event, once triggered, the ${title} payload will be automatically pushed to your provided end-point(s).`,
          status,
          level,
        });
      });

    return (
      <SettingsNavigationContainer EventHandler={this.props.EventHandler}>
        <Container fluid style={{ margin: 0, padding: 0 }}>
          <Row style={{ margin: 0, padding: 0 }}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '100%', paddingBottom: 8, marginBottom: 16, borderBottom: '1px #e1e4e8 solid' }}>
                <h2 style={{ fontSize: 24, fontWeight: 'normal' }}>Web-hook Events</h2>
              </div>
            </Col>
          </Row>
          <Row style={{ minHeight: 500, padding: 0, margin: 0 }}>
            {isFetchingWebhookEvents ? (
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <p style={{ marginBottom: 10, fontSize: 14 }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></p>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ margin: '0 0 20px' }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 15 }} /></div>} /></div>
                  <div><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 15 }} /></div>} /></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #d1d5da', borderRadius: 3, marginTop: 16 }}>
                  <div style={{ width: '100%' }}>
                    {[1, 2, 3].map((item) => (
                      <div style={{ width: '100%', margin: 0, padding: 16, marginTop: -1, listStyleType: 'none', borderTop: '1px solid #e1e4e8' }} key={item}>
                        <h4 style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 180, height: 25 }} /></div>} />
                        </h4>
                        <p style={{ minHeight: 17, margin: '4px 0 2px', fontSize: 14, color: '#586069' }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></p>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          {[1, 2].map((innerItem) => (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 5 }} key={innerItem}>
                              <div style={{ width: '100%', paddingRight: 10 }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></div>
                              <div style={{ width: 200, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <div style={{ width: 50, paddingRight: 10 }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></div>
                                <div style={{ width: 50 }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            ) :
              !formattedWebhookEventTypes.length ? (
                <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#fafbfc', border: '1px solid #e1e4e8', borderRadius: 3, boxShadow: 'inset 0 0 10px rgba(27,31,35,0.05)' }}>
                  <span style={{ color: '#6d6e71', fontSize: 16, fontWeight: 'normal' }}>No web hook event types have been specified. Please contact the customer success team.</span>
                </div>
              ) :
              (
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <p style={{ marginBottom: 10, fontSize: 14 }}>Choose what web-hook events you would like to listen for. These web-hook event settings apply to your web-hook events.</p>
                  <TabMenu tabs={tabs} selectedTab={this.state.selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: 'inherit' }} />
                  {this.state.selectedTab === 'Account' ? null : (
                    <div style={{ width: '100%', margin: '10px 0' }}>
                      <b>Select Survey</b>
                      <Form.Field
                        control={Dropdown}
                        name="surveyId"
                        value={surveyId}
                        onChange={this.onChangeSurvey}
                        placeholder="Select Survey"
                        selection
                        options={conversations.active.items.map((c) => ({
                          key: c.id,
                          value: c.id,
                          text: c.title,
                        }))}
                        width={8}
                        style={{ width: '100%', borderRadius: 0 }}
                        className="custom-field"
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #d1d5da', borderRadius: 3, marginTop: 16 }}>
                    <AccountWebhookEvents tab={this.state.selectedTab} surveyId={surveyId} formattedWebhookEventTypes={formattedWebhookEventTypes} webhookEvents={webhookEvents} onAddWebhookClicked={this.onAddWebhookClicked} onCancelClicked={this.onCancelClicked} onCreateClicked={this.onCreateClicked} onRemoveWebhookClicked={this.onRemoveWebhookClicked} createWebhookEvents={createWebhookEvents} isUpdatingWebhookEvent={isUpdatingWebhookEvent} webhookIdBeingUpdated={webhookIdBeingUpdated} onChangeWebhook={this.onChangeWebhook} onEditWebhook={this.onEditWebhook} updateWebhookEvent={this.updateWebhookEvent} saveWebhookEventSettings={this.saveWebhookEventSettings} deleteWebhookEvent={this.deleteWebhookEvent} isDeletingWebhookEvent={isDeletingWebhookEvent} isSavingWebhookEvent={isSavingWebhookEvent} webhookIdBeingDeleted={webhookIdBeingDeleted} webhookEventTypeIdBeingSaved={webhookEventTypeIdBeingSaved} />
                    <SurveyWebhookEvents tab={this.state.selectedTab} surveyId={surveyId} formattedWebhookEventTypes={formattedWebhookEventTypes} webhookEvents={webhookEvents} onAddWebhookClicked={this.onAddWebhookClicked} onCancelClicked={this.onCancelClicked} onCreateClicked={this.onCreateClicked} onRemoveWebhookClicked={this.onRemoveWebhookClicked} createWebhookEvents={createWebhookEvents} isUpdatingWebhookEvent={isUpdatingWebhookEvent} webhookIdBeingUpdated={webhookIdBeingUpdated} onChangeWebhook={this.onChangeWebhook} onEditWebhook={this.onEditWebhook} updateWebhookEvent={this.updateWebhookEvent} saveWebhookEventSettings={this.saveWebhookEventSettings} deleteWebhookEvent={this.deleteWebhookEvent} isDeletingWebhookEvent={isDeletingWebhookEvent} isSavingWebhookEvent={isSavingWebhookEvent} webhookIdBeingDeleted={webhookIdBeingDeleted} webhookEventTypeIdBeingSaved={webhookEventTypeIdBeingSaved} />
                  </div>
                </Col>
            )}
          </Row>
        </Container>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(WebhookEvents);
