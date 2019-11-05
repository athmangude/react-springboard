/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';

import ActionButton from 'SharedComponents/action-button-styled';

export default class Download extends Component {
  static propTypes = {
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    audience: PropTypes.object,
    audiencesActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isDownloading: false,
      isPolling: false,
      requestId: null,
      downloadProgress: null,
    };
  }

  componentWillUnmount() {
    clearInterval(this.pollDownloadID);
  }

  download = (fileName) => {
    const { alertActions, audience, onCloseSidePanel } = this.props;
    const params = { Bucket: 'new-platform-qa', Key: fileName };
    AWS.config = { accessKeyId: 'AKIAJAWK3TB7EEHCD6CQ', secretAccessKey: '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' };
    const s3 = new AWS.S3();

    s3.getSignedUrl('getObject', params, async (err, signedUrl) => {
      if (err) {
        alertActions.addAlert({ message: 'Oops! Something went wrong' });
      } else {
        await axios({
          url: signedUrl,
          method: 'GET',
          responseType: 'blob',
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${audience.panelName}.csv`);
          document.body.appendChild(link);
          link.click();
          alertActions.addAlert({ message: 'Successfully downloaded the audience' });
          onCloseSidePanel();
        });
      }
      this.setState({ isDownloading: false, isPolling: false, downloadProgress: null });
    });
  };

  pollDownloadProgress = async (panelId, pollDownloadID) => {
    const { requestId } = this.state;
    if (!requestId) {
      this.setState({ isPolling: false, downloadProgress: null });
      return;
    }

    const { EventHandler, audiencesActions } = this.props;

    try {
      const pollDownloadProgressResults = await audiencesActions.pollDownloadProgress(panelId, requestId);
      this.setState({
        downloadProgress: parseInt(pollDownloadProgressResults.data.Data.status, 10),
      }, () => {
        const { downloadProgress } = this.state;
        if (downloadProgress === 100 && pollDownloadProgressResults.data.Data.overrallStatus === 'PROCESSED') {
          clearInterval(pollDownloadID);
          this.download(pollDownloadProgressResults.data.Data.path);
        }
      });
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  };

  requestDownload = async () => {
    const { audience, EventHandler, audiencesActions, alertActions } = this.props;
    this.setState(() => ({ isDownloading: true, isPolling: true, downloadProgress: 0 }));

    try {
      const requestDownloadResults = await audiencesActions.requestDownload(audience.panelId);
      this.setState({ requestId: requestDownloadResults.data.Data.requestId });

      alertActions.addAlert({ type: 'success', message: 'Your download has started' });
      EventHandler.trackEvent({ category: 'SurveyDownload', action: 'request download', value: true });

      const { isPolling } = this.state;
      if (isPolling) {
        const pollDownloadID = setInterval(() => this.pollDownloadProgress(audience.panelId, pollDownloadID), 3000);
      }
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'SurveyDownload', action: 'request download', value: false });
      EventHandler.handleException(exception);
      this.setState({ isDownloading: false, downloadProgress: null });
    }
  };

  render() {
    const { isDownloading, isPolling } = this.state;

    return (
      <div style={{ padding: '0 10px 0 10px', position: 'absolute', bottom: 80, width: '100%' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
          <ActionButton className="primary" type="submit" large text="Download" disabled={isDownloading} loading={isDownloading} onClick={this.requestDownload} icon="cloud_download" style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
        </div>
      </div>
    );
  }
}
