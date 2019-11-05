/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import Spinner from 'react-spinner-material';

export default class DownloadSegmentMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDownloading: false,
    };

    this.onDownload = this.onDownload.bind(this);
  }

  onDownload() {
    this.setState({ isDownloading: true });
    setTimeout(() => this.setState({ isDownloading: false }), 4000);
  }

  render() {
    const { isDownloading } = this.state;
    return (
      <button type="button" onClick={this.onDownload} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: '0 10px 0 10px', color: 'rgb(109, 110, 113)', fontSize: 11, height: 35, borderRadius: 2, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07)', backgroundColor: '#ffffff', border: 'solid 1px #e2e4eb', marginLeft: 10, cursor: 'pointer' }}>
        {
          isDownloading ? (
            <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
          ) : (
            <i className="material-icons" style={{ fontSize: 20 }}>cloud_download</i>
          )
        }
        <span style={{ marginLeft: 10 }}>Download CSV</span>
      </button>
    );
  }
}
