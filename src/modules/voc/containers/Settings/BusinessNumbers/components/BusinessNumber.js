/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class Delay extends Component {
  static propTypes = {
    businessNumber: PropTypes.object,
    businessNumberActions: PropTypes.object,
    conversationActions: PropTypes.object,
    surveyId: PropTypes.number,
    onEdit: PropTypes.func,
    onView: PropTypes.func,
  }

  constructor(props) {
    super(props);
    
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      isMouseOver: false,
    };
  }

  componentDidMount() {
  }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onView(businessNumber) {
    const { onView } = this.props;
    onView(businessNumber);
  }

  onEdit(businessNumber) {
    const { onEdit } = this.props;
    onEdit(businessNumber);
  }

  render() {
    const {
      isMouseOver,
    } = this.state;
    const { businessNumber } = this.props;
    const colorMix = stringToHexColor(businessNumber.location);

    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(businessNumber.location)}</div>
          <span>{businessNumber.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <span>{businessNumber.business_identifier}</span>
        </div>
        {
          isMouseOver ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onView(businessNumber)} icon="visibility" style={{ margin: 0, padding: 6 }} />
              <IconButton onClick={() => this.onEdit(businessNumber)} icon="edit" style={{ margin: 0, padding: 6 }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
