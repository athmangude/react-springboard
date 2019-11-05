/* eslint-disable jsx-a11y/href-no-hash, no-return-assign, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class RemoveAudience extends Component {
  static propTypes = {
    alertActions: PropTypes.object,
    audiencesActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
    audience: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      isDeletingAudience: false,
      serverErrorMessage: '',
      confirmation: '',
    };

    this.onRemove = this.onRemove.bind(this);
    this.onConfirmationChange = this.onConfirmationChange.bind(this);
  }

  async onRemove() {
    const { audience, audiencesActions, alertActions, EventHandler, onCloseSidePanel } = this.props;
    const { confirmation } = this.state;
    if (confirmation !== 'DELETE') {
      alertActions.addAlert({ type: 'error', message: 'Type confirmation text to confirm your action' });
      return;
    }
    this.setState({ isDeletingAudience: true });
    try {
      await audiencesActions.deleteAudience(audience.panelId);
      audiencesActions.removeAudience(audience);
      alertActions.addAlert({ type: 'success', message: 'Successfully removed audience' });
      EventHandler.trackEvent({ category: 'Audiences', action: 'removed audience', value: true });
      onCloseSidePanel();
    } catch (exception) {
      EventHandler.trackEvent({ category: 'Audiences', action: 'removed audience', value: false });
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isDeletingAudience: false });
    }
  }

  onConfirmationChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { audience, onCloseSidePanel } = this.props;
    const { isDeletingAudience, confirmation, serverErrorMessage } = this.state;
    const colorMix = stringToHexColor(audience.panelName);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Delete Audience</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(audience.panelName)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{audience.panelName}</span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ margin: '0 10px' }}>Number of Participants</div>
            <div>{audience.numParticipants > 999 ? numeral(audience.numParticipants).format('0.0 a') : numeral(audience.numParticipants).format('0 a')}</div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ margin: '0 10px' }}>Uploaded</div>
            <div>{moment.utc(audience.createDate, 'YYYYMMDDHHmm').local().fromNow()}</div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <div style={{ width: '100%', margin: '0 10px' }}>
              <p>Type DELETE to confirm</p>
              <input type="text" name="confirmation" onChange={this.onConfirmationChange} placeholder="" value={confirmation} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px' }} />
            </div>
            {
              serverErrorMessage.length ? (
                <div className="form-errors-indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fd9681', color: '#FFF', margin: '10px -21px -21px', padding: 5, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                  <i className="material-icons">error_outline</i>
                  &nbsp;&nbsp;
                  <span>{serverErrorMessage}</span>
                </div>
              ) : null
            }
            <ActionButton className="primary" type="submit" large icon="delete" text="Delete" disabled={isDeletingAudience || confirmation !== 'DELETE'} loading={isDeletingAudience} onClick={this.onRemove} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
