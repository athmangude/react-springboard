/* eslint-disable jsx-a11y/href-no-hash, no-underscore-dangle, no-shadow, object-curly-newline, no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-grid-system';
import ContainerDimensions from 'react-container-dimensions';
import { Dropdown, Loader } from 'semantic-ui-react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import { saveAs } from 'file-saver';
import Hashids from 'hashids';

import ActionButton from 'SharedComponents/action-button';
import withAuthentication from 'Utils/withAuthentication';
// import SideTopBarLayout from 'Layouts/side-top-bar';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import ChartContainer from '../components/chart-container';
import LoadingEmptyChartComponent from '../components/LoadingEmptyChartComponent';
import SurveySurmary from '../components/SurveySummary';
import SurveyMetadata from '../components/survey-metadata';
import Download from '../components/Download';
import DownloadProgress from '../components/Download/DonwloadProgress';
import DataTable from '../components/Datatable';
import './style.css';
import DateRangePicker from '../components/DateRangePicker';
import ShareLink from '../components/ShareLink';

import * as aodReportActions from './flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import * as collaboratorsActions from 'Modules/voc/containers/Settings/Collaborators/flux/actions';

const viewOptions = [
  { key: 'chart', text: 'Summary Charts', value: 'chart', icon: 'view_compact' },
  { key: 'datatable', text: 'Data Table', value: 'datatable', icon: 'grid_on' },
];

const exportOptions = [
  { key: 'jpeg', text: 'Save as JPEG', value: 'jpeg', icon: 'photo' },
  { key: 'pdf', text: 'Save as PDF', value: 'pdf', icon: 'picture_as_pdf' },
];

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

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
    aodReportActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onCloseModal = this.onCloseModal.bind(this);
    this.onFilterByBarChartOption = this.onFilterByBarChartOption.bind(this);
    this.onToggleOptionsMenu = this.onToggleOptionsMenu.bind(this);
    this.onChangeView = this.onChangeView.bind(this);
    this.onExportResults = this.onExportResults.bind(this);
    this.updateDownloadProgress = this.updateDownloadProgress.bind(this);
    this.refreshSurveyResults = this.refreshSurveyResults.bind(this);
  }

  state = {
    isFetchingStats: false,
    isFetchingSurveyQuestions: false,
    view: 'chart',
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    isFetchingStatsAgain: false,
    isFetchingSurveyQuestionsAgain: false,
    isFilteringByDate: false,
    open: false,
    surveyType: '',
    downloadProgress: null,
    isOpen: false,
    clickFilters: [],
    isDownloadModalOpen: false,
  };

  componentDidMount() {
    this.fetchAODStats();
    this.fetchSurveyQuestions();
    // this.fetchCollaborators();

    this.interval = setInterval(() => {
      const isInitial = false;
      this.fetchAODStats(isInitial);
      this.fetchSurveyQuestions(isInitial);
    }, 10000);
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    clearInterval(this.interval);
    appActions.unsetRouteTitle();
  }

  onCloseModal() {
    // this.handleRef.click();
    this.setState({ isDownloadModalOpen: false });
  }

  onOpenModal = () => {
    this.setState({ isDownloadModalOpen: true });
  }

  onToggleOptionsMenu(status) {
    let { isOpen } = this.state;
    isOpen = !isOpen;
    if (status === 'close') {
      isOpen = false;
    } else if (status === 'open') {
      isOpen = true;
    }
    this.setState({ isOpen });
  }

  onChangeView(option) {
    const { EventHandler } = this.props;
    this.setState({ view: option.value });
    this.onToggleOptionsMenu('close');
    EventHandler.trackEvent({ category: 'AOD', action: 'change view', value: option.value });
  }

  onExportResults(option) {
    const { EventHandler } = this.props;
    const { surveyTitle } = this.state;
    this.onToggleOptionsMenu('close');
    const element = document.getElementById('export');
    html2canvas(element).then((canvas) => {
      const base64image = canvas.toDataURL('image/jpeg');
      if (option.value === 'jpeg') {
        const block = base64image.split(';');
        const mimeType = block[0].split(':')[1];
        const realData = block[1].split(',')[1];
        const canvasBlob = b64toBlob(realData, mimeType);
        saveAs(canvasBlob, `${surveyTitle}.jpeg`);
      } else if (option.value === 'pdf') {
        const pdf = new JSPDF();
        pdf.addImage(base64image, 'JPEG', 0, 0, 180, 150);
        pdf.save(`${surveyTitle}.pdf`);
      }
    });
    EventHandler.trackEvent({ category: 'AOD', action: 'export results', value: option.value });
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

  handleDateRangeChanged = ({ from, to }) => {
    const { EventHandler } = this.props;
    this.setState({
      isFilteringByDate: true,
      startDate: from,
      endDate: to,
    }, async () => {
      await this.refreshSurveyResults();
      this.setState({ isFilteringByDate: false });
      EventHandler.trackEvent({ category: 'AOD', action: 'date range change', value: `${from} - ${to}` });
    });
  };

  async fetchAODStats(initial = true) {
    if (initial) {
      this.setState({ isFetchingStats: true });
    } else {
      this.setState({ isFetchingStatsAgain: true });
    }

    const { EventHandler, aodReportActions } = this.props;
    const { router } = this.context;
    const { startDate, endDate, clickFilters } = this.state;

    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;

    try {
      const fetchAODDataV2Result = await this.props.aodReportActions.fetchAODDataV2(
        surveyId,
        { startDate, endDate },
      );
      this.props.aodReportActions.setAODData(
        surveyId,
        fetchAODDataV2Result.data.Data
      );
      this.setState(() => ({
        surveyTitle: fetchAODDataV2Result.data.Data.surveyTitle,
        surveyType: fetchAODDataV2Result.data.Data.surveyType,
      }));
      const { appActions } = this.props;
      appActions.setRouteTitle(fetchAODDataV2Result.data.Data.surveyTitle);
      this.props.EventHandler.trackEvent({ category: 'AOD', action: 'fetch AOD stats', value: true });
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

    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { startDate, endDate, clickFilters } = this.state;

    try {
      const fetchSurveyQuestionsResult = await aodReportActions.fetchSurveyQuestions(surveyId, { startDate, endDate }, clickFilters);
      aodReportActions.setSurveyQuestions(surveyId, fetchSurveyQuestionsResult.data.Data);
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

  decodeSurveyId(surveyId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.decode(surveyId);
  }

  updateDownloadProgress(downloadProgress, downloadStatus) {
    this.setState({ downloadProgress, downloadStatus });
  }

  renderCharts() {
    const { aodReport, authentication, collaborators, EventHandler, alertActions } = this.props;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { startDate, endDate, isFetchingSurveyQuestions, npsFilters } = this.state;

    if (isFetchingSurveyQuestions) {
      return (
        <LoadingEmptyChartComponent
          items={3}
          isLoading={isFetchingSurveyQuestions}
        />
      );
    }

    if (Object.keys(aodReport).includes(surveyId)) {
      const survey = aodReport[surveyId];
      let questions = survey.responseStats;

      if (!questions.length) {
        return (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <LoadingEmptyChartComponent isLoading={false} />
            <h3 style={{ fontWeight: 'lighter', margin: '10px 20px', textAlign: 'center' }}>
              Oops! We have not collected any data for this Conversation
            </h3>
          </div>
        );
      }

      return questions.sort((a, b) => a.questionLevel.localeCompare(b.questionLevel, undefined, { numeric: true })).map((question) => (
        <ChartContainer surveyId={surveyId} onFilterByBarChartOption={this.onFilterByBarChartOption} npsFilters={npsFilters} question={question} key={question.questionId} authentication={authentication} collaborators={collaborators} startDate={startDate} endDate={endDate} EventHandler={EventHandler} alertActions={alertActions} />
      ));
    }
    return null;
  }

  renderDataTable = () => {
    const { EventHandler, alertActions } = this.props;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { startDate, endDate, surveyTitle } = this.state;

    return (
      <DataTable surveyId={surveyId} startDate={startDate} endDate={endDate} title={surveyTitle} EventHandler={EventHandler} alertActions={alertActions} />
    );
  };

  renderTitle() {
    const { aodReport } = this.props;
    const { isFetchingStats } = this.state;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;

    if (isFetchingStats) {
      return (
        <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
          <div style={{ width: '100%' }}>
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 140, height: 25 }} /></div>}
            />
          </div>
        </div>
      );
    }

    if (Object.keys(aodReport).includes(surveyId)) {
      const survey = aodReport[surveyId];

      return (
        <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%', maxWidth: 400 }}>
          <div>
            <h4 style={{ margin: 0, color: '#3d4553' }}>
              {`${survey.surveyTitle} (${survey.joincode})`}
              &nbsp;
              <span style={{ color: '#6d6e71', fontSize: 12, fontFamily: 'Lato', fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: -0.2 }}>
                by
                &nbsp;
                {survey.createdBy}
                &nbsp; - &nbsp;
                &nbsp;
                {survey.audienceName}
                .&nbsp;
                {moment(survey.createDate).format('MMM DD, YYYY')}
              </span>
            </h4>
          </div>
        </div>
      );
    }

    return null;
  }

  renderActions(width) {
    const { EventHandler, authentication, aodReport, alertActions } = this.props;
    const { isFetchingStatsAgain, isFetchingSurveyQuestionsAgain, isFilteringByDate, isFetchingSurveyQuestions, startDate, endDate, npsFilters, surveyType, surveyTitle, isOpen, isDownloadModalOpen } = this.state;
    const { router } = this.context;
    if (isFetchingSurveyQuestions) {
      return (
        <div style={{ display: 'flex', flexDirection: width > 425 ? 'row' : 'column', width: 'calc(100% - 400px)' }}>
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', paddingRight: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 25, marginBottom: 5 }} /></div>} />
        </div>
      );
    }

    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { user } = authentication;
    let survey = {};
    if (Object.keys(aodReport).includes(surveyId)) {
      survey = aodReport[surveyId];
    }

    return (
      <div className="no-print" data-html2canvas-ignore style={{ display: 'flex', flexDirection: width > 425 ? 'row' : 'column', marginBottom: 15, paddingLeft: width > 425 ? 0 : 10 }}>
        <DateRangePicker handleDateRangeChanged={this.handleDateRangeChanged} isFilteringByDate={isFilteringByDate} defaultStart={startDate} defaultEnd={endDate} beginning={survey.createDate} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <ShareLink surveyId={surveyId} surveyType={surveyType} isFetchingData={isFetchingSurveyQuestions} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
          <ActionButton icon="refresh" text="Refresh" onClick={this.refreshSurveyResults} loading={isFetchingStatsAgain || isFetchingSurveyQuestionsAgain} />
          <div style={{ position: 'relative' }}>
            <ActionButton icon="more_horiz" text="More" onClick={this.onToggleOptionsMenu} />
            <div style={{ width: 150, display: 'flex', flexDirection: 'column', position: 'absolute', top: 50, right: 5, boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', zIndex: 1, visibility: isOpen ? 'visible' : 'hidden' }}>
              <Download open={isDownloadModalOpen} surveyId={surveyId} surveyType={surveyType} surveyTitle={surveyTitle} user={user} onCloseModal={this.onCloseModal} onOpenModal={this.onOpenModal} onToggleOptionsMenu={this.onToggleOptionsMenu} startDate={startDate} endDate={endDate} npsFilters={npsFilters} updateDownloadProgress={this.updateDownloadProgress} EventHandler={EventHandler} alertActions={alertActions} />
              <ReactToPrint trigger={() => (<ActionButton icon="print" text="Print" style={{ justifyContent: 'flex-start', borderRadius: 0 }} />)} onBeforePrint={() => this.onToggleOptionsMenu('close')} onAfterPrint={() => this.onToggleOptionsMenu('close')} content={() => this.surveyResultsRef} />
              {
                viewOptions.map((option) => (
                  <ActionButton key={option.key} icon={option.icon} text={option.text} onClick={() => this.onChangeView(option)} style={{ justifyContent: 'flex-start', borderRadius: 0 }} />
                ))
              }
              {
                exportOptions.map((option) => (
                  <ActionButton key={option.key} icon={option.icon} text={option.text} onClick={() => this.onExportResults(option)} style={{ justifyContent: 'flex-start', borderRadius: 0 }} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMobileActions(width) {
    const { EventHandler, authentication, aodReport, alertActions } = this.props;
    const { isFetchingStatsAgain, isFetchingSurveyQuestionsAgain, isFilteringByDate, isFetchingSurveyQuestions, startDate, endDate, surveyType, surveyTitle, open, view, isOpen, isDownloadModalOpen } = this.state;
    const { router } = this.context;
    if (isFetchingSurveyQuestions) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 25 }} /></div>} />
        </div>
      );
    }

    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { user } = authentication;
    let survey = {};
    if (Object.keys(aodReport).includes(surveyId)) {
      survey = aodReport[surveyId];
    }

    return (
      <div className="no-print" data-html2canvas-ignore style={{ display: 'flex', flexDirection: width < 425 ? 'column' : 'row', width: '100%' }}>
        <DateRangePicker handleDateRangeChanged={this.handleDateRangeChanged} isFilteringByDate={isFilteringByDate} defaultStart={startDate} defaultEnd={endDate} beginning={survey.createDate} padding={0} margin={0} width={width} EventHandler={EventHandler} alertActions={alertActions} />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <ShareLink surveyId={surveyId} surveyType={surveyType} isFetchingData={isFetchingSurveyQuestions} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
          <div role="button" tabIndex={0} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px', fontSize: 11 }} onClick={() => this.refreshSurveyResults()}>
            {isFetchingStatsAgain || isFetchingSurveyQuestionsAgain ? (<Loader active inline size="tiny" style={{ marginRight: 10 }} />) : (<i className="material-icons" style={{ fontSize: 20 }}>refresh</i>)}
            <span style={{ margin: '0 5px' }}>Refresh</span>
          </div>
          <div role="button" tabIndex={0} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, fontSize: 11 }}>
            <Dropdown className="inner" text={<div style={{ width: '100%', backgroundColor: '#808285', height: 35, padding: 11, borderRadius: 17.5 }}><span style={{ fontWeight: 'normal', color: '#ffffff', margin: 10 }}>Actions</span></div>} selectOnNavigation={false} item floating labeled button style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, fontSize: 11, backgroundColor: 'inherit', padding: 0 }}>
              <Dropdown.Menu open={open}>
                {
                  user ? (
                    <Dropdown.Item>
                      <Download open={isDownloadModalOpen} surveyId={surveyId} surveyType={surveyType} surveyTitle={surveyTitle} user={user} onCloseModal={this.onCloseModal} onOpenModal={this.onOpenModal} startDate={startDate} endDate={endDate} updateDownloadProgress={this.updateDownloadProgress} EventHandler={EventHandler} alertActions={alertActions} />
                    </Dropdown.Item>
                  ) : null
                }
                <Dropdown.Item>
                  <ReactToPrint
                    trigger={() => (
                      <div role="button" tabIndex={0} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px', fontSize: 11 }}>
                        <i className="material-icons" style={{ fontSize: 20 }}>print </i>
                        <span style={{ margin: '0 5px' }}>Print</span>
                      </div>
                    )}
                    content={() => this.surveyResultsRef}
                  />
                </Dropdown.Item>
                <Dropdown.Item>
                  <div role="button" tabIndex={0} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px', fontSize: 11 }}>
                    <Dropdown
                      className="inner"
                      text={(
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <i className="material-icons" style={{ fontSize: 20, margin: '0 5px' }}>remove_red_eye</i>
                          &nbsp;
                          <span style={{ fontWeight: 'normal' }}>Views</span>
                        </div>
                      )}
                      options={viewOptions}
                      selectOnNavigation={false}
                      value={view}
                      button
                      inline
                      pointing="top"
                      onChange={this.changeView}
                      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px', fontSize: 11, backgroundColor: 'inherit', padding: 0 }}
                    />
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div role="button" tabIndex={0} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px', fontSize: 11 }}>
                    <Dropdown
                      className="inner"
                      text={(
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <i className="material-icons" style={{ fontSize: 20, margin: '0 5px' }}>import_export</i>
                          &nbsp;
                          <span style={{ fontWeight: 'normal' }}>Save As</span>
                        </div>
                      )}
                      options={exportOptions}
                      selectOnNavigation={false}
                      button
                      inline
                      pointing="top"
                      onChange={this.exportResults}
                      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px !important', fontSize: 11, backgroundColor: 'inherit', padding: 0 }}
                    />
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { aodReport, authentication } = this.props;
    const { view, isFetchingStats, downloadProgress, downloadStatus } = this.state;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length >= 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    let surveyResults;
    if (Object.keys(aodReport).includes(surveyId)) {
      surveyResults = aodReport[surveyId];
    }

    return (
      <SimpleLayoutExtended>
        <Container fluid style={{ flexDirection: 'column', margin: 0, padding: 10, width: '100%' }} ref={(el) => (this.surveyResultsRef = el)} id="export">
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }} ref={(ref) => this.handleRef = ref}>
            <DownloadProgress downloadProgress={downloadProgress} downloadStatus={downloadStatus} />
            <ContainerDimensions>
              {({ width }) => (
                <div style={{ width: '100%', backgroundColor: 'inherit', padding: 0, marginBottom: 10 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap', borderBottom: 'solid 2px rgba(67, 70, 86, 0.1)', padding: 10 }}>
                    <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
                      {this.renderTitle()}
                    </div>
                    {this.renderActions(width)}
                  </div>
                  <Row onClick={() => this.onToggleOptionsMenu('close')} style={{ margin: 0, padding: 0 }}>
                    <SurveySurmary isFetchingData={isFetchingStats} surveyId={surveyId} surveyResults={surveyResults} width={width} />
                    {view === 'chart' ? (
                      <Col style={{ paddingTop: 10 }}>{this.renderCharts()}</Col>
                    ) : null}
                    {view === 'chart' ? (
                      <Col xl={5} lg={5} md={5} sm={12} xs={12}>
                        <SurveyMetadata user={authentication.user} targetStats={surveyResults ? surveyResults.participantStats : {}} activeParticipantStats={surveyResults ? surveyResults.activeParticipantStats : {}} target={surveyResults ? surveyResults.contacted : 0} responded={surveyResults ? surveyResults.responded : 0} isFetchingData={isFetchingStats} />
                      </Col>
                    ) : null}
                    {view === 'datatable' ? this.renderDataTable() : null}
                  </Row>
                </div>
              )}
            </ContainerDimensions>
          </div>

        </Container>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(AODReport);
