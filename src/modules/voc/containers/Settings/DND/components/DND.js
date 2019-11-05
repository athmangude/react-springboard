/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class DND extends Component {
  static propTypes = {
    dnd: PropTypes.object,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
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

  onDelete(dnd) {
    const { onDelete } = this.props;
    onDelete(dnd);
  }

  onEdit(dnd) {
    const { onEdit } = this.props;
    onEdit(dnd);
  }

  render() {
    const { isMouseOver } = this.state;
    const { dnd } = this.props;
    const colorMix = stringToHexColor(dnd.participant.commId);
    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(dnd.participant.commId.substr(-2).split('').join(' '))}</div>
          <span>{dnd.participant.commId}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          <span>{dnd.comment}</span>
        </div>
        {
          isMouseOver ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onEdit(dnd)} icon="edit" style={{ margin: 0, padding: 6 }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
