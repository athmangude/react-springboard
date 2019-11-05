/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class Survey extends Component {
  static propTypes = {
    conversation: PropTypes.object,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onView: PropTypes.func,
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

  onAdd(conversation) {
    const { onAdd } = this.props;
    onAdd(conversation);
  }

  onView(conversation) {
    const { onView } = this.props;
    onView(conversation);
  }

  onEdit(conversation) {
    const { onEdit } = this.props;
    onEdit(conversation);
  }

  render() {
    const { isMouseOver } = this.state;
    const { conversation } = this.props;
    const colorMix = stringToHexColor(conversation.title);
    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(conversation.title)}</div>
          <span>{conversation.title}</span>
        </div>
        {
          conversation.reminderSettings ? (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
              <i className="material-icons" style={{ marginRight: 10, fontSize: 20 }}>notifications</i>
              {/* <span>{conversation.reminderSettings.time.join('hrs ')}</span> */}
            </div>
          ) : null
        }
        {
          isMouseOver ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              {
                conversation.reminderSettings ? (
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <IconButton onClick={() => this.onView(conversation)} icon="visibility" style={{ margin: 0, padding: 6 }} />
                    <IconButton onClick={() => this.onEdit(conversation)} icon="edit" style={{ margin: 0, padding: 6 }} />
                  </div>
                ) : (
                  <IconButton onClick={() => this.onAdd(conversation)} icon="add" style={{ margin: 0, padding: 6 }} />
                )
              }
            </div>
          ) : null
        }
      </div>
    );
  };
};
