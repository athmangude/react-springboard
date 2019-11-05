/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';

import PaginationNext from 'SharedComponents/pagination-next';
import ActionButton from 'SharedComponents/action-button-styled';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as conversationActions from '../../Conversations/flux/actions';
import * as surveyReinviteActions from './flux/actions';
import Survey from './components/Survey';
import TriggerReinvite from './components/TriggerReinvite';

@connect((state) => ({
  conversations: state.conversations,
  route: state.route,
}),
(dispatch) => ({
  conversationActions: bindActionCreators(conversationActions, dispatch),
  surveyReinviteActions: bindActionCreators(surveyReinviteActions, dispatch),
  dispatch,
}))

class Reinvites extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    conversations: PropTypes.object.isRequired,
    surveyReinviteActions: PropTypes.object.isRequired,
    conversationActions: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    route: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const params = (new URL(document.location)).searchParams;

    this.state = {
      isFetchingActiveConversations: false,
      currentPage: params.page ? parseInt(params.page, 10) : 1,
      limit: 12,
      offset: 0,
      sidePanel: null,
      showSidePanel: false,
    };

    this.onTriggerReinvite = this.onTriggerReinvite.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
    this.fetchActiveConversations = this.fetchActiveConversations.bind(this);
  }

  componentWillMount() {
    const { router } = this.context;
    const { history } = router;
    const { route } = this.props;
  }

  componentDidMount() {
    this.fetchActiveConversations();
  }

  onAddSurvey() {
    const { router } = this.context;
    const { history } = router;
    return history.push('/surveys/new');
  }

  onTriggerReinvite(conversation) {
    const { EventHandler, alertActions, surveyReinviteActions, conversationActions } = this.props;
    const { currentPage } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<TriggerReinvite onCloseSidePanel={this.onCloseSidePanel} conversation={conversation} currentPage={currentPage} surveyReinviteActions={surveyReinviteActions} conversationActions={conversationActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onPaginationNextPageChange({ offset }) {
    const { limit } = this.state;
    const nextPage = (offset / limit) + 1;

    this.setState({ currentPage: nextPage, offset: offset + limit }, () => {
      const { router } = this.context;
      const { history, route } = router;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage, 10)}`);

      this.fetchActiveConversations();
    });
  }

  async fetchActiveConversations() {
    this.setState({ isFetchingActiveConversations: true });
    const { currentPage } = this.state;
    const { conversationActions, EventHandler } = this.props;

    try {
      const fetchConversationsResult = await conversationActions.fetchConversations(currentPage, 'active');
      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: currentPage,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingActiveConversations: false });
    }
  }

  render() {
    const { conversations, surveyReinviteActions, conversationActions, EventHandler, alertActions } = this.props;
    const { isFetchingActiveConversations, currentPage, showSidePanel, sidePanel } = this.state;

    return (
      <SettingsNavigationContainer
        pagination={conversations.active.totalCount ? (
          <PaginationNext
            totalItems={conversations.active.totalCount ? conversations.active.totalCount : 0}
            perPage={12}
            onPageChange={this.onPaginationNextPageChange}
            isLoading={isFetchingActiveConversations}
            currentPage={parseInt(currentPage, 10) - 1}
            visibleItems={conversations.active.items.length}
          />
        ) : null}
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
        {
          isFetchingActiveConversations ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Loading active surveys</span>
            </div>
          ) : !conversations.active.items.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>There are no active surveys to display</h2>
              <ActionButton className="primary" large icon="add" text="Add Survey" onClick={this.onAddSurvey} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <Container fluid style={{ margin: 0, padding: 0 }}>
                <Row style={{ margin: 0, padding: 0 }}>
                  {
                    conversations.active.items.map((conversation) => (
                      <Survey key={conversation.id} conversation={conversation} onTriggerReinvite={this.onTriggerReinvite} surveyReinviteActions={surveyReinviteActions} conversationActions={conversationActions} EventHandler={EventHandler} alertActions={alertActions} />
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

export default withAuthentication(Reinvites);
