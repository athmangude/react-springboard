import React, { Component } from 'react';
import { Loader, Checkbox, Modal, Button } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AWS from 'aws-sdk';
import axios from 'axios';
import PropTypes from 'prop-types';

import ActivityHandler from 'Utils/ActivityHandler';
import * as incentivesUsageActions from '../flux/actions';

@connect(() => ({}),
(dispatch) => ({
  incentivesUsageActions: bindActionCreators(incentivesUsageActions, dispatch),
  dispatch,
}))
export default class Download extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isDownloading: false,
    isPolling: false,
    requestId: null,
    downloadProgress: null,
    fileName: null,
  }

  componentWillUnmount() {
    clearInterval(this.pollDownloadID);
  }

  download = (fileName) => {
    const params = { Bucket: 'new-platform-qa', Key: fileName };
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
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          this.props.alertActions.addAlert({ message: 'Successfully downloaded the incentives usage' });
        });
      }
      this.setState(() => ({
        isDownloading: false,
        isPolling: false,
        downloadProgress: null,
      }));
    });
  };

  pollDownloadProgress = async (pollDownloadID) => {
    const { requestId } = this.state;
    if (!requestId) {
      this.setState(() => ({
        isPolling: false,
        downloadProgress: null,
      }));
      return;
    }

    try {
      const pollDownloadProgressResults = await this.props.incentivesUsageActions.pollDownloadProgress(requestId);
      this.setState({
        downloadProgress: parseInt(pollDownloadProgressResults.data.Data.status, 10),
        fileName: pollDownloadProgressResults.data.Data.path,
      }, () => {
        const { downloadProgress } = this.state;
        if (downloadProgress === 100) {
          clearInterval(pollDownloadID);
          this.download(this.state.fileName);
        }
      });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    }
  };

  requestDownload = async () => {
    const { surveyId, startDate, endDate } = this.props;
    this.setState({
      isDownloading: true,
      isPolling: true,
    });

    try {
      const requestDownloadResults = await this.props.incentivesUsageActions.requestDownload(surveyId, { startDate, endDate });
      this.setState(() => ({
        requestId: requestDownloadResults.data.Data.requestId,
      }));

      this.props.alertActions.addAlert({ type: 'success', message: 'Your download has started' });
      this.props.EventHandler.trackEvent({ category: 'IncentivesUsage', action: 'request download', value: true });

      if (this.state.isPolling) {
        const pollDownloadID = setInterval(
          () => {
            this.pollDownloadProgress(pollDownloadID);
          },
          3000
        );
      }
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'IncentivesUsage', action: 'request download', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
      this.setState({
        isDownloading: false,
        downloadProgress: null,
      });
    }
  };

  render() {
    const { isDownloading, isPolling, downloadProgress } = this.state;

    return (
      <div
        role="button"
        tabIndex={0}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', color: '#6d6e71', borderRadius: 17.5, margin: '0 5px', letterSpacing: 0.5, fontSize: 12, cursor: 'pointer' }}
        disabled={isDownloading || isPolling}
        onClick={this.requestDownload}
      >
        <i className="material-icons" style={{ fontSize: 20 }}>file_download</i>
        <span style={{ margin: '0 5px' }}>Download CSV</span>
        {isDownloading || isPolling ? (
          <Loader active inline size="tiny" style={{ marginRight: 10 }} />
        ) : null}
        {(downloadProgress || downloadProgress === 0) ? (<span>{downloadProgress}%</span>) : null}
      </div>
    );
  }
}
