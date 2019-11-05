/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-mixed-operators, no-nested-ternary, no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import Hashids from 'hashids';
import ContainerDimensions from 'react-container-dimensions';

import CircularProgressbar from 'SharedComponents/mwamba-circular-progress-bar';
import SurveyActionButton from 'SharedComponents/action-button-styled';
import SendCampaign from './SendCampaign';
import DeleteSurveyModal from 'Modules/voc/containers/Conversations/components/delete-survey-modal';
import './CampaignListItem.css';

function formatTimeAgo(time) {
  const neatTimeAgo = moment(time).local().fromNow(true).split(' ');
  return `${neatTimeAgo[0] === 'a' || neatTimeAgo[0] === 'an' ? '1' : neatTimeAgo[0]}${neatTimeAgo[1] === 'few' ? 's' : neatTimeAgo[1] === 'month' || neatTimeAgo[1] === 'months' ? 'M' : neatTimeAgo[1][0].toLowerCase()}`;
}

class CampaignListItem extends Component {
  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    conversationActions: PropTypes.object,
    audiences: PropTypes.object.isRequired,
    windowDimensions: PropTypes.object,
    loggedInUserRole: PropTypes.object,
    account: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);    

    this.onViewReport = this.onViewReport.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDuplicateSurvey = this.onDuplicateSurvey.bind(this);
    this.generateSharedLink = this.generateSharedLink.bind(this);
    this.onShare = this.onShare.bind(this);
    this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
    this.onHidePublicLink = this.onHidePublicLink.bind(this);
    this.onActivateSurvey = this.onActivateSurvey.bind(this);
    this.onDeactivateSurvey = this.onDeactivateSurvey.bind(this);
    this.onSendSurvey = this.onSendSurvey.bind(this);
    this.onShowSendSurveyModal = this.onShowSendSurveyModal.bind(this);
    this.onHideSendSurveyModal = this.onHideSendSurveyModal.bind(this);
    this.onShowDeleteSurveyModal = this.onShowDeleteSurveyModal.bind(this);
    this.onHideDeleteSurveyModal = this.onHideDeleteSurveyModal.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.encodeSurveyId = this.encodeSurveyId.bind(this);
  }

  state = {
    isDuplicatingSurvey: false,
    isActivatingSurvey: false,
    isDeactivatingSurvey: false,
    showSendSurveyComponent: false,
    showDeleteSurveyComponent: false,
    isSendingSurvey: false,
    isDeletingSurvey: false,
    showPublicLink: false,
    sharedLink: null, // this.generateSharedLink(),
    isMouseOver: false,
  }

  async onActivateSurvey() {
    const { conversationActions, EventHandler, alertActions, conversation, listType, loggedInUserRole } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to activate a survey' });
      return;
    }
    this.setState({ isActivatingSurvey: true });

    try {
      await conversationActions.toggleConversation(conversation.id, 'ACTIVE');
      conversationActions.removeConversation(conversation.id, listType);
      alertActions.addAlert({ type: 'success', message: 'Survey activated successfully' });
      EventHandler.trackEvent({ category: 'Surveys', action: 'activate survey', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Surveys', action: 'activate survey', value: false });
    } finally {
      this.setState({ isActivatingSurvey: false });
    }
  }

  async onDeactivateSurvey() {
    const { conversationActions, EventHandler, alertActions, conversation, listType, loggedInUserRole } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to deactivate a survey' });
      return;
    }
    this.setState({ isDeactivatingSurvey: true });

    try {
      await conversationActions.toggleConversation(conversation.id, 'INACTIVE');
      conversationActions.removeConversation(conversation.id, listType);
      alertActions.addAlert({ type: 'success', message: 'Survey was deactivated successfully' });
      EventHandler.trackEvent({ category: 'Surveys', action: 'deactivate survey', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
      EventHandler.trackEvent({ category: 'Surveys', action: 'deactivate survey', value: false });
    } finally {
      this.setState({ isDeactivatingSurvey: false });
    }
  }

  onViewReport() {
    const { conversation } = this.props;
    const { router } = this.context;
    return router.history.push(`/surveys/${this.encodeSurveyId(conversation.id)}/report/${conversation.objective.toLowerCase()}`);
  }

  onEdit() {
    const { conversation, loggedInUserRole, alertActions } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to edit a survey' });
      return null;
    }
    const { router } = this.context;
    return router.history.push(`/surveys/${this.encodeSurveyId(conversation.id)}/edit`);
  }

  onHidePublicLink() {
    this.setState({ showPublicLink: false });
  }

  async onDuplicateSurvey() {
    const { conversationActions, EventHandler, alertActions, conversation, loggedInUserRole } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to duplicate a survey' });
      return;
    }
    this.setState({ isDuplicatingSurvey: true });

    try {
      await conversationActions.duplicateConversation(conversation.id);
      EventHandler.trackEvent({ category: 'Surveys', action: 'duplicate survey', value: true });
      alertActions.addAlert({ type: 'success', message: 'Survey duplicated successfully successfully' });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Surveys', action: 'duplicate survey', value: false });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isDuplicatingSurvey: false });
    }
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onSendSurvey() {
  }

  onShowSendSurveyModal() {
    this.setState({ showSendSurveyComponent: true });
  }

  onHideSendSurveyModal() {
    this.setState({ showSendSurveyComponent: false });
  }

  onShowDeleteSurveyModal() {
    const { loggedInUserRole, alertActions } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      alertActions.addAlert({ type: 'error', message: 'Your account role does not allow you to delete a survey' });
      return;
    }
    this.setState({ showDeleteSurveyComponent: true });
  }

  onHideDeleteSurveyModal() {
    this.setState({ showDeleteSurveyComponent: false });
  }

  onShare() {
    const { EventHandler } = this.props;
    this.setState({ showPublicLink: true });
    EventHandler.trackEvent({ category: 'Surveys', action: 'view survey shared link' });
  }

  onCopyToClipboard() {
    const { EventHandler } = this.props;
    this.publicLink.select();
    document.execCommand('copy');

    EventHandler.trackEvent({ category: 'Surveys', action: 'copy survey shared link to Clipboard' });
  }

  generateSharedLink() {
    const { conversation } = this.props;
    const hashId = new Hashids('msurvey', 10);
    return `${window.location.origin}/surveys/shared-link/${hashId.encode(conversation.id)}/report/${conversation.objective.toLowerCase()}`;
  }

  encodeSurveyId(surveyId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.encode(surveyId);
  }

  render() {
    const { windowDimensions, conversation, audiences, EventHandler, alertActions, account } = this.props;
    let percent;
    if (conversation.metrics.respondend === 0 || conversation.metrics.contacted === 0) {
      percent = 0;
    } else {
      percent = (conversation.metrics.responded / conversation.metrics.contacted * 100).toFixed(0);
    }

    return (
      <div style={{ width: '100%' }}>
        <ContainerDimensions>
          <div>
            <div onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter} className="wide-conversation-list-item" style={{ width: '100%', backgroundColor: '#fff', boxShadow: 'rgba(67, 70, 86, 0.1) 0px 0px 20px 3px', marginBottom: 20, padding: 0, borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
              <div style={{ width: '100%', padding: '5px 10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: 100, padding: 0 }}>
                    <CircularProgressbar label="Reponse Rate" percent={percent} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: '0px 20px', width: 'calc(100% - 100px)' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Link className="link" to={conversation.status !== 'ACTIVE' && account.active ? `/surveys/${this.encodeSurveyId(conversation.id)}/edit` : `/surveys/${this.encodeSurveyId(conversation.id)}/report/${conversation.objective.toLowerCase()}`} style={{ color: '#808285', fontSize: 18, width: 'calc(100% - 51px)' }}>{conversation.title}</Link>
                      <div style={{ margin: 0 }}>
                        {
                          conversation.objective.toUpperCase() === 'AOD' ? (
                            <span style={{ color: '#808285', fontSize: 11 }}>Audience on Demand <code>({conversation.joincode})</code></span>
                          ) : conversation.objective.toUpperCase() === 'BASIC' ? (
                            <span style={{ color: '#808285', fontSize: 11 }}>Basic Conversation <code>({conversation.joincode})</code></span>
                          ) : (
                            <span style={{ color: '#808285', fontSize: 11 }}>Customer Satisfaction <code>({conversation.joincode})</code></span>
                          )
                        }
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#808285', fontSize: 11 }}>
                        <span>Last Activity:&nbsp;</span>
                        <span>{`${moment(conversation.lastActivity).local().fromNow(true)} ago`}</span>&nbsp;
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                      {
                        conversation.objective !== 'CS' ? (
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0px 10px 0 0', position: 'relative' }}>
                              <span style={{ color: '#808285', fontSize: 15, fontWeight: 900 }}>{conversation.completes > 999 ? numeral(conversation.completes).format('0.0 a') : conversation.completes}</span>
                              <small style={{ color: '#808285', fontSize: 11 }}>Completed</small>
                            </div>
                          </div>
                        ) : null
                      }
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0px 10px', position: 'relative' }}>
                        <span style={{ color: '#808285', fontSize: 15, fontWeight: 900 }}>{conversation.maxRespondents > 999 ? numeral(conversation.maxRespondents).format('0 a') : conversation.maxRespondents}</span>
                        <small style={{ color: '#808285', fontSize: 11 }}>Target</small>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  this.state.isMouseOver ? (
                    <div className="hide-scrollbars" style={{ display: 'flex', flexDirection: 'row', width: '100%', overflow: 'scroll' }}>
                      {/* {
                        conversation.status !== 'DRAFT' ? (
                          <SurveyActionButton onClick={() => this.onViewReport(conversation, this.context.router.history.push)} icon="dashboard" text="View&nbsp;Report" />
                        ) : null
                      }
                      {
                        account.active ? (
                          <SurveyActionButton onClick={() => this.onEdit(conversation, this.context.router.history.push)} icon="edit" text="Edit" />
                        ) : null
                      }
                      {
                        conversation.status === 'ACTIVE' && account.active ? (
                          <SurveyActionButton disabled={this.state.isSendingSurvey} loading={this.state.isSendingSurvey} onClick={this.onShowSendSurveyModal} icon="send" text="Send" />
                        ) : null
                      }
                      {
                        account.active ? (
                          <SurveyActionButton onClick={this.onDuplicateSurvey} disabled={this.state.isDuplicatingSurvey} loading={this.state.isDuplicatingSurvey} icon="file_copy" text="Duplicate" />
                        ) : null
                      }
                      {
                        conversation.status !== 'DRAFT' ? (
                          <SurveyActionButton onClick={this.onShare} icon="share" text="Share" />
                        ) : null
                      }
                      {
                        conversation.status === 'ACTIVE' && account.active ? (
                          <SurveyActionButton icon="mobile_off" text="Deactivate" onClick={this.onDeactivateSurvey} disabled={this.state.isDeactivatingSurvey} loading={this.state.isDeactivatingSurvey} />
                        ) : conversation.status === 'INACTIVE' && account.active ? (
                          <SurveyActionButton icon="mobile_friendly" text="Activate" onClick={this.onActivateSurvey} disabled={this.state.isActivatingSurvey} loading={this.state.isActivatingSurvey} />
                        ) : null
                      }
                      {
                        account.active ? (
                          <SurveyActionButton disabled={this.state.isDeletingSurvey} loading={this.state.isDeletingSurvey} onClick={this.onShowDeleteSurveyModal} icon="delete" text="Delete" />
                        ) : null
                      } */}
                    </div>
                  ) : null
                }
              </div>
              {
                this.state.showPublicLink ? (
                  <div style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: '#fff', opacity: 0.95, left: 0, top: 0, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'solid 1px #e8eaed' }}>
                    <div style={{ height: 50, border: 'solid 2px #e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 0 10px #e8eaed' }}>
                      <Button onClick={this.onHidePublicLink} style={{ height: 40, width: 40, borderRadius: 20, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 5, top: 5, backgroundColor: 'transparent' }}>
                        <i className="material-icons" style={{ fontSize: 20 }}>close</i>
                      </Button>
                      <input type="text" value={this.state.sharedLink} ref={(span) => this.publicLink = span} style={{ margin: '0px 10px', color: '#58595b', fontWeight: 'bold', fontSize: 20, outline: 'none' }} />
                      <Popup
                        trigger={(
                          <Button onClick={this.onCopyToClipboard} style={{ height: '100%', width: 50, borderRadius: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="material-icons" style={{ fontSize: 20 }}>file_copy</i>
                          </Button>
                        )}
                        content="Copy to Clipboard"
                        inverted
                        position="bottom right"
                        style={{ padding: '5px 8px', opacity: 0.7 }}
                      />
                    </div>
                  </div>
                ) : null
              }
              {/* {
                this.state.showSendSurveyComponent ? (
                  <SendCampaign onHideSendSurveyModal={this.onHideSendSurveyModal} conversation={conversation} audiences={audiences} EventHandler={EventHandler} alertActions={alertActions} />
                ) : null
              }
              {
                this.state.showDeleteSurveyComponent ? (
                  <DeleteSurveyModal onHideDeleteSurveyModal={this.onHideDeleteSurveyModal} conversation={this.props.conversation} listType={this.props.listType} EventHandler={this.props.EventHandler} alertActions={this.props.alertActions} />
                ) : null
              } */}
            </div>
          </div>
        </ContainerDimensions>
        {
          <SendCampaign onHideSendSurveyModal={this.onHideSendSurveyModal} conversation={conversation} audiences={audiences} EventHandler={EventHandler} alertActions={alertActions} />       
        }
      </div>
    );
  }
}

CampaignListItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  listType: PropTypes.string,
};

CampaignListItem.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default CampaignListItem;
