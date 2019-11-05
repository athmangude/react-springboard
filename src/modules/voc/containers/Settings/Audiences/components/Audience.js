/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class Audience extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    audience: PropTypes.object,
    onView: PropTypes.func,
    onAddMembers: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onShare: PropTypes.func,
    onUnshare: PropTypes.func,
    selectedTab: PropTypes.string,
    loggedInUserRole: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    isMouseOver: false,
  }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onView(audience) {
    const { onView } = this.props;
    onView(audience);
  }

  onAddMembers(audience) {
    const { onAddMembers } = this.props;
    onAddMembers(audience);
  }

  onEdit(audience) {
    const { onEdit } = this.props;
    onEdit(audience);
  }

  onShare(audience) {
    const { onShare } = this.props;
    onShare(audience);
  }

  onUnshare(audience) {
    const { onUnshare } = this.props;
    onUnshare(audience);
  }

  onDelete(audience) {
    const { onDelete } = this.props;
    onDelete(audience);
  }

  render() {
    const { audience, selectedTab, loggedInUserRole } = this.props;
    const { isMouseOver } = this.state;
    const colorMix = stringToHexColor(audience.panelName);
    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: this.state.isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(audience.panelName)}</div>
          <span>{audience.panelName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <i className="material-icons" style={{ fontSize: 20, marginRight: 10, color: '#808285' }}>people_outline</i>
          <span>{audience.numParticipants > 999 ? numeral(audience.numParticipants).format('0.0 a') : numeral(audience.numParticipants).format('0 a')}</span>
        </div>
        {
          isMouseOver ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onView(audience)} icon="visibility" style={{ margin: 0, padding: 6 }} />
              {
                selectedTab === 'Owned' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => this.onAddMembers(audience)} icon="group_add" style={{ margin: 0, padding: 6 }} />
                    <IconButton onClick={() => this.onShare(audience)} icon="share" style={{ margin: 0, padding: 6 }} />
                    <IconButton onClick={() => this.onEdit(audience)} icon="edit" style={{ margin: 0, padding: 6 }} />
                    {
                      !loggedInUserRole || loggedInUserRole.name !== 'ADMIN'
                        ? null : (
                          <IconButton onClick={() => this.onDelete(audience)} icon="delete" style={{ margin: 0, padding: 6 }} />
                        )
                    }
                  </div>
                ) : null
              }
              {
                selectedTab === 'Shared' ? (
                  <IconButton onClick={() => this.onUnshare(audience)} icon="close" style={{ margin: 0, padding: 6 }} />
                ) : null
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}
