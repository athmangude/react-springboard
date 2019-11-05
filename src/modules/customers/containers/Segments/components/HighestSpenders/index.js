/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-spinner-material';

import Spender from './spender';
import MwambaRequestDemo from 'SharedComponents/mwamba-request-demo';
import ErrorState from 'SharedComponents/mwamba-error-state';
import { createFakeHighestSpenders } from '../../../components/DummyData';
const noData = require('Images/no_data.png');
import themes from 'SharedComponents/themes';
const { primaryColor } = themes.light;

export default class HighestSpendersend extends Component {
  static propTypes = {
    segmentId: PropTypes.number,
    currency: PropTypes.string,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    selectedDateRange: PropTypes.object,
    appliedFilters: PropTypes.array,
    onView: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      customers: [],
      limit: 5,
      offset: 0,
      sortBy: 'firstName',
      sortOrder: 'desc',
    };

    this.createFakeHighestSpenders = this.createFakeHighestSpenders.bind(this);
    this.fetchCustomers = this.fetchCustomers.bind(this);
    this.createFullName = this.createFullName.bind(this);
  }

  componentDidMount() {
    const {demoMode} = this.props;
    
    if(!demoMode) {
      this.fetchCustomers(this.props);
    } else {
      this.createFakeHighestSpenders();
    }
  }

  componentWillReceiveProps(newProps) {
    if((newProps.selectedDateRange.from !== this.props.selectedDateRange.from) || (newProps.selectedDateRange.to !== this.props.selectedDateRange.to)) {
      if(!newProps.demoMode) {
        this.fetchCustomers(newProps);
      } else {
        this.createFakeHighestSpenders();
      }
    }
  }

  createFakeHighestSpenders() {
    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({ customers: createFakeHighestSpenders(), isLoading: false });
    }, 500)
  }

  createFullName(customers) {
    customers.forEach((customer, index) => {
      customers[index].name = `${customer.firstName} ${customer.lastName}`;
    });

    return customers;
  }

  async fetchCustomers(props) {
    const { customerAnalyticsActions, EventHandler, segmentId, selectedDateRange, appliedFilters } = props;
    const { limit, currentPage, sortBy, sortOrder } = this.state;
    this.setState({ isLoading: true });

    let startTime = '';
    let endTime = '';

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startTime = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    const data = (appliedFilters.length) ? JSON.parse(appliedFilters) : [];

    try {
      const fetchCustomersResult = await customerAnalyticsActions.fetchCustomers(limit, 0, segmentId, data, '', startTime, endTime, sortBy, sortOrder);
      let customers = fetchCustomersResult.data.Data.segmentParticipantList;
      customers = this.createFullName(customers);
      this.setState({ customers });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false});
    }
  }

  render() {
    const { currency, onView } = this.props;
    const { customers, isLoading } = this.state;

    return(
      <div className="grid-item" style={{ width: '100%', padding: '0px 10px 10px' }}>
      <div style={{ height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>Who are your highest spenders?</div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
        <div style={{ width: '100%', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              {
                isLoading ? (
                  <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'center' }}>
                    <Spinner spinnerColor={primaryColor} size={40} spinnerWidth={4} />
                  </div>
                ) : !customers.length ? (
                  <ErrorState />
                ) : (
                  customers.map((spender) => (
                    <Spender spender={spender} currency={currency} onView={onView} />
                  ))
                )  
              }
            </div>
          </div>
        </div>
      </div>    
    </div>
    );
  }
}
