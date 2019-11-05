/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SegmentActions from './Actions';
import SegmentDescription from './Description';

export default class Segments extends Component {
  static propTypes = {
    activeSegment: PropTypes.number,
    showActions: PropTypes.bool,
    showDescription: PropTypes.bool,
  };

  state = {};

  render() {
    const { activeSegment, showActions, showDescription } = this.props;
    if (!activeSegment.id) {
      return null;
    }
    return (
      <div style={{ width: '100%' }}>
        {
          showActions ? (
            <SegmentActions />
          ) : null
        }
        {
          showDescription ? (
            <SegmentDescription activeSegment={activeSegment} />
          ) : null
        }
      </div>
    );
  }
}
