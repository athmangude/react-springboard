/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-return-assign, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Label, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'formsy-semantic-ui-react';
import Formsy from 'formsy-react';
import moment from 'moment';
import CreditCardType from 'credit-card-type';

import mpesa from 'Images/mpesa.png';
import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import * as paymentsActions from '../flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import countries from 'Utils/countries.json';

const currentDate = moment();

function validateField(name, value, rules) {
  const errors = [];

  if (value === null) {
    return errors;
  }

  rules.forEach((rule) => {
    switch (rule) {
      case 'required':
        if (!value.toString().length) {
          errors.push('required');
        }
        break;
      default:
        // do nothing
    }
  });

  return errors;
}

const ErrorComponent = ({ name, value, rules }) => {
  const validationErrors = validateField(name, value, rules);
  if (validationErrors.length) {
    return (
      <div>
        <span>{validationErrors[0]}</span>
      </div>
    );
  }

  return null;
};

ErrorComponent.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  rules: PropTypes.array,
};

@connect((state) => ({
  user: state.authentication.user,
}),
(dispatch) => ({
  paymentsActions: bindActionCreators(paymentsActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
export default class NewPayment extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object,
    paymentsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    user: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onDropdownChanged = this.onDropdownChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onCreatePayment = this.onCreatePayment.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.fetchPaymentSubscriptions = this.fetchPaymentSubscriptions.bind(this);
  }

  state = {
    payment: {
      address: null,
      amount: null,
      cardNumber: null,
      city: null,
      country: null,
      cvc: null,
      expiryMonth: null,
      expiryYear: null,
      firstName: null,
      lastName: null,
      subscriptionId: null,
    },
    formState: {
      address: false,
      amount: false,
      cardNumber: false,
      city: false,
      country: false,
      cvc: false,
      expiryMonth: false,
      expiryYear: false,
      firstName: false,
      lastName: false,
      subscriptionId: false,
    },
    isFormValid: false,
    isCreatingPayment: false,
    isFetchingPaymentSubscriptions: false,
    subscriptions: [],
    cardType: '',
  };

  componentDidMount() {
    this.fetchPaymentSubscriptions();
  }

  onFormValid() {
    this.setState({ isFormValid: true });
  }

  onFormInvalid() {
    this.setState({ isFormValid: false });
  }

  onDropdownChanged(e, { name, value }) {
    const { EventHandler } = this.props;
    const { payment, subscriptions } = this.state;
    let { amount } = payment;
    if (name === 'subscriptionId') {
      const subscription = subscriptions.find((sub) => sub.id === value);
      amount = subscription.price;
    }
    this.setState({ payment: { ...payment, [name]: value, amount } });
    EventHandler.trackEvent({ category: 'Payments', action: 'dropdown changed', value });
  }

  async onCreatePayment() {
    const { paymentsActions, EventHandler, alertActions } = this.props;
    this.setState({ isCreatingPayment: true });
    const { payment } = this.state;
    const { onCloseSidePanel } = this.props;


    try {
      const addPaymentResult = await paymentsActions.createPayment(payment);
      if (addPaymentResult.data.data.Data) {
        this.form.reset();
        alertActions.addAlert({ type: 'success', message: 'Payment has been received for processing' });
        EventHandler.trackEvent({ category: 'Payments', action: 'create payment', value: true });
        onCloseSidePanel();
      } else {
        alertActions.addAlert({ type: 'error', message: 'An error occurred. Please confirm your details' });
      }
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Payments', action: 'create payment', value: false });
    } finally {
      this.setState({ isCreatingPayment: false });
    }
  }

  async fetchPaymentSubscriptions() {
    const { paymentsActions, EventHandler, alertActions } = this.props;
    this.setState({ isFetchingPaymentSubscriptions: true });
    try {
      const fetchPaymentSubscriptionsResult = await paymentsActions.fetchPaymentSubscriptions();
      this.setState({ subscriptions: fetchPaymentSubscriptionsResult.data.data.Data });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingPaymentSubscriptions: false });
    }
  }

  handleChange(e) {
    const { payment } = this.state;
    let { cardType } = this.state;
    if (e.target.name === 'cardNumber') {
      cardType = '';
      const card = CreditCardType(e.target.value);
      if (card.length === 1) {
        cardType = card[0].niceType;
      }
    }
    this.setState({ cardType, payment: { ...payment, [e.target.name]: e.target.value } });
  }

  validateForm() {
    const { payment } = this.state;
    let valid = true;
    const formState = payment;

    Object.keys(formState).forEach((key) => {
      if (!formState[key]) {
        valid = false;
      } else {
        let validationErrors = [];
        validationErrors = validateField(key, formState[key], ['required']);

        if (validationErrors.length) {
          valid = false;
        }
      }
    });
    return valid;
  }

  render() {
    const { user, onCloseSidePanel } = this.props;
    const { payment, subscriptions, isFetchingPaymentSubscriptions, cardType, isCreatingPayment, isFormValid } = this.state;
    const { address, amount, cardNumber, city, country, cvc, expiryMonth, expiryYear, firstName, lastName, subscriptionId } = payment;

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add Payment</h2>
          </div>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <Formsy ref={(form) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onCreatePayment}>
            <div>
              <div style={{ margin: '20px 0', width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100%' }}>
                  <Input
                    name="firstName"
                    value={firstName}
                    onChange={this.handleChange}
                    placeholder="First Name"
                    required
                    validations={{ isExisty: true, isAlpha: true }}
                    validationErrors={{ isAlpha: 'only alphabetic characters are allowed', isExisty: 'This field is required' }}
                    style={{ width: '100%', border: 'none', padding: '0 5px', margin: 0, position: 'relative' }}
                    className="input"
                    errorLabel={(
                      <Label color="red" style={{ borderRadius: 0 }} />
                    )}
                  />
                </div>
              </div>
              <div style={{ margin: '20px 0', width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100%' }}>
                  <Input
                    name="lastName"
                    value={lastName}
                    onChange={this.handleChange}
                    placeholder="Last Name"
                    required
                    validations={{ isExisty: true, isAlpha: true }}
                    validationErrors={{ isAlpha: 'only alphabetic characters are allowed', isExisty: 'This field is required' }}
                    style={{ width: '100%', border: 'none', padding: '0 5px', margin: 0, position: 'relative' }}
                    className="input"
                    errorLabel={(
                      <Label color="red" style={{ borderRadius: 0 }} />
                    )}
                  />
                </div>
              </div>
              <div style={{ margin: '20px 5px 0 5px', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100%' }}>
                  <Dropdown
                    placeholder="Select Country"
                    fluid
                    search
                    selection
                    name="country"
                    value={country}
                    onChange={this.onDropdownChanged}
                    options={countries.map((c) => ({
                      key: c.id,
                      value: c.code,
                      flag: c.code.toLowerCase(),
                      text: c.name,
                    }))}
                  />
                  <ErrorComponent name="country" value={country} rules={['required']} updateFormState={this.updateFormState} />
                </div>
              </div>
              <div style={{ margin: '20px 5px 0 5px', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100%' }}>
                  <Input
                    name="city"
                    value={city}
                    onChange={this.handleChange}
                    placeholder="City"
                    required
                    validations={{ isExisty: true, isAlpha: true }}
                    validationErrors={{ isAlpha: 'only alphabetic characters are allowed', isExisty: 'This field is required' }}
                    style={{ width: '100%', border: 'none', margin: 0, position: 'relative' }}
                    className="input"
                    errorLabel={(
                      <Label color="red" style={{ borderRadius: 0 }} />
                    )}
                  />
                </div>
              </div>
              <div style={{ width: '100%', position: 'relative' }}>
                <Input
                  name="address"
                  value={address}
                  onChange={this.handleChange}
                  placeholder="Address"
                  required
                  validations={{ isExisty: true }}
                  validationErrors={{ isExisty: 'This field is required' }}
                  style={{ width: '100%', border: 'none', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                  className="input"
                  errorLabel={(
                    <Label color="red" style={{ borderRadius: 0 }} />
                  )}
                />
              </div>
              <div style={{ margin: '20px 5px 0 5px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%' }}>
                  <Dropdown
                    placeholder="Select Subscription"
                    fluid
                    search
                    selection
                    name="subscriptionId"
                    value={subscriptionId}
                    loading={isFetchingPaymentSubscriptions}
                    onChange={this.onDropdownChanged}
                    options={subscriptions.map((subscription) => ({
                      key: subscription.id,
                      value: subscription.id,
                      text: `${subscription.name} (${subscription.subscriptionType}) - ${subscription.units} units`,
                    }))}
                  />
                  <ErrorComponent name="subscriptionId" value={subscriptionId} rules={['required']} updateFormState={this.updateFormState} />
                </div>
                <div style={{ width: '100%', margin: '20px 0 0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <Input
                    name="cardNumber"
                    value={cardNumber}
                    onChange={this.handleChange}
                    placeholder="Card Number"
                    required
                    validations={{ isExisty: true, isNumeric: true }}
                    validationErrors={{ isNumeric: 'only numeric characters are allowed', isExisty: 'This field is required' }}
                    style={{ width: '100%', border: 'none', padding: '0 5px', margin: 0, position: 'relative' }}
                    className="input"
                    errorLabel={(
                      <Label color="red" style={{ borderRadius: 0 }} />
                    )}
                  />
                  {
                    cardType.length ? (
                      <div style={{ position: 'absolute', right: 10, top: 10 }}>{cardType}</div>
                    ) : null
                  }
                </div>
                <div style={{ width: '100%', margin: '20px 0 0', display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: '100%' }}>
                    <Input
                      name="cvc"
                      value={cvc}
                      type="password"
                      onChange={this.handleChange}
                      placeholder="CVC"
                      required
                      validations={{ isExisty: true, isNumeric: true, isLength: 3 }}
                      validationErrors={{ isNumeric: 'only numeric characters are allowed', isExisty: 'This field is required', isLength: 'CVC should be of length 3' }}
                      style={{ width: '100%', border: 'none', padding: '0 5px', margin: 0, position: 'relative' }}
                      className="input"
                      errorLabel={(
                        <Label color="red" style={{ borderRadius: 0 }} />
                      )}
                    />
                  </div>
                  <Popup
                    trigger={<img style={{ width: 40, height: 30 }} src="https://static.zuora.com/Resources/6192017/Images/cvv_logo.png" alt="cvv" />}
                    content={<img alt="preview" src="https://static.zuora.com/Resources/6192017/Images/cvv_preview_2.jpg" />}
                    flowing
                    basic
                    hoverable
                    position="bottom right"
                  />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 100 }}>
                  <Dropdown
                    placeholder="MM"
                    fluid
                    search
                    selection
                    name="expiryMonth"
                    value={expiryMonth}
                    onChange={this.onDropdownChanged}
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => ({
                      key: month,
                      value: month,
                      text: month,
                    }))}
                  />
                  <ErrorComponent name="expiryMonth" value={expiryMonth} rules={['required']} updateFormState={this.updateFormState} />
                </div>
                <span>&nbsp; / &nbsp;</span>
                <div style={{ width: 'calc(100% - 100px)' }}>
                  <Dropdown
                    placeholder="YYYY"
                    fluid
                    search
                    selection
                    name="expiryYear"
                    value={expiryYear}
                    onChange={this.onDropdownChanged}
                    options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
                      const year = currentDate.clone().add((item), 'years').year();
                      return ({
                        key: year,
                        value: year,
                        text: year,
                      });
                    })}
                  />
                </div>
              </div>
              <div style={{ width: '100%', position: 'relative' }}>
                <Input
                  name="amount"
                  value={amount}
                  placeholder="amount in dollars"
                  disabled
                  required
                  validations={{ isExisty: true, isNumeric: true }}
                  validationErrors={{ isNumeric: 'only numeric characters are allowed', isExisty: 'This field is required' }}
                  style={{ width: '100%', border: 'none', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                  className="input"
                  errorLabel={(
                    <Label color="red" style={{ borderRadius: 0 }} />
                  )}
                />
                {
                  subscriptionId ? (
                    <div style={{ color: '#6d6e71', fontSize: 11, letterSpacing: 0.7, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <i className="material-icons" style={{ fontSize: 11, marginRight: 5 }}>star</i>
                      &nbsp;
                      <span>
                        All payments are in
                        &nbsp;
                        {subscriptions.find((subscription) => subscription.id === subscriptionId).currencyCode}
                      </span>
                    </div>
                  ) : null
                }
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
              <ActionButton className="primary" type="submit" large icon="attach_money" text="Make Payment" loading={isCreatingPayment} disabled={!isFormValid || isCreatingPayment} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </Formsy>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50 }}>
          <span style={{ borderBottom: '2px solid #d9d9d9', width: '100%' }}></span>
          <span style={{ color: '#6d6e71', fontSize: 16, fontWeight: 'bold', padding: '0 20px 0 20px' }}>OR</span>
          <span style={{ borderBottom: '2px solid #d9d9d9', width: '100%' }}></span>
        </div>
        <div style={{ width: '100%', backgroundColor: '#fff', marginBottom: 100 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <img src={mpesa} alt="Stripe" style={{ height: 40 }} />
          </div>
          <div>
            <ol>
              <li style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>From the MPESA menu on your Safaricom line select the payment services option and choose paybill.</li>
              <li style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>
                Select business number and enter:
                &nbsp;
                <span>886300</span>
              </li>
              <li style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>
                Enter your account number. Your account number is
                &nbsp;
                <span>{user.account.mpesaAccountNumber}</span>
              </li>
              <li style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>Enter your mPesa PIN.</li>
              <li style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>Confirm amount and submit. You will receive a payment confirmation if your transaction is successful and the balance reflected in your account.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}
