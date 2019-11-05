/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

class CustomerSegments extends Component {
  static propTypes = {
    segment: PropTypes.object,
    viewSegment: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onViewSegment = this.onViewSegment.bind(this);
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

  onViewSegment(segment) {
    const { viewSegment } = this.props;

    viewSegment(segment);
  }

  render() {
    const { segment, loading } = this.props;
    const { isMouseOver } = this.state;
    const colorMix = !loading ? stringToHexColor(segment.name) : null;

    return (
      loading ? (
        <div style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RoundShape color="#d9d9d9" style={{ height: 40, width: 40 }} /></div>} />
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                </div>
              )}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                </div>
              )}
            />
          </div>
        </div>
      ) : (
        <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }} onClick={() => this.onViewSegment(segment)}>
            <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${segment.name}`)}</div>
            <span>{segment.name}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <i className="material-icons" style={{ fontSize: 20, marginRight: 10, color: '#808285' }}>people_outline</i>
            <span>{numeral(segment.count).format('0.0 a').replace(' ', '')}</span>
          </div>
        </div>
      )
    );
  }
}

export default CustomerSegments;
