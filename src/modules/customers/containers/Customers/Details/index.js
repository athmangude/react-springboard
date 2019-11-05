import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import styled from 'styled-components';
import moment from 'moment';

import Info from './Info';
import Activity from './activity';

import SendSMS from '../../Segments/Actions/SendSMS';
import SendEmail from '../../Segments/Actions/SendEmail';
import CustomerSummary from './Summary';
import CustomerBasicInformation from './BasicInformation';
import CustomerAttributes from './Attributes';
import SpendTrend from './SpendTrend';
import IconButton from 'SharedComponents/icon-button';
import Avatar from 'Utils/avatar';
import Tabs from 'SharedComponents/tabs';
import * as customerAnalyticsActions from '../../flux/actions';

import customerProfileStyles from './styles';
import VisitsGraph from '../../Behaviour/Visits/engagements-graph';

const sampleData = [
  { period: 'Jan 2017', engagements: 0 },
  { period: 'Feb', engagements: 0 },
  { period: 'Mar', engagements: 1 },
  { period: 'Apr', engagements: 0 },
  { period: 'May', engagements: 2 },
  { period: 'Jun', engagements: 1 },
  { period: 'July', engagements: 3 },
  { period: 'Aug', engagements: 2 },
  { period: 'Sep', engagements: 1 },
  { period: 'Oct', engagements: 0 },
  { period: 'Nov', engagements: 0 },
  { period: 'Dec', engagements: 1 },
  { period: 'Jan 2018', engagements: 0 },
  { period: 'Feb', engagements: 0 },
  { period: 'Mar', engagements: 1 },
  { period: 'Apr', engagements: 0 },
  { period: 'May', engagements: 0 },
  { period: 'Jun', engagements: 0 },
  { period: 'July', engagements: 0 },
  { period: 'Aug', engagements: 0 },
  { period: 'Sep', engagements: 0 },
  { period: 'Oct', engagements: 5 },
  { period: 'Nov', engagements: 7 },
  { period: 'Dec', engagements: 4 },
];

const CustomerProfileWrapper = styled.div`${customerProfileStyles}`;

const customerSchema = {
  summary: {
    'Average Transaction Spend': ['averageTransactionSpend'],
    'Last Visited': ['lastTransactionLocation'],
    'Last Spent': ['lastTransactionSpent'],
    'Last Seen': ['lastTransactionTimestamp'],
  },
  details: {
    'Contacts': ['commId'],
    'Location': ['county', 'region', 'country'],
    'Gender': ['sex'],
    'Age': ['age'],
    'Profession': ['employmentType'],
    'LSM': ['lsm'],
    'Tags': ['npsTags'],
  },
  attributes: {
    'NPS Score': ['npsScore'],
    'Surveys Received': ['surveysReceived'],
    'Surveys Completed': ['surveysCompleted'],
    'Surveys Response Rate': ['surveyResponseRate'],
    'Surveys Completion Rate': ['surveyCompletionRate'],
  },
};

@connect(() => ({}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  dispatch,
}))

