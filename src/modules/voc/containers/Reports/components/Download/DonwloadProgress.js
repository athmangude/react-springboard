import React from 'react';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';

const DownloadProgress = ({ downloadProgress, downloadStatus }) => {
  if (downloadProgress === null) {
    return null;
  }

  const message = downloadStatus === 'PROCESSED' ? 'Downloading report...' : `Processing report: ${downloadProgress}%`;

  return (
    <div style={{ padding: '3px 5px', backgroundColor: '#58595b', color: '#ffffff', position: 'absolute', right: 0, top: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner spinnerColor="#ffffff" size={15} spinnerWidth={1} />
      <span style={{ marginLeft: 5 }}>{message}</span>
    </div>
  );
};

DownloadProgress.propTypes = {
  downloadProgress: PropTypes.number,
  downloadStatus: PropTypes.string,
};

export default DownloadProgress;
