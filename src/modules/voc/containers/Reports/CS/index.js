/* eslint-disable jsx-a11y/href-no-hash, no-underscore-dangle, no-shadow, object-curly-newline, no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContainerDimensions from 'react-container-dimensions';
import { Container, Row } from 'react-grid-system';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import FileSaver from 'file-saver';
import Hashids from 'hashids';

import withAuthentication from 'Utils/withAuthentication';
// import SideTopBarLayout from 'Layouts/side-top-bar';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import SurveySummary from '../components/SurveySummary';
import AlternativeView from './components/AlternativeView';
import Download from '../components/Download';
import DownloadProgress from '../components/Download/DonwloadProgress';
import DataTable from '../components/Datatable';
import './style.css';
import DateRangePicker from '../components/DateRangePicker';
import ShareLink from '../components/ShareLink';
import NPSChart from './components/NPSChart';
import NPSDimensions from './components/NPSDimensions';
import ActionButton from 'SharedComponents/action-button';

import * as csReportActions from './flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import * as collaboratorsActions from 'Modules/voc/containers/Settings/Collaborators/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

const viewOptions = [
  { key: 'defaultCSSurveyResultsPage', text: 'Default View', value: 'defaultCSSurveyResultsPage', icon: 'bar_chart' },
  { key: 'alternativeSurveyResultsPage', text: 'Alternative View', value: 'alternativeSurveyResultsPage', icon: 'view_compact' },
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
    csReportActions: bindActionCreators(csReportActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    collaboratorsActions: bindActionCreators(collaboratorsActions, dispatch),
    alertActions: bindActionCreators({ addAlert }, dispatch),
    dispatch,
  })
)
class CSReport extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    aodReport: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    authentication: PropTypes.object,
    EventHandler: PropTypes.object,
    csReportActions: PropTypes.object,
    collaboratorsActions: PropTypes.object,
    alertActions: PropTypes.object,
    appActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onToggleOptionsMenu = this.onToggleOptionsMenu.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onFilterByBarChartOption = this.onFilterByBarChartOption.bind(this);
    this.updateDownloadProgress = this.updateDownloadProgress.bind(this);
    this.refreshSurveyResults = this.refreshSurveyResults.bind(this);
    this.onChangeView = this.onChangeView.bind(this);
    this.onExportResults = this.onExportResults.bind(this);
    this.setNPSFilters = this.setNPSFilters.bind(this);
  }

  state = {
    isFetchingStats: false,
    isFetchingSurveyQuestions: false,
    isFetchingNPSMetadataFilters: false,
    isFetchingDimensionKeys: false,
    isFetchingDimensions: false,
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    view: 'defaultCSSurveyResultsPage',
    npsFilters: {},
    isFetchingStatsAgain: false,
    isFetchingSurveyQuestionsAgain: false,
    isFilteringByDate: false,
    npsMetaDataFilters: {},
    dimensionKeys: [],
    dimensionKey: null,
    dimensions: [],
    surveyType: '',
    surveyTitle: '',
    downloadProgress: null,
    isOpen: false,
    clickFilters: [],
    isDownloadModalOpen: false,
  };

  componentWillMount() {
    this.fetchAODStats();
    this.fetchSurveyQuestions();
    this.fetchNPSMetadataFilters();
    this.fetchDimensionKeys();
  }

  componentDidMount() {
    this.fetchCollaborators();
  }

  componentWillUnmount() {
    const { appActions } = this.props;
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
    EventHandler.trackEvent({ category: 'CS', action: 'change view', value: option.value });
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
        FileSaver.saveAs(canvasBlob, `${surveyTitle}.jpeg`);
      } else if (option.value === 'pdf') {
        const pdf = new JSPDF();
        pdf.addImage(base64image, 'JPEG', 0, 0, 180, 150);
        pdf.save(`${surveyTitle}.pdf`);
      }
    });
    EventHandler.trackEvent({ category: 'CS', action: 'export results', value: option.value });
  }

  onDimensionKeyChanged = (e, { value }) => {
    const { EventHandler } = this.props;
    this.setState({ dimensionKey: value }, () => this.fetchDimensions());
    EventHandler.trackEvent({ category: 'CS', action: 'dimension key changed', value });
  };

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

  setNPSFilters = (npsFilters) => {
    const { alertActions } = this.props;
    const { isFetchingStatsAgain, isFetchingSurveyQuestionsAgain } = this.state;
    this.setState({ npsFilters }, async () => {
      await this.fetchAODStats(false);
      await this.fetchSurveyQuestions(false);
      if (!isFetchingStatsAgain || !isFetchingSurveyQuestionsAgain) {
        alertActions.addAlert({ type: 'success', message: 'Successfully filtered the survey results' });
      }
    });
  };

  handleDateRangeChanged = ({ from, to }) => {
    const { EventHandler } = this.props;
    this.setState({
      isFilteringByDate: true,
      startDate: from,
      endDate: to,
    }, async () => {
      await this.refreshSurveyResults();
      this.setState({ isFilteringByDate: false });
      EventHandler.trackEvent({ category: 'CS', action: 'date range changes', value: `${from} - ${to}` });
    });
  };

  async refreshSurveyResults() {
    const { alertActions } = this.props;
    const { isFetchingStatsAgain, isFetchingSurveyQuestionsAgain } = this.state;
    await Promise.all([this.fetchAODStats(false), this.fetchSurveyQuestions(false), this.fetchDimensions()]);
    if (!isFetchingStatsAgain && !isFetchingSurveyQuestionsAgain) {
      alertActions.addAlert({ type: 'success', message: 'Successfully fetched the survey results' });
    }
  }

  async fetchNPSMetadataFilters() {
    const { csReportActions, EventHandler } = this.props;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    this.setState({ isFetchingNPSMetadataFilters: true });
    try {
      const fetchNPSMetadataResult = await csReportActions.fetchNPSMetadataFilters(surveyId);
      csReportActions.setNpsMetaDataFilters(surveyId, fetchNPSMetadataResult.data.Data);
      this.setState({ npsMetaDataFilters: fetchNPSMetadataResult.data.Data });
      EventHandler.trackEvent({ category: 'CS', action: 'fetch nps metadata filters', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'CS', action: 'fetch nps metadata filters', value: false });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingNPSMetadataFilters: false });
    }
  }

  async fetchAODStats(initial = true) {
    if (initial) {
      this.setState({ isFetchingStats: true });
    } else {
      this.setState({ isFetchingStatsAgain: true });
    }
    const { csReportActions, EventHandler, appActions } = this.props;
    const { clickFilters } = this.state;
    const { router } = this.context;

    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { startDate, endDate, npsFilters } = this.state;

    try {
      const fetchAODDataV2Result = await csReportActions.fetchAODDataV2(surveyId, { startDate, endDate }, npsFilters, clickFilters);
      csReportActions.setAODData(surveyId, fetchAODDataV2Result.data.Data);
      this.setState({ surveyTitle: fetchAODDataV2Result.data.Data.surveyTitle, surveyType: fetchAODDataV2Result.data.Data.surveyType });
      appActions.setRouteTitle(fetchAODDataV2Result.data.Data.surveyTitle);
      EventHandler.trackEvent({ category: 'CS', action: 'fetch CS stats', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'CS', action: 'fetch CS stats', value: false });
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
    const { csReportActions, EventHandler } = this.props;
    const { clickFilters } = this.state;
    const { router } = this.context;

    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { startDate, endDate, npsFilters } = this.state;

    try {
      const fetchSurveyQuestionsResult = await csReportActions.fetchSurveyQuestions(surveyId, { startDate, endDate }, npsFilters, clickFilters);
      csReportActions.setSurveyQuestions(surveyId, fetchSurveyQuestionsResult.data.Data);
      EventHandler.trackEvent({ category: 'CS', action: 'fetch survey questions', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'CS', action: 'fetch survey questions', value: false });
      EventHandler.handleException(exception);
    } finally {
      if (initial) {
        this.setState({ isFetchingSurveyQuestions: false });
      } else {
        this.setState({ isFetchingSurveyQuestionsAgain: false });
      }
    }
  }

  async fetchCollaborators() {
    const { EventHandler, collaboratorsActions, authentication } = this.props;
    try {
      const fetchCollaboratorsResult = await collaboratorsActions.fetchCollaborators(authentication.user);
      collaboratorsActions.addCollaborators(fetchCollaboratorsResult.data.Data);
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  async fetchDimensionKeys() {
    this.setState({ isFetchingDimensionKeys: true });
    const { csReportActions, EventHandler } = this.props;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;

    try {
      const fetchDimensionKeysResult = await csReportActions.fetchNPSDimensionKeys(surveyId);
      const dimensionKey = fetchDimensionKeysResult.data.Data.length ? fetchDimensionKeysResult.data.Data[0].key : '';
      this.setState({ dimensionKeys: fetchDimensionKeysResult.data.Data, dimensionKey }, () => this.fetchDimensions());
      EventHandler.trackEvent({ category: 'CS', action: 'fetch dimension keys', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'CS', action: 'fetch dimension keys', value: false });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingDimensionKeys: false });
    }
  }

  async fetchDimensions() {
    this.setState({ isFetchingDimensions: true });
    const { csReportActions, EventHandler } = this.props;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    const { dimensionKey, startDate, endDate, npsFilters } = this.state;
    if (!dimensionKey) {
      this.setState({ isFetchingDimensions: false });
      return;
    }

    try {
      const fetchDimensionsResult = await csReportActions.fetchNPSDimensions(surveyId, dimensionKey, { startDate, endDate }, npsFilters);
      this.setState({ dimensions: fetchDimensionsResult.data.Data });
      EventHandler.trackEvent({ category: 'CS', action: 'fetch dimensions', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'CS', action: 'fetch dimensions', value: false });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingDimensions: false });
    }
  }

  decodeSurveyId(surveyId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.decode(surveyId);
  }

  updateDownloadProgress(downloadProgress, downloadStatus) {
    this.setState({ downloadProgress, downloadStatus });
  }

  renderTitle() {
    const { aodReport } = this.props;
    const { isFetchingStats } = this.state;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;

    if (isFetchingStats) {
      return (
        <div style={{ padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
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
      const audienceName = survey.audienceName.substring(0, 55);

      return (
        <div style={{ padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%', maxWidth: 400 }}>
          <div>
            <h4 style={{ margin: 0, color: '#3d4553' }}>
              {`${survey.surveyTitle} (${survey.joincode})`}
              &nbsp;
              <span style={{ color: '#6d6e71', fontSize: 12, fontFamily: 'Lato', fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: -0.2 }}>
                by
                &nbsp;
                {survey.createdBy}
                &nbsp; - &nbsp;
                {audienceName}
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
    const { aodReport, authentication, EventHandler, alertActions } = this.props;
    const { isFetchingSurveyQuestions, isFetchingSurveyQuestionsAgain, isFetchingStatsAgain, isFilteringByDate, startDate, endDate, npsFilters, surveyType, surveyTitle, isOpen, isDownloadModalOpen } = this.state;
    const { router } = this.context;

    if (isFetchingSurveyQuestions) {
      return (
        <div style={{ display: 'flex', flexDirection: width > 425 ? 'row' : 'column', width: 'calc(100% - 400px)' }}>
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', paddingRight: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 25, marginBottom: 5 }} /></div>} />
        </div>
      );
    }

    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
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

  render() {
    const { aodReport, authentication, EventHandler, alertActions, collaborators } = this.props;
    const { isFetchingSurveyQuestions, startDate, endDate, npsFilters, surveyTitle, isFetchingNPSMetadataFilters, npsMetaDataFilters, isFetchingStats, view, isFetchingDimensions, dimensionKeys, dimensionKey, isFetchingDimensionKeys, dimensions, downloadProgress, downloadStatus, isDownloadModalOpen } = this.state;
    const { router } = this.context;
    const surveyId = router.route.match.params.id.length > 10 ? this.decodeSurveyId(router.route.match.params.id)[0].toString() : router.route.match.params.id;
    let surveyResults = null;
    let questions = [];
    if (Object.keys(aodReport).includes(surveyId)) {
      surveyResults = aodReport[surveyId];
      questions = surveyResults.responseStats;
    }

    return (
      <SimpleLayoutExtended>
        <ContainerDimensions>
          {({ width }) => (
            <Container fluid ref={(el) => (this.surveyResultsRef = el)} id="export" style={{ flexDirection: 'column', margin: 0, padding: 10, width: '100%' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column', borderBottom: 'solid 2px rgba(67, 70, 86, 0.1)', backgroundColor: '#ffffff', marginBottom: 20, marginTop: 10 }} ref={(ref) => this.handleRef = ref}>
                <DownloadProgress downloadProgress={downloadProgress} downloadStatus={downloadStatus} />
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
                    {this.renderTitle()}
                  </div>
                  {this.renderActions(width)}
                </div>
              </div>
              {view === 'defaultCSSurveyResultsPage' ? (
                <div style={{ width: '100%' }} tabIndex={0} role="button" onClick={() => this.onToggleOptionsMenu('close')} >
                  <Row style={{ marginBottom: 20, margin: 0, padding: 0 }}>
                    <NPSChart surveyId={surveyId} question={questions && questions.length ? surveyResults.responseStats.find((question) => question.questionType === 'OPEN_ENDED_NPS_0_10') : null} setNPSFilters={this.setNPSFilters} npsMetaDataFilters={npsMetaDataFilters} isFetchingNPSMetadataFilters={isFetchingNPSMetadataFilters} startDate={startDate} endDate={endDate} npsFilters={npsFilters} />
                  </Row>
                  <SurveySummary surveyResults={surveyResults} isFetchingData={isFetchingStats} width={width} />
                  <Row style={{ minHeight: 250 }}>
                    <NPSDimensions dimensions={dimensions} dimensionKey={dimensionKey} dimensionKeys={dimensionKeys} isFetchingDimensionKeys={isFetchingDimensionKeys} onDimensionKeyChanged={this.onDimensionKeyChanged} isFetchingDimensions={isFetchingDimensions} />
                  </Row>
                </div>
              ) : null}
              {view === 'datatable' ? (<DataTable surveyId={surveyId} startDate={startDate} endDate={endDate} title={surveyTitle} />) : null}
              {view === 'alternativeSurveyResultsPage' ? (<AlternativeView onFilterByBarChartOption={this.onFilterByBarChartOption} width={width} startDate={startDate} endDate={endDate} npsFilters={npsFilters} isFetchingSurveyQuestions={isFetchingSurveyQuestions} isFetchingStats={isFetchingStats} npsMetaDataFilters={npsMetaDataFilters} isFetchingNPSMetadataFilters={isFetchingNPSMetadataFilters} surveyId={surveyId} surveyResults={surveyResults} aodReport={aodReport} setNPSFilters={this.setNPSFilters} authentication={authentication} onToggleOptionsMenu={this.onToggleOptionsMenu} collaborators={collaborators} EventHandler={EventHandler} alertActions={alertActions} />) : null}
            </Container>
          )}
        </ContainerDimensions>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(CSReport);
