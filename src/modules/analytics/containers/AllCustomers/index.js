import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Customers from '../Customers';
import SegmentActions from '../Segments/Actions';
import Segments from '../Segments';
import * as customerAnalyticsActions from '../flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';

@connect((state) => ({
  customers: state.customerAnalytics.customers,
}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))

export default class AllCustomers extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    activeSegmentId: PropTypes.number,
    onViewAllCustomers: PropTypes.func,
    width: PropTypes.number,
    customers: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onCustomerCheckboxSelected = this.onCustomerCheckboxSelected.bind(this);
    this.onShowCustomerDetails = this.onShowCustomerDetails.bind(this);
  }

  state = {
    limit: 15,
    offset: 0,
    isLoadingCustomers: false,
    checkedCustomers: [],
    customers: {
      items: [],
      totalCount: 0,
    },
  };

  componentDidMount() {
    this.fetchCustomers(this.props.activeSegmentId);
    this.props.appActions.setRouteTitle('Customers');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.activeSegmentId !== this.props.activeSegmentId) {
      this.fetchCustomers(newProps.activeSegmentId)
    }
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onCustomerCheckboxSelected(customerId) {
    let { checkedCustomers } = this.state;
    if (checkedCustomers.includes(customerId)) {
      checkedCustomers = checkedCustomers.filter((id) => id !== customerId);
    } else {
      checkedCustomers.push(customerId);
    }
    this.setState({ checkedCustomers });
  }

  onShowCustomerDetails(path) {
    return this.context.router.history.push(path);
  }

  async fetchCustomers(activeSegmentId) {
    const { limit, offset } = this.state;

    this.setState({ isLoadingCustomers: true });

    try {
      const fetchCustomersResult = await this.props.customerAnalyticsActions.fetchCustomers(limit, offset, activeSegmentId);
      
      console.log(fetchCustomersResult.data.Data.segmentParticipantList);
      
      this.props.customerAnalyticsActions.setCustomers({
        items: fetchCustomersResult.data.Data.segmentParticipantList,
        totalCount: fetchCustomersResult.data.Data.totalCount,
      });
      // this.setState({
      //   ...this.state,
      //   customers: {
      //     items: fetchCustomersResult.data.Data.segmentParticipantList,
      //     totalCount: fetchCustomersResult.data.Data.totalCount,
      //   }
      // });
    } catch (exception) {
      console.log(exception);
    } finally {
      this.setState({
        isLoadingCustomers: false,
      });
    }
  }

  render() {
    const { isLoadingCustomers, checkedCustomers } = this.state;
    const { activeSegmentId, onViewAllCustomers, customers } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <Segments activeSegmentId={activeSegmentId} onClose={onViewAllCustomers} path="/analytics/customers/segments" loading={isLoadingCustomers} />
        {
          checkedCustomers.length ? (<SegmentActions />) : null
        }
        <Customers participants={customers.items} totalCount={customers.totalCount} loading={isLoadingCustomers} onCustomerCheckboxSelected={this.onCustomerCheckboxSelected} onShowCustomerDetails={this.onShowCustomerDetails} checked={!activeSegmentId} />
      </div>
    );
  }
}
