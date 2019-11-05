/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable no-nested-ternary */
/* eslint-disable object-curly-newline */
/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';

import PaginationNext from 'SharedComponents/pagination-next';
import ActionButton from 'SharedComponents/action-button-styled';
import withAuthentication from 'Utils/withAuthentication';
import Delay from './components/Delay';
import ViewDelay from './components/ViewDelay';
import EditDelay from './components/EditDelay';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as conversationActions from '../../Conversations/flux/actions';
import * as surveyMetadataActions from './flux/actions';

@connect((state) => ({
  user: state.authentication.user,
  conversations: state.conversations,
  route: state.route,
}),
(dispatch) => ({
  conversationActions: bindActionCreators(conversationActions, dispatch),
  surveyMetadataActions: bindActionCreators(surveyMetadataActions, dispatch),
  dispatch,
}))
class SurveyMetadata extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    conversations: PropTypes.object.isRequired,
    surveyMetadataActions: PropTypes.object.isRequired,
    conversationActions: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    route: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { conversations } = this.props;
    this.fetchActiveConversations = this.fetchActiveConversations.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
    this.onCreateNewSurvey = this.onCreateNewSurvey.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);

    this.state = {
      isFetchingActiveConversations: false,
      currentPage: conversations.active.page ? conversations.active.page : 1,
      limit: 12,
      sidePanel: null,
      showSidePanel: false,
    };
  }

  componentWillMount() {
    const { history } = this.context.router;
    const { route } = this.props;
  }

  componentDidMount() {
    this.fetchActiveConversations();
  }

  onChangePage(change) {
    this.setState({ currentPage: change.selected + 1 }, () => {
      this.fetchActiveConversations();
      this.props.EventHandler.trackEvent({ category: 'Delays', action: 'change page', value: change.selected + 1 });
    });
  }

  onPaginationNextPageChange({ offset }) {
    const { limit } = this.state;
    const nextPage = (offset / limit) + 1;

    this.setState({ currentPage: nextPage, offset: offset + limit }, () => {
      const { history } = this.context.router;
      const { route } = this.props;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage)}`);

      this.fetchActiveConversations();
    });
  }

  onCreateNewSurvey() {
    this.context.router.history.replace('/surveys/new');
  }

  onView(delay) {
    const { EventHandler, alertActions, surveyMetadataActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<ViewDelay onCloseSidePanel={this.onCloseSidePanel} delay={delay} delayActions={surveyMetadataActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onEdit(delay) {
    const { EventHandler, alertActions, surveyMetadataActions, conversationActions } = this.props;
    const { currentPage } = this.state;
    const daysList = [0, 1, 2].map((day) => ({ key: day, text: day, value: day }));
    const hoursList = [];
    const minutesList = [];
    const secondsList = [];
    for (let i = 0; i < 60; i += 1) {
      const text = (i / 10) > 1 ? i.toString() : '0'.concat(i.toString());
      minutesList.push({ key: i, text, value: i });
      secondsList.push({ key: i, text, value: i });
    }

    for (let i = 0; i < 24; i += 1) {
      const text = (i / 10) > 1 ? i.toString() : '0'.concat(i.toString());
      hoursList.push({ key: i, text, value: i });
    }

    this.setState({ showSidePanel: true, sidePanel: (<EditDelay onCloseSidePanel={this.onCloseSidePanel} delay={delay} delayActions={surveyMetadataActions} currentPage={currentPage} conversationActions={conversationActions} EventHandler={EventHandler} alertActions={alertActions} daysList={daysList} hoursList={hoursList} minutesList={minutesList} secondsList={secondsList} fetchActiveConversations={this.fetchActiveConversations}/>) });
  }


  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  async fetchActiveConversations() {
    const { conversationActions, EventHandler } = this.props;
    this.setState({ isFetchingActiveConversations: true });
    try {
      const fetchConversationsResult = await conversationActions.fetchConversations(this.state.currentPage, 'active');

      conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page: this.state.currentPage,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingActiveConversations: false });
    }
  }

  render() {
    const { isFetchingActiveConversations, currentPage, showSidePanel, sidePanel } = this.state;
    const {
      conversations,
      surveyMetadataActions,
      EventHandler,
      alertActions,
    } = this.props;
    const hoursList = [];
    const minutesList = [];
    const secondsList = [];
    for (let i = 0; i < 60; i += 1) {
      const text = (i / 10) > 1 ? i.toString() : '0'.concat(i.toString());
      minutesList.push({ key: i, text, value: i });
      secondsList.push({ key: i, text, value: i });
    }

    for (let i = 0; i < 24; i += 1) {
      const text = (i / 10) > 1 ? i.toString() : '0'.concat(i.toString());
      hoursList.push({ key: i, text, value: i });
    }
    return (
      <SettingsNavigationContainer
        EventHandler={EventHandler}
        pagination={conversations.active.totalCount ? (
          <PaginationNext
            totalItems={conversations.active.totalCount ? conversations.active.totalCount : 0}
            perPage={12}
            onPageChange={this.onPaginationNextPageChange}
            isLoading={isFetchingActiveConversations}
            currentPage={parseInt(currentPage) - 1}
            visibleItems={conversations.active.items.length}
          />
        ) : null}
        sidePanel={showSidePanel ? sidePanel : null}
      >
        <Container fluid style={{ margin: 0, padding: 0 }}>
          <Row style={{ margin: 0, padding: 0 }}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              {
                isFetchingActiveConversations ? (
                  <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
                    <span style={{ margin: 20 }}>Loading Delays</span>
                  </div>
                ) : !conversations.active.items.length ? (
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
                    <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>No surveys</h2>
                    <ActionButton className="primary" large icon="add" text="New Survey" onClick={this.onCreateNewSurvey} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
                  </div>
                ) : (
                  <div style={{ margin: '10px 0 50px' }}>
                    <p style={{ marginBottom: 10, fontSize: 14 }}>Configure delays for surveys. Delays will take effect from the moment a survey is triggered at a touchpoint</p>
                    {
                      conversations.active.items.map((conversation) => (
                        <Delay key={conversation.id} delay={conversation} onView={this.onView} onEdit={this.onEdit} delayActions={surveyMetadataActions} EventHandler={EventHandler} alertActions={alertActions} />
                      ))
                    }
                  </div>
                )
              }
            </Col>
          </Row>
        </Container>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(SurveyMetadata);
