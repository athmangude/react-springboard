/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';

import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button-styled';
import Payment from './components/Payment';
import ViewPayment from './components/ViewPayment';
import NewPayment from './NewPayment';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as paymentsActions from './flux/actions';
import * as paymentTypesActions from '../PaymentTypes/flux/actions';

@connect((state) => ({
  payments: state.payments,
}),
(dispatch) => ({
  paymentsActions: bindActionCreators(paymentsActions, dispatch),
  paymentTypesActions: bindActionCreators(paymentTypesActions, dispatch),
  dispatch,
}))
class Payments extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    payments: PropTypes.array.isRequired,
    paymentsActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onAddPayment = this.onAddPayment.bind(this);
    this.onView = this.onView.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.fetchPayments = this.fetchPayments.bind(this);
    this.fetchPaymentSubscriptions = this.fetchPaymentSubscriptions.bind(this);
  }

  state = {
    isFetchingPayments: false,
    sidePanel: null,
    showSidePanel: false,
    subscriptions: [],
  };

  async componentDidMount() {
    await this.fetchPaymentSubscriptions();
    this.fetchPayments();
  }

  async onAddPayment() {
    const { EventHandler, alertActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<NewPayment onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onView(payment) {
    const { EventHandler, alertActions } = this.props;
    const { subscriptions } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<ViewPayment onCloseSidePanel={this.onCloseSidePanel} payment={payment} subscriptions={subscriptions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  async fetchPayments() {
    const { paymentsActions, EventHandler, alertActions } = this.props;
    this.setState({ isFetchingPayments: true });
    try {
      const fetchPaymentsResult = await paymentsActions.fetchPayments();
      paymentsActions.setPayments(fetchPaymentsResult.data.data.Data);
      EventHandler.trackEvent({ category: 'Payments', action: 'fetch payments', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Payments', action: 'fetch payments', value: false });
    } finally {
      this.setState({ isFetchingPayments: false });
    }
  }

  async fetchPaymentSubscriptions() {
    const { paymentsActions, EventHandler } = this.props;
    try {
      const fetchPaymentSubscriptionsResult = await paymentsActions.fetchPaymentSubscriptions();
      this.setState({ subscriptions: fetchPaymentSubscriptionsResult.data.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
    }
  }

  render() {
    const { isFetchingPayments, showSidePanel, sidePanel } = this.state;
    const { payments, alertActions, EventHandler } = this.props;
    return (
      <SettingsNavigationContainer
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
        <CircularButton className="primary cta" style={{ position: 'fixed', top: 115, right: 20, zIndex: 1 }} icon="add" color="#002366" onClick={this.onAddPayment} />
        {
          isFetchingPayments ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Loading payments</span>
            </div>
          ) : !payments.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '100px 0 0' }}>
              <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>You have not made any payments</h2>
              <ActionButton className="primary" large icon="add" text="Add Payment" onClick={this.onAddPayment} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <Container fluid style={{ margin: 0, padding: 0 }}>
                <Row style={{ margin: 0, padding: 0 }}>
                  {
                    payments.map((payment) => (
                      <Payment key={payment.id} payment={payment} onView={this.onView} EventHandler={EventHandler} alertActions={alertActions} />
                    ))
                  }
                </Row>
              </Container>
            </div>
          )
        }
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(Payments);
