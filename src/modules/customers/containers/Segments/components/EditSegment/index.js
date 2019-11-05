/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ViewSegment extends Component {
  static propTypes = {
    segment: PropTypes.object,
    filters: PropTypes.string,
    onCloseSidePanel: PropTypes.func,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { segment } = this.props;
    this.handleChange = this.handleChange.bind(this);
    this.updateSegment = this.updateSegment.bind(this);
    this.toggleSegmentStatus = this.toggleSegmentStatus.bind(this);

    this.state = {
      isTogglingStatus: false,
      segmentName: segment.name,
      isSavingSegment: false,
      status: segment.status,
    };
  }

  handleChange(e) {
    this.setState({ segmentName: e.target.value });
  }

  async updateSegment() {
    const { customerAnalyticsActions, EventHandler, segment, alertActions, onCloseSidePanel, filters, reloadSegment } = this.props;

    this.setState({ isSavingSegment: true });
    const { segmentName } = this.state;
    const appliedFilters = {
      analyticsMetadataView: JSON.parse(filters),
      segmentName,
    };

    try {
      await customerAnalyticsActions.updateSegment(segment.id, appliedFilters);
      reloadSegment(segment.id);
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: 'Segment updated!' });
    } catch (exception) {
      let errorMessage = 'Oops! Something went wrong and we could not update the segment. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      alertActions.addAlert({ type: 'error', message: errorMessage });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isSavingSegment: false });
    }
  }

  async toggleSegmentStatus() {
    const { customerAnalyticsActions, EventHandler, segment, alertActions, onCloseSidePanel, reloadSegment } = this.props;
    const { status } = this.state;

    let newStatus = '';

    if (status.toLowerCase() === 'active') {
      newStatus = 'INACTIVE';
    } else {
      newStatus = 'ACTIVE';
    }

    this.setState({ isTogglingStatus: true });

    try {
      await customerAnalyticsActions.toggleSegmentStatus(segment.id, newStatus);
      this.setState({ status: newStatus });
      reloadSegment(segment.id);
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: 'Segment updated!' });
    } catch (exception) {
      let errorMessage = 'Oops! Something went wrong and we could not deactivate the segment. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      alertActions.addAlert({ type: 'error', message: errorMessage });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isTogglingStatus: false });
    }
  }

  render() {
    const { segment, onCloseSidePanel } = this.props;
    const colorMix = stringToHexColor(`${segment.name}`);
    const { isTogglingStatus, segmentName, isSavingSegment } = this.state;

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#F4F4F5', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Edit Segment</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div>
            <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', margin: '0 5px' }}>
                <p>Segment name</p>
                <input type="text" name="segmentName" placeholder="Segment Name" value={segmentName} onChange={this.handleChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
              <ActionButton className="primary" type="submit" large icon="edit" text="Update Segment" disabled={isSavingSegment} loading={isSavingSegment} onClick={this.updateSegment} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 10px 0 10px', position: 'absolute', bottom: 80, width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large text={segment.status.toLowerCase() === 'active' ? 'DEACTIVATE' : 'ACTIVATE'} disabled={isTogglingStatus} loading={isTogglingStatus} onClick={this.toggleSegmentStatus} style={{ backgroundColor: '#bf2a2c', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