export default class Details extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    onViewAllCustomers: PropTypes.func,
    customerAnalyticsActions: PropTypes.object,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.onActiveTabChanged = this.onActiveTabChanged.bind(this);
  }

  state = {
    isLoadingCustomerDetails: false,
    customer: {},
    activeTab: 'History',
  };

  componentDidMount() {
    this.fetchCustomerDetails();
  }

  onActiveTabChanged(activeTab) {
    this.setState({ activeTab });
  }

  async fetchCustomerDetails() {
    this.setState({ isLoadingCustomerDetails: true });
    const { match } = this.context.router.route;

    try {
      const fetchCustomerDetailsResult = await this.props.customerAnalyticsActions.fetchCustomerDetails(match.params.id);
      this.setState({ customer: fetchCustomerDetailsResult.data.Data });
    } catch (exception) {
      // TODO: Let's log handle the exception apprpriately instead of just loggin it
      console.log(exception);
    } finally {
      this.setState({ isLoadingCustomerDetails: false });
    }
  }

  render() {
    const { isLoadingCustomerDetails, customer } = this.state;

    if (isLoadingCustomerDetails) {
      return (
        <div style={{ width: '100%', minHeight: 'calc(100vh - 60px)', marginTop: 50 }}>
          <div style={{ width: '100%', backgroundColor: '#ffffff', boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 65, backgroundColor: '#f5f8fb', padding: 20 }}>
              <div style={{ height: 32, fontSize: 16, fontWeight: 900, lineHeight: 2, color: '#6d6e71' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 32, marginRight: 5 }} /></div>} />
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 32 }} /></div>} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 32, marginRight: 10 }} /></div>} />
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 32 }} /></div>} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#d9d9d9' }}>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RoundShape color="#d9d9d9" style={{ width: 35, height: 35, marginRight: 10 }} /></div>} />
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RoundShape color="#d9d9d9" style={{ width: 35, height: 35, marginRight: 10 }} /></div>} />
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RoundShape color="#d9d9d9" style={{ width: 35, height: 35 }} /></div>} />
              </div>
            </div>
            <div style={{ backgroundColor: '#ffffff', width: '100%', padding: 20 }}>
              <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 60 }} /></div>} />
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ width: '100%', height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 30 }} /></div>} />
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 30, marginRight: 0 }} /></div>} />
                </div>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 1 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 60 }} /></div>} />
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 60 }} /></div>} />
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ width: '100%', height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 30 }} /></div>} />
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 30, marginRight: 0 }} /></div>} />
                </div>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 1 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 60 }} /></div>} />
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 60 }} /></div>} />
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 30 }} /></div>} />
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 30, marginRight: 0 }} /></div>} />
                </div>
                <div style={{ width: '100%', height: 340, borderRadius: 5, border: 'solid 1px #e2e4eb', padding: 20 }}>
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 300 }} /></div>} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <CustomerProfileWrapper>
        <div className="profile-summary">
          <Avatar name={`${customer.firstName} ${customer.lastName}`} />
          <div className="summary-data">
            <b className="name">{`${customer.firstName} ${customer.lastName}`}</b>
            <span><span>Last Seen:&nbsp;</span><i>{moment('2018-12-09 13:10:09').fromNow() !== 'Invalid date' ? moment('2018-12-09 13:10:09').fromNow() : 'Unknown'}</i></span>
          </div>
        </div>
        <div style={{ margin: '20px 0' }}>
          <VisitsGraph data={sampleData} />
        </div>
        <div className="profile-data-container">
          <Tabs
            active={this.state.activeTab}
            onChange={this.onActiveTabChanged}
            tabs={[
              {
                label: 'History',
                component: (
                  <Activity />
                )
              },
              {
                label: 'Info',
                component: (
                  <Info customer={customer} summarySchema={customerSchema.summary} detailsSchema={customerSchema.details} attributesSchema={customerSchema.attributes} />
                )
              }
            ]}
          />
        </div>
      </CustomerProfileWrapper>
    )

    return (
      <div style={{ width: '100%', minHeight: 'calc(100vh - 60px)', marginTop: 50 }}>
        <div style={{ width: '100%', backgroundColor: '#ffffff', boxShadow: '0 8px 20px 0 rgba(67, 70, 86, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 65, backgroundColor: '#f5f8fb', padding: 20 }}>
            <div style={{ height: 32, fontSize: 16, fontWeight: 900, lineHeight: 2, color: '#6d6e71' }}>
              {`${customer.firstName} ${customer.lastName}`}
            </div>
            <div style={{ display: 'flex', flexDirection: this.props.width > 425 ? 'row' : 'column', alignItems: 'center', justifyContent: 'center' }}>
              <SendSMS />
              <SendEmail />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#d9d9d9' }}>
              <IconButton icon="arrow_back" />
              <IconButton icon="arrow_forward" />
              <IconButton icon="close" onClick={this.props.onViewAllCustomers} />
            </div>
          </div>
          <div style={{ backgroundColor: '#ffffff', width: '100%', padding: 20 }}>
            <CustomerSummary customer={customer} customerSchema={customerSchema.summary} loading={isLoadingCustomerDetails} width={this.props.width} />
            <CustomerBasicInformation customer={customer} customerSchema={customerSchema.details} loading={isLoadingCustomerDetails} width={this.props.width} />
            <CustomerAttributes customer={customer} customerSchema={customerSchema.attributes} loading={isLoadingCustomerDetails} width={this.props.width} />
            <SpendTrend />
          </div>
        </div>
      </div>
    );
  }
}
