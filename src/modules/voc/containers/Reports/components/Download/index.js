import React, { Component } from 'react';
import { Checkbox, Modal, Button, Header } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AWS from 'aws-sdk';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';

import config from 'Config';
import ActivityHandler from 'Utils/ActivityHandler';
import * as aodReportActions from '../../CS/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import ActionButton from 'SharedComponents/action-button';
import SurveyActionButton from 'Modules/voc/containers/Conversations/components/SurveyActionButton';

@connect(() => ({}),
(dispatch) => ({
  aodReportActions: bindActionCreators(aodReportActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
export default class Download extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    surveyType: PropTypes.string,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    onToggleOptionsMenu: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { startDate, endDate, surveyType } = props;
    const npsGroupFilters = surveyType === 'CS' ? {
      promoters: true,
      passives: true,
      detractors: true,
    } : {};

    this.state = {
      isDownloading: false,
      isPolling: false,
      requestId: null,
      downloadProgress: null,
      fileName: null,
      participantStatFilters: {
        complete: true,
        inProgress: true,
        kickedout: true,
        optedout: true,
        pending: true,
        timedout: true,
      },
      npsGroupFilters,
      startDate,
      endDate,
      npsFilters: {},
      openModal: false,
    };

    this.onHideDownloadModal = this.onHideDownloadModal.bind(this);
    this.handleParticipantStatFiltersClick = this.handleParticipantStatFiltersClick.bind(this);
    this.handleGroupFiltersClick = this.handleGroupFiltersClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { startDate, endDate, npsFilters, surveyType } = newProps;
    if (surveyType === 'CS') {
      this.setState({
        npsGroupFilters: {
          promoters: true,
          passives: true,
          detractors: true,
        },
      });
    }
    if (startDate !== this.state.startDate || endDate !== this.state.endDate || npsFilters !== this.state.npsFilters) {
      this.setState({
        startDate,
        endDate,
        npsFilters,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollDownloadID);
  }

  onHideDownloadModal() {
    // this.handleRef.click();
    // this.props.onToggleOptionsMenu();
    this.props.onCloseModal();
  }

  handleParticipantStatFiltersClick(e, { id }) {
    const { participantStatFilters } = this.state;
    this.setState({ participantStatFilters: { ...participantStatFilters, [id]: e.target.checked } });
    this.props.EventHandler.trackEvent({ category: 'SurveyDownload', action: 'click participant stats filter', value: id });
  }

  handleGroupFiltersClick(e, { id }) {
    const { npsGroupFilters } = this.state;
    this.setState({ npsGroupFilters: { ...npsGroupFilters, [id]: e.target.checked } });
    this.props.EventHandler.trackEvent({ category: 'SurveyDownload', action: 'click nps group filter', value: id });
  }

  download = (fileName) => {
    const params = { Bucket: 'new-platform-qa', Key: fileName };
    const { startDate, endDate } = this.props;
    AWS.config = { accessKeyId: 'AKIAJAWK3TB7EEHCD6CQ', secretAccessKey: '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' };
    const s3 = new AWS.S3();

    s3.getSignedUrl('getObject', params, async (err, signedUrl) => {
      if (err) {
        this.props.alertActions.addAlert({ message: 'Oops! Something went wrong' });
      } else {
        await axios({
          url: signedUrl,
          method: 'GET',
          responseType: 'blob',
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${this.props.surveyTitle} - ${moment(startDate).format('LL')} to ${moment(endDate).format('LL')}.csv`);
          document.body.appendChild(link);
          link.click();
          this.props.alertActions.addAlert({ message: 'Successfully downloaded the survey results' });
        });
      }
 
    });
  };

  downloadOnPremise = async() => {
    const {requestId} = this.state;
    const { startDate, endDate } = this.props;

    console.log('downloading on premise');

    try {
      const downloadOnPremiseResults = await this.props.aodReportActions.downloadOnPremise(requestId);

      const url = window.URL.createObjectURL(new Blob([downloadOnPremiseResults.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.props.surveyTitle} - ${moment(startDate).format('LL')} to ${moment(endDate).format('LL')}.csv`);
      document.body.appendChild(link);
      link.click();
      this.props.alertActions.addAlert({ message: 'Successfully downloaded the survey results' });

      this.setState(() => ({
        isDownloading: false,
        isPolling: false,
        downloadProgress: null,
      }));
      this.props.updateDownloadProgress(null, '');
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    }
  }

  pollDownloadProgress = async (surveyId, pollDownloadID) => {
    const { requestId } = this.state;
    if (!requestId) {
      this.setState(() => ({
        isPolling: false,
        downloadProgress: null,
      }));
      return;
    }

    this.props.updateDownloadProgress(this.state.downloadProgress);

    try {
      const pollDownloadProgressResults = await this.props.aodReportActions.pollDownloadProgress(surveyId, requestId);
      this.setState({
        downloadProgress: parseInt(pollDownloadProgressResults.data.Data.status, 10),
        fileName: pollDownloadProgressResults.data.Data.path,
      }, () => {
        const { downloadProgress } = this.state;
        this.props.updateDownloadProgress(downloadProgress, pollDownloadProgressResults.data.Data.overrallStatus);
        if (downloadProgress === 100 && pollDownloadProgressResults.data.Data.overrallStatus === 'PROCESSED') {
          clearInterval(pollDownloadID);
          if (config.onPremise) 
          {
            this.downloadOnPremise();
          } else {
            this.download(this.state.fileName);
          }
        } else if (pollDownloadProgressResults.data.Data.overrallStatus === 'FAILED') {
          clearInterval(pollDownloadID);
          this.setState({
            isDownloading: false,
            isPolling: false,
            downloadProgress: null,
          }, () => {
            this.props.updateDownloadProgress(this.state.downloadProgress);
          });

          this.props.alertActions.addAlert({ type: 'error', message: 'Failed to download file.' });
        }
      });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    }
  };

  requestDownload = async () => {
    const { surveyId } = this.props;
    this.setState({
      isDownloading: true,
      isPolling: true,
      downloadProgress: 0,
    });
    this.props.onCloseModal({ open: false });
    this.props.onToggleOptionsMenu();

    const { participantStatFilters, startDate, endDate, npsFilters, npsGroupFilters } = this.state;

    try {
      const requestDownloadResults = await this.props.aodReportActions.requestDownload(surveyId, participantStatFilters, { startDate, endDate }, npsFilters, npsGroupFilters);
      this.setState(() => ({
        requestId: requestDownloadResults.data.Data.requestId,
      }));

      this.props.alertActions.addAlert({ type: 'success', message: 'Your download has started' });
      this.props.EventHandler.trackEvent({ category: 'SurveyDownload', action: 'request download', value: true });

      if (this.state.isPolling) {
        const pollDownloadID = setInterval(
          () => {
            this.pollDownloadProgress(surveyId, pollDownloadID);
          },
          3000
        );
      }
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'SurveyDownload', action: 'request download', value: false });
      this.props.EventHandler.handleException(exception);
      ActivityHandler.handleException(this.props.dispatch, exception);
      this.setState({
        isDownloading: false,
        downloadProgress: null,
      });
    }
  };

  render() {
    const { isDownloading, isPolling, participantStatFilters, npsGroupFilters } = this.state;
    const { open, onOpenModal } = this.props;

    return (
        <Modal
          open={open}
          trigger={<ActionButton onClick={onOpenModal} icon="file_download" text="Download CSV" loading={isDownloading || isPolling} style={{ justifyContent: 'flex-start', borderRadius: 0 }} />}
          dimmer="blurring"
          closeOnDimmerClick
          closeOnEscape
          closeOnRootNodeClick
          style={{ borderRadius: 16, marginTop: 170, marginRight: 'auto', marginLeft: 'auto', position: 'relative' }}
        >
          <Modal.Content style={{ borderRadius: 16 }}>
            <Header>Download Survey Results CSV file</Header>
            <div>Select the <b>Participant Statistic Filters</b> to customize the data downloaded</div>
            <div style={{ marginTop: 20, marginBottom: 10 }}>
              {Object.keys(participantStatFilters).map((key) => (
                <div key={key}>
                  <Checkbox style={{ textTransform: 'capitalize', color: '#808285 !important', height: '2em' }} label={key} id={key} key={key} defaultChecked={participantStatFilters[key]} onChange={this.handleParticipantStatFiltersClick} />
                </div>
              ))}
              {Object.keys(npsGroupFilters).map((key) => (
                <div key={key}>
                  <Checkbox style={{ textTransform: 'capitalize', color: '#808285 !important', height: '2em' }} label={key} id={key} key={key} defaultChecked={npsGroupFilters[key]} onChange={this.handleGroupFiltersClick} />
                </div>
              ))}
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button disabled={this.state.isSendingSurvey} onClick={this.onHideDownloadModal} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', height: 35, borderRadius: 17.5, margin: '0 5px', padding: '3px 20px', backgroundColor: '#fff' }}>
                Dismiss
              </Button>
              <SurveyActionButton onClick={this.requestDownload} type="submit" disabled={isDownloading} loading={isDownloading} text="Download" />
            </div>
          </Modal.Content>
        </Modal>
    );
  }
}
