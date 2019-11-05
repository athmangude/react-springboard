/* eslint-disable jsx-a11y/href-no-hash, no-underscore-dangle, no-shadow, object-curly-newline, no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-grid-system';
import moment from 'moment';
import Hashids from 'hashids';

import SurveySummary from '../components/SurveySummary';
import SurveyMetadata from '../components/survey-metadata';
import TabResults from '../components/TabResults';
import Filters from '../../CustomerSegmentation/Customers/Actions/Filters';
import TabMenu from ''Modules/administration/containers/Accounts/Account/TabMenu';
import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button-styled';
import DateRangePicker from 'SharedComponents/mwamba-date-range-picker';
import withAuthentication from 'Utils/withAuthentication';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import './style.css';

import * as aodReportActions from './flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import * as collaboratorsActions from 'Modules/voc/containers/Settings/Collaborators/flux/actions';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';

@connect(
  (state) => ({
    authentication: state.authentication,
    aodReport: state.aodReport,
    collaborators: state.collaborators,
  }),
  (dispatch) => ({
    aodReportActions: bindActionCreators(aodReportActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
    customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
    dispatch,
  })
)
class AODReport extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    aodReport: PropTypes.object.isRequired,
    authentication: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    appActions: PropTypes.object,
    collaboratorsActions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    aodReportActions: PropTypes.object,
    windowDimensions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onViewChange = this.onViewChange.bind(this);
    this.onFilterByBarChartOption = this.onFilterByBarChartOption.bind(this);
  }

  state = {
    isFetchingStats: false,
    isFetchingSurveyQuestions: false,
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    sidePanel: null,
    showSidePanel: false,
    appliedFilters: [],
    isFiltered: null,
    isFetchingStatsAgain: false,
    isFetchingSurveyQuestionsAgain: false,
    clickFilters: [],
    selectedTab: 'Summary',
    tabs: [{ label: 'Summary' }],
  };

  componentDidMount() {
    this.fetchAODStats();
    this.fetchSurveyQuestions();
    this.fetchCollaborators();

    // this.interval = setInterval(() => {
    //   const isInitial = false;
    //   this.fetchAODStats(isInitial);
    //   this.fetchSurveyQuestions(isInitial);
    // }, 10000);
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
    // clearInterval(this.interval);
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onFilter() {
    const { customerAnalyticsActions, alertActions, windowDimensions, EventHandler } = this.props;
    const { width } = windowDimensions;
    const { appliedFilters } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<Filters appliedFilters={JSON.stringify(appliedFilters)} onCloseSidePanel={this.onCloseSidePanel} width={width} applyFilters={this.onApplyFilters} customerAnalyticsActions={customerAnalyticsActions} alertActions={alertActions} EventHandler={EventHandler} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onApplyFilters(appliedFilters) {
    this.setState({ appliedFilters, isFiltered: true }, () => this.onCloseSidePanel());
  }

  onDateRangeChange({ from, to }) {
    this.setState({ startDate: moment(from).startOf('day').format('YYYY-MM-DD HH:mm:ss'), endDate: moment(to).endOf('day').format('YYYY-MM-DD HH:mm:ss') });
  }

  onViewChange(view) {
    this.setState({ view });
  }

  onFilterByBarChartOption(questionId, text) {
    let { clickFilters } = this.state;
    if (!text) {
      clickFilters = clickFilters.filter((bar) => bar.questionId !== questionId);
    } else {
      const option = clickFilters.find((bar) => bar.questionId === questionId);
      if (option) {
        clickFilters = clickFilters.filter((bar) => bar.questionId !== questionId);
        clickFilters.push({ questionId, response: text });
      } else {
        clickFilters.push({ questionId, response: text });
      }
    }
    this.setState({ clickFilters }, async () => { await this.refreshSurveyResults(); });
  }

  async fetchAODStats(initial = true) {
    if (initial) {
      this.setState({ isFetchingStats: true });
    } else {
      this.setState({ isFetchingStatsAgain: true });
    }

    const { EventHandler, aodReportActions, appActions } = this.props;
    const { router } = this.context;
    const { startDate, endDate, clickFilters } = this.state;

    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;

    try {
      const fetchAODDataV2Result = await aodReportActions.fetchAODDataV2(surveyId, { startDate, endDate }, clickFilters);
      aodReportActions.setAODData(surveyId, fetchAODDataV2Result.data.Data);
      this.setState({ surveyTitle: fetchAODDataV2Result.data.Data.surveyTitle, surveyType: fetchAODDataV2Result.data.Data.surveyType });
      appActions.setRouteTitle(fetchAODDataV2Result.data.Data.surveyTitle);
      EventHandler.trackEvent({ category: 'AOD', action: 'fetch AOD stats', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'AOD', action: 'fetch AOD stats', value: false });
      EventHandler.handleException(exception);
    } finally {
      if (initial) {
        this.setState({ isFetchingStats: false });
      } else {
        this.setState({ isFetchingStatsAgain: false });
      }
    }
  }

  async fetchSurveyQuestions(initial = true) {
    if (initial) {
      this.setState({ isFetchingSurveyQuestions: true });
    } else {
      this.setState({ isFetchingSurveyQuestionsAgain: true });
    }

    const { EventHandler, aodReportActions } = this.props;
    const { router } = this.context;

    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { startDate, endDate, clickFilters, tabs } = this.state;

    try {
      const fetchSurveyQuestionsResult = await aodReportActions.fetchSurveyQuestions(surveyId, { startDate, endDate }, clickFilters);
      aodReportActions.setSurveyQuestions(surveyId, fetchSurveyQuestionsResult.data.Data);
      const tabLabels = tabs.map((tab) => tab.label);
      fetchSurveyQuestionsResult.data.Data
        .filter((question) => !tabLabels.includes(`Qn ${question.questionLevel}`))
        .forEach((question) => tabs.push({ label: `Qn ${question.questionLevel}` }));
      this.setState({ tabs });
      EventHandler.trackEvent({ category: 'AOD', action: 'fetch survey questions', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'AOD', action: 'fetch survey questions', value: false });
      EventHandler.handleException(exception);
    } finally {
      if (initial) {
        this.setState({ isFetchingSurveyQuestions: false });
      } else {
        this.setState({ isFetchingSurveyQuestionsAgain: false });
      }
    }
  }

  async refreshSurveyResults() {
    const { alertActions } = this.props;
    const { isFetchingStatsAgain, isFetchingSurveyQuestionsAgain } = this.state;
    await Promise.all([this.fetchAODStats(false), this.fetchSurveyQuestions(false)]);
    if (!isFetchingStatsAgain && !isFetchingSurveyQuestionsAgain) {
      alertActions.addAlert({ type: 'success', message: 'Successfully fetched the survey results' });
    }
  }

  async fetchCollaborators() {
    const { authentication, EventHandler, collaboratorsActions } = this.props;
    try {
      const fetchCollaboratorsResult = await collaboratorsActions.fetchCollaborators(authentication.user);
      collaboratorsActions.addCollaborators(fetchCollaboratorsResult.data.Data);
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  decodeSurveyId(surveyId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.decode(surveyId);
  }

  render() {
    const { aodReport, authentication, EventHandler, alertActions, windowDimensions, collaborators } = this.props;
    const { isFetchingStats, showSidePanel, sidePanel, isFiltered, startDate, endDate, selectedTab, isFetchingSurveyQuestions, tabs } = this.state;
    const { width } = windowDimensions;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    let surveyResults;
    if (Object.keys(aodReport).includes(surveyId)) {
      surveyResults = aodReport[surveyId];
    }

    return (
      <SimpleLayoutExtended
        sidePanel={showSidePanel ? sidePanel : null}
        action={(size) => {
          if (size === 'small') {
            return (
              <CircularButton className="primary cta" icon="filter_list" small color="#002366" onClick={this.onFilter} />
            );
          }

          return (
            <ActionButton
              className="primary"
              icon="add"
              text={(isFiltered) ? (<span>Modify&nbsp;Filters</span>) : (<span>More&nbsp;Filters</span>)}
              onClick={this.onFilter}
              large
              style={{
                backgroundColor: '#002366', color: '#fff', width: 200, height: 50, borderRadius: 25, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
              }}
            />
          );
        }}
        actions={(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10 }}>
            <ActionButton text="Download" icon="save_alt" />
            <ActionButton text="Share" icon="share" />
            <ActionButton text="Refresh" icon="refresh" />
            <DateRangePicker handleDateRangeChanged={this.onDateRangeChange} defaultStart={startDate} defaultEnd={endDate} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
          </div>
        )}
      >
        <div style={{ width: '100%', padding: width > 425 ? '0 10px 0 10px' : 0 }}>
          <Row style={{ width: '100%', margin: 0, padding: 0 }}>
            <Col>
              <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ borderBottom: 'none', zIndex: 0 }} />
            </Col>
          </Row>
          <SurveySummary surveyResults={surveyResults} isFetchingData={isFetchingStats} width={width} />
          <Row style={{ width: '100%', margin: 0, padding: 0 }}>
            <Col xl={7} lg={7} md={7} sm={12} xs={12} style={{ padding: 0 }}>
              <TabResults surveyId={surveyId} surveyResults={surveyResults} selectedTab={selectedTab} aodReport={aodReport} isFetchingSurveyQuestions={isFetchingSurveyQuestions} startDate={startDate} endDate={endDate} onFilterByBarChartOption={this.onFilterByBarChartOption} authentication={authentication} collaborators={collaborators} EventHandler={EventHandler} alertActions={alertActions} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={12}>
              <SurveyMetadata targetStats={surveyResults ? surveyResults.participantStats : {}} activeParticipantStats={surveyResults ? surveyResults.activeParticipantStats : {}} target={surveyResults ? surveyResults.contacted : 0} responded={surveyResults ? surveyResults.responded : 0} isFetchingData={isFetchingStats} />
            </Col>
          </Row>
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(AODReport);
