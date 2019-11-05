/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class Payment extends Component {
  static propTypes = {
    payment: PropTypes.object,
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

  onView(payment) {
    const { onView } = this.props;
    onView(payment);
  }

  render() {
    const { isMouseOver } = this.state;
    const { payment } = this.props;
    const colorMix = stringToHexColor(`${payment.firstName} ${payment.lastName}`);
    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${payment.firstName} ${payment.lastName}`)}</div>
          <span>{`${payment.firstName} ${payment.lastName}`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
          <span>{`${payment.currencyCode} ${numeral(payment.amount).format('0,0.00')}`}</span>
        </div>
        {
          isMouseOver ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onView(payment)} icon="visibility" style={{ margin: 0, padding: 6 }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
