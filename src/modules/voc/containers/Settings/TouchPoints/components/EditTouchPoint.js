/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class EditTouchPoint extends Component {
  static propTypes = {
    touchpoint: PropTypes.object,
    alertActions: PropTypes.object,
    touchpointActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { touchpoint } = this.props;

    this.state = {
      isUpdating: false,
      isRemoving: false,
      payload: {
        quota: touchpoint.quota,
        dailyStartTime: touchpoint.dailyStartTime,
        dailyEndTime: touchpoint.dailyEndTime,
        surveyId: touchpoint.surveyId,
        touchpointId: touchpoint.id,
      },
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { payload } = this.state;
    this.setState({ payload: { ...payload, [e.target.name]: e.target.value } });  
  };

  async onUpdate() {
    this.setState({ isUpdating: true });
    const { payload } = this.state;
    const { touchpointActions, alertActions, onCloseSidePanel } = this.props;

    try {
      await touchpointActions.editTouchPoints(payload);
      alertActions.addAlert({ type: 'success', message: 'Successfully updated touchpoint' });
      const fetchTouchPointsResult = await touchpointActions.fetchTouchPoints(payload.surveyId);
      touchpointActions.setTouchPoints(fetchTouchPointsResult.data.data.Data.items, fetchTouchPointsResult.data.data.Data.totalCount, 1);
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdating: false });      
    }  
  }

  async onRemove() {
    this.setState({ isRemoving: true });
    const { payload } = this.state;
    const { touchpointActions, alertActions, onCloseSidePanel } = this.props;

    try {
      await touchpointActions.deleteTouchPoint(payload);
      alertActions.addAlert({ type: 'success', message: 'Successfully removed touchpoint' });
      const fetchTouchPointsResult = await touchpointActions.fetchTouchPoints(payload.surveyId);
      touchpointActions.setTouchPoints(fetchTouchPointsResult.data.data.Data.items, fetchTouchPointsResult.data.data.Data.totalCount, 1);
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isRemoving: false });
    } 
  }

  render() {
    const { touchpoint, onCloseSidePanel } = this.props;
    const { isUpdating, isRemoving, payload } = this.state;
    const colorMix = stringToHexColor(touchpoint.value);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Edit Touchpoint</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(touchpoint.value)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{touchpoint.value}</span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Quota</p>
              <input type="number" name="quota" placeholder="Quota" value={payload.quota} onChange={this.onChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Start Time</p>
              <input type="text" name="dailyStartTime" placeholder="Daily Start Time" value={payload.dailyStartTime} onChange={this.onChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>End Time</p>
              <input type="text" name="dailyEndTime" placeholder="Daily End Time" value={payload.dailyEndTime} onChange={this.onChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large icon="edit" text="Update" disabled={isUpdating} loading={isUpdating} onClick={this.onUpdate} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>

        <div style={{ padding: '0 10px 0 10px', position: 'absolute', bottom: 80, width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large text="Remove" disabled={isRemoving} loading={isRemoving} onClick={this.onRemove} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
