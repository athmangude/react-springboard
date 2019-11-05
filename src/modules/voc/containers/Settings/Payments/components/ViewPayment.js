/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ViewTouchPoint extends Component {
  static propTypes = {
    payment: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    subscriptions: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    mouseOver: null,
  }

  onMouseEnter(row) {
    this.setState({ mouseOver: row });
  }

  onMouseLeave() {
    this.setState({ mouseOver: null });
  }

  render() {
    const { mouseOver } = this.state;
    const { payment, onCloseSidePanel, subscriptions } = this.props;
    const colorMix = stringToHexColor(`${payment.firstName} ${payment.lastName}`);
    const subscription = subscriptions.find((sub) => sub.id === payment.subscriptionId);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Payment Details</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${payment.firstName} ${payment.lastName}`)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{`${payment.currencyCode} ${numeral(payment.amount).format('0,0.00')}`}</span>
            </div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('merchantName')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'merchantName' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Merchant Name</div>
            <div>{`${payment.firstName} ${payment.lastName}`}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('modeOfPayment')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'modeOfPayment' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Mode of Payment</div>
            <div>{payment.mode}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('paymentType')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'paymentType' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Subscription</div>
            <div>{subscription ? subscription.name : null}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('currencyCode')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'currencyCode' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Currency</div>
            <div>{payment.currencyCode}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('createDate')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'createDate' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Create Date</div>
            <div>{moment.utc(payment.createDate).local().fromNow()}</div>
          </div>
        </div>
      </div>
    );
  }
}
