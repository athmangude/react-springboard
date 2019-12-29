/* eslint-disable jsx-a11y/no-autofocus, no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

import IconButton from 'SharedComponents/icon-button';

function validateTag(tag, tags) {
  return !tags.includes(tag);
}

export default class NewThemeTag extends Component {
  static propTypes = {
    newTag: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    isSubmittingTag: PropTypes.bool.isRequired,
    onSubmitTag: PropTypes.func.isRequired,
    onNewTagChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    isFocused: false,
    value: '',
    isTagValid: false,
  }

  onMouseEnter() {
    this.setState({ isFocused: true });
  }

  onMouseLeave() {
    this.setState({ isFocused: false });
  }

  render() {
    return (
      <div onFocus={this.onMouseEnter} onBlur={this.onMouseLeave} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content', border: 'dashed 2px #d9d9d9', borderRadius: 12, height: 24, margin: !this.state.isFocused ? 5 : '5px 10px 5px 10px', padding: '0 3px 0 10px', transform: !this.state.isFocused ? 'scale(1)' : 'scale(1.1)', transition: 'width 0.5s' }}>
        <input type="text" value={this.props.newTag} disabled={this.props.isSubmittingTag} onChange={this.props.onNewTagChanged} placeholder="new tag" autoFocus style={{ height: '100%', width: 100, outline: 'none' }} />
        {
          this.props.isSubmittingTag ? (
            <div>
              <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
            </div>
          ) : this.props.newTag.length ? (
            <IconButton icon="add" onClick={this.props.onSubmitTag} disabled={!this.props.newTag.length || !validateTag(this.props.newTag, this.props.tags) || this.props.isSubmittingTag} style={{ height: 20, width: 20, margin: '0 0 0 2px', padding: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
          ) : null
        }
      </div>
    );
  }
}
