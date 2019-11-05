/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';

import CircularButton from 'SharedComponents/circular-button';
import PaginationNext from 'SharedComponents/pagination-next';
import SearchBar from 'SharedComponents/search-bar';
import ActionButton from 'SharedComponents/action-button-styled';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as touchpointActions from './flux/actions';
import * as conversationActions from '../../Conversations/flux/actions';
import TouchPoint from './components/TouchPoint';
import ViewTouchPoint from './components/ViewTouchPoint';
import EditTouchPoint from './components/EditTouchPoint';
import TouchPointsUpload from './TouchPointsUpload';

@connect((state) => ({
  touchpoints: state.touchpoints,
  conversations: state.conversations,
  route: state.route,
}),
(dispatch) => ({
  touchpointActions: bindActionCreators(touchpointActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  dispatch,
}))
class TouchPoints extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    touchpoints: PropTypes.object.isRequired,
    conversations: PropTypes.object,
    EventHandler: PropTypes.func,
    route: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const params = (new URL(document.location)).searchParams;

    this.state = {
      isFetchingTouchPoints: false,
      surveyId: null,
      currentPage: params.page ? parseInt(params.page, 10) : 1,
      limit: 20,
      offset: 0,
      touchpointStatus: 'ACTIVE',
      sidePanel: null,
      showSidePanel: false,
    };

    this.onAddTouchPoint = this.onAddTouchPoint.bind(this);
    this.onView = this.onView.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onChangeSurvey = this.onChangeSurvey.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
    this.fetchTouchPoints = this.fetchTouchPoints.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onAddTouchPoint() {
    const { EventHandler, alertActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<TouchPointsUpload onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onView(touchpoint) {
    const { EventHandler, alertActions, touchpointActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<ViewTouchPoint onCloseSidePanel={this.onCloseSidePanel} touchpoint={touchpoint} touchpointActions={touchpointActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onEdit(touchpoint) {
    const { EventHandler, alertActions, touchpointActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<EditTouchPoint onCloseSidePanel={this.onCloseSidePanel} touchpoint={touchpoint} touchpointActions={touchpointActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onChangeSurvey(value) {
    const name = "surveyId";
    this.setState({ [name]: value.id, offset: 0, currentPage: 1 }, () => {
      this.fetchTouchPoints();
    });
  }

  onPaginationNextPageChange({ offset }) {
    const { limit } = this.state;
    const nextPage = (offset / limit) + 1;

    this.setState({ currentPage: nextPage, offset: offset + limit }, () => {
      const { history } = this.context.router;
      const { route } = this.props;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage)}`);

      this.fetchTouchPoints();
    });
  }

  onCancel() {
    this.setState({ surveyId: null, offset: 0 });
  }

  async fetchTouchPoints() {
    const { surveyId, limit, offset, touchpointStatus } = this.state;
    this.setState({ isFetchingTouchPoints: true });
    try {
      const fetchTouchPointsResult = await this.props.touchpointActions.fetchTouchPoints(surveyId, limit, offset, touchpointStatus);
      this.props.touchpointActions.setTouchPoints(fetchTouchPointsResult.data.data.Data.items, fetchTouchPointsResult.data.data.Data.totalCount, 1);
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'fetch touchpoints', value: true });
    } catch (exception) {
      ActivityHandler.handleException(exception, this.props.dispatch);
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'fetch touchpoints', value: false });
    } finally {
      this.setState({ isFetchingTouchPoints: false});
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'fetch touchpoints' });
    }
  }

  render() {
    const { touchpoints, touchpointActions, EventHandler, alertActions, conversationActions } = this.props;
    const { surveyId, isFetchingTouchPoints } = this.state;

    return (
      <SettingsNavigationContainer
        searchBar={(
          <SearchBar placeholder="search surveys" searchAction={this.props.conversationActions.searchSurveys} dataProp="objects" itemDisplayProp="title" itemOnClickAction={this.onChangeSurvey} />
        )}
        pagination={surveyId && touchpoints.totalCount ? (
          <PaginationNext
            totalItems={touchpoints.totalCount ? touchpoints.totalCount : 0}
            perPage={12}
            onPageChange={this.onPaginationNextPageChange}
            isLoading={this.state.isFetchingTouchPoints}
            currentPage={parseInt(this.state.currentPage) - 1}
            visibleItems={touchpoints.items.length}
          />
        ) : null}
        sidePanel={this.state.showSidePanel ? this.state.sidePanel : null}
        EventHandler={this.props.EventHandler}
      >
        <CircularButton className="primary cta" style={{ position: 'fixed', top: 100, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onAddTouchPoint} />
        {
          isFetchingTouchPoints ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Loading Touchpoints</span>
            </div>
          ) : !surveyId ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>Select a survey to view the touchpoints</h2>
              <div style={{ marginBottom: 15 }}>OR</div>
              <ActionButton className="primary" large icon="add" text="Add Touchpoint" onClick={this.onAddTouchPoint} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : surveyId && !touchpoints.items.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>There are no business numbers added to this survey</h2>
              <ActionButton className="primary" large icon="add" text="Add Touchpoint" onClick={this.onAddTouchPoint} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <Container fluid style={{ margin: 0, padding: 0 }}>
                <Row style={{ margin: 0, padding: 0 }}>
                  {
                    touchpoints.items.filter((touchpoint) => touchpoint.status !== 'DELETED').map((touchpoint) => (
                      <TouchPoint key={touchpoint.id} touchpoint={touchpoint} onView={this.onView} onEdit={this.onEdit} touchpointActions={touchpointActions} EventHandler={EventHandler} alertActions={alertActions} />
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

export default withAuthentication(TouchPoints);
