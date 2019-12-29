import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

import IconButton from 'SharedComponents/icon-button';

export default class ThemeTag extends Component {
  static propTypes = {
    alertActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    tag: PropTypes.string.isRequired,
    commentId: PropTypes.number.isRequired,
    onRemoveCommentTag: PropTypes.func.isRequired,
    isRemovingCommentTag: false,
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onRemoveCommentTag = this.onRemoveCommentTag.bind(this);
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

  async onRemoveCommentTag() {
    console.log('[this.props]', this.props);
    this.setState({ isRemovingCommentTag: true });

    try {
      const removeCommentTagResult = await this.props.removeCommentTag(this.props.tag, this.props.commentId);
      console.log('removeCommentTagResult', removeCommentTagResult);

      this.props.onRemoveCommentTag(this.props.tag);
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.handleException(exception);
      console.log(exception);
    } finally {
      this.setState({ isRemovingCommentTag: false });
    }
  }

  render() {
    return (
      <div onFocus={this.onMouseEnter} onBlur={this.onMouseLeave} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content', boxShadow: '0 0 0 2px #d9d9d9', borderRadius: 12, height: 24, margin: 5, padding: '0 3px 0 10px', transition: 'width 0.5s' }}>
        <span style={{ fontSize: 12, color: '#808285', margin: '0 10px 0 0', letterSpacing: '-0.3px' }}>{this.props.tag}</span>
        {
          this.state.isRemovingCommentTag ? (
            <div>
              <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
            </div>
          ) : this.state.isMouseOver ? (
            <IconButton onClick={this.onRemoveCommentTag} icon="close" style={{ height: 20, width: 20, margin: 0, padding: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
          ) : null
        }
      </div>
    );
  }
}
