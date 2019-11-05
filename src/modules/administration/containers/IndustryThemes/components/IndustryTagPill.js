import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';

export default class IndustryTagPill extends Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 'fit-content', padding: '10px 5px 10px 20px', margin: 10, height: 50, borderRadius: 25, boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.4)' }}>
        <span style={{ fontSize: 24 }}>
          {this.props.tag}
        </span>
        <IconButton icon="close" style={{ margin: '0 5px 0 10px', backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgba(0, 0, 0, 0.9)' }} />
      </div>
    );
  }
}
