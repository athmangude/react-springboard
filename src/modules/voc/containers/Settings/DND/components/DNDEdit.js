/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class DNDEdit extends Component {
  static propTypes = {
    dnd: PropTypes.object,
    alertActions: PropTypes.object,
    dndActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { dnd } = this.props;

    this.state = {
      comment: dnd.comment,
      isUpdating: false,
      isRemoving: false,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onChange = this.onChange.bind(this);    
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });    
  }

  async onUpdate() {
    const { comment } = this.state;
    const { dnd, dndActions, alertActions, onCloseSidePanel } = this.props;

    const payload = {
      blacklist: true,
      commId: dnd.participant.commId,
      comment,
      surveyId: dnd.surveyId,
    };

    try {
      this.setState({ isUpdating: true });
      await dndActions.editDNDList(payload);
      alertActions.addAlert({ type: 'success', message: 'DND comment added succesfully' });
      const fetchDNDListsResult = await dndActions.fetchDNDLists();
      dndActions.setDNDLists(fetchDNDListsResult.data.data.Response, fetchDNDListsResult.data.data.Response.length, 1);
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdating: false });      
    }  
  }

  async onRemove() {
    this.setState({ isRemoving: true });
    const { dnd, dndActions, alertActions, onCloseSidePanel } = this.props;

    const commId = dnd.participant.commId.replace(/\+/g, "%2B");

    try {
      await dndActions.deleteDNDList(commId);
      const fetchDNDListsResult = await dndActions.fetchDNDLists(true);
      dndActions.setDNDLists(fetchDNDListsResult.data.data.Response, fetchDNDListsResult.data.data.Response.length, 1);
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: 'DND removed succesfully' });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isRemoving: false });
    }
    
  }

  render() {
    const { dnd, onCloseSidePanel } = this.props;
    const { isUpdating, isRemoving, comment } = this.state;
    const colorMix = stringToHexColor(dnd.participant.commId);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Edit DND</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(dnd.participant.commId.substr(-2).split('').join(' '))}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{dnd.participant.commId}</span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <input type="text" name="comment" placeholder="Reason for black-listing" value={comment} onChange={this.onChange} style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid rgba(191, 42, 43, 100)', padding: '10px 5px', width: '100%' }} />
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
