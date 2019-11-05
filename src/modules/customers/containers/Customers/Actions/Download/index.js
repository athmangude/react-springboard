/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FileDownload from 'js-file-download';
import moment from 'moment';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';

@connect((state) => ({
  account: state.account,
}), () => ({}))

class Download extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object,
    audiencesActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
    downloadableColumns: PropTypes.array,
    appliedFilters: PropTypes.array,
    user: PropTypes.user,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }

  constructor(props) {
    super(props);

    const { downloadableColumns } = props;

    this.state = {
      submitting: false,
      downloadableColumns,
    };

    this.downloadCustomers = this.downloadCustomers.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(option, event) {
    const { downloadableColumns } = this.state;

    const columnIndex = downloadableColumns.findIndex((item) => item.name === option.name);

    if (columnIndex !== -1) {
      downloadableColumns[columnIndex] = { ...downloadableColumns[columnIndex], show: event.target.checked };

      this.setState({ downloadableColumns });
    }
  }

  async downloadCustomers() {
    const { customerAnalyticsActions, EventHandler, appliedFilters, user, startTime, endTime, segmentId } = this.props;
    const { downloadableColumns } = this.state;

    const fileName = `${user.account.profilename} ${moment().format('YYYY-MM-DD HH:mm')}`;

    const requiredRows = [];

    downloadableColumns.forEach((column) => {
      if(column.show) {
        requiredRows.push(column.sortField);
      }
    });

    this.setState({ isDownloading: true });

    const data = {
      'metadataViewList': JSON.parse(appliedFilters) !== null ? JSON.parse(appliedFilters) : [],
      requiredRows,
    }

    try {
      const downloadCustomersResult = await customerAnalyticsActions.downloadCustomers(data, { startTime, endTime }, (segmentId !== undefined) ? segmentId : null);
      FileDownload(downloadCustomersResult.data, `${fileName.replace(/ /g,"_")} ${'.csv'}`);
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isDownloading: false });
    }
  }

  render() {
    const { isDownloading, downloadableColumns } = this.state;
    const { onCloseSidePanel } = this.props;

    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', zIndex: 10, height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Download Customers</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
                Select columns to download
              </span>
            </div>
          </div>

          {
            downloadableColumns.map((option) => (
              <div style={{ margin: '1px 5px' }}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      disableTouchRipple
                      checked={option.show}
                      onChange={(e) => this.onChange(option, e)}
                      value={option.name}
                      style={{ color: '#888888', textTransform: 'capitalize' }}
                    />
                  )}
                  label={option.name}
                />
              </div>
            ))
          }
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0', marginBottom: 10 }}>
            <ActionButton className="primary" type="submit" large icon="file_download" text="Download" loading={isDownloading} onClick={this.downloadCustomers} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}

export default Download;
