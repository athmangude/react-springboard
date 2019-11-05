/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Hashids from 'hashids';
import moment from 'moment';

import ActivityList from './Components/Activity/list';
import ActivityContent from './Components/Activity/content';
import BasicInformation from './Components/ViewCustomer/BasicInformation';
import CustomerInformation from './Components/ViewCustomer/CustomerInformation';
import BlacklistCustomer from './Components/ViewCustomer/BlacklistCustomer';
import TransactionHistory from './Components/ViewCustomer/TransactionHistory';
import ActionBar from '../components/ActionBar';
import { getCustomerDetails, createDummyTransactions } from '../components/DummyData'
import AddToSegment from './Actions/AddToSegment';
import ViewTransactionHistory from './ViewTransactionHIstory';
import DateRangePicker from 'SharedComponents/date-range-picker';
import IconButton from 'SharedComponents/icon-button';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';
import withAuthentication from 'Utils/withAuthentication';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import * as homeActions from 'Modules/voc/containers/Home/flux/actions';
import 'Modules/analytics/containers/Landing/index.css';
import ErrorState from 'SharedComponents/mwamba-error-state';

const times = ['8 a.m', '9 a.m', '10 a.m', '11 a.m', '12 p.m', '1 p.m', '2 p.m', '3 p.m', '4 p.m', '5 p.m', '6 p.m', '7 p.m', '8 p.m', '9 p.m', '10 p.m'];

const theme = ['food', 'hygiene', 'service', 'ambience', 'price', 'menu', 'billing', 'wifi'];

@connect((state) => ({
  route: state.route,
  user: state.authentication.user,
  collaborators: state.collaborators,
  configurations: state.configurations,
  account: state.account,
}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  homeActions: bindActionCreators(homeActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))

class ViewCustomerAlternate extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    windowDimensions: PropTypes.object,
    appActions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    collaborators: PropTypes.object,
    alertActions: PropTypes.object,
    homeActions: PropTypes.object,
    configurations: PropTypes.object,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.activityInformation = React.createRef();
    this.onChartTypeChange = this.onChartTypeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onViewTransactionHistory = this.onViewTransactionHistory.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onViewCustomerInformation = this.onViewCustomerInformation.bind(this);
    this.onBlacklistCustomer = this.onBlacklistCustomer.bind(this);
    this.onAddToSegment = this.onAddToSegment.bind(this);
    this.onSelectActivity = this.onSelectActivity.bind(this);
    this.createFakeData = this.createFakeData.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onLocationChanged = this.onLocationChanged.bind(this);
    this.onChangeInterval = this.onChangeInterval.bind(this);
    this.getFakeCustomer = this.getFakeCustomer.bind(this);
    this.createDummyTransactions = this.createDummyTransactions.bind(this);
    this.redirectToCustomers = this.redirectToCustomers.bind(this);

    this.state = {
      showSidePanel: false,
      showTransactionSidePanel: false,
      sidePanel: null,
      trendOverTimeInterval: 'daily',
      customerSpendInterval: 'daily',
      participant: {},
      participantId: '',
      participantNpsTrendData: {},
      isLoadingCustomer: false,
      isLoadingNpsTrend: false,
      segments: [],
      branchActivities: [],
      themes: [],
      customerActivity: [],
      isLoadingCustomerSpend: false,
      customerSpendData: [],
      locations: [],
      counties: [],
      isLoadingSegments: false,
      isLoadingTransactions: false,
      startDate: moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      selectedActivity: {},
      selectedDateRange: { key: 3, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' }},
      selectedLocation: { key: null, label: 'All Locations' },
    };
  }

  componentDidMount() {
    const { appActions, configurations } = this.props;
    const { router } = this.context;
    const { demoMode } = configurations;
    appActions.setRouteTitle('Customer');
    const participantId = this.decodeParticipantId(router.route.match.params.id)[0].toString();
    this.setState({ participantId }, () => {
      if(!demoMode) {
        this.createFakeData();
        this.fetchCustomerDetails();
        this.fetchCustomerTransactions(true);
        this.fetchFilters();
      } else {
        this.createFakeData();
        this.getFakeCustomer(participantId);
        this.createDummyTransactions(true);
      }
    });
  }

  componentWillReceiveProps(newProps) {
    const { router } = this.context;
    const participantId = this.decodeParticipantId(router.route.match.params.id)[0].toString();

    if(this.props.configurations.demoMode !== newProps.configurations.demoMode) {
      if(!newProps.configurations.demoMode) {
        this.createFakeData();
        this.fetchCustomerDetails();

        this.fetchCustomerTransactions(true);
      } else {
        this.createFakeData();
        this.getFakeCustomer(participantId);
        this.createDummyTransactions(true);
      }
    }
  }

  onChartTypeChange(chartType, type) {
    this.setState({ [type]: chartType });
  }

  onIntervalChange(interval, type) {
    this.setState({ [type]: interval }, () => {
      if (type === 'spendOverTimeInterval') {
        this.fetchCustomerSpend();
      } else if (type === 'trendOverTimeInterval') {
        this.fetchCustomerNpsTrend();
      }
    });
  }

  onDateRangeChange({ from, to }) {
    this.setState({ startDate: moment(from).startOf('day').format('YYYY-MM-DD HH:mm:ss'), endDate: moment(to).endOf('day').format('YYYY-MM-DD HH:mm:ss') }, () => this.fetchCustomerNpsTrend());
  }

  onViewTransactionHistory(transaction) {
    const { user } = this.props;

    this.setState({ showSidePanel: true, sidePanel: (<ViewTransactionHistory onCloseSidePanel={this.onCloseSidePanel} transaction={transaction} user={user} />) });
  }

  onViewCustomerInformation() {
    const { participant } = this.state;

    this.setState({ showSidePanel: true, sidePanel: (<CustomerInformation onCloseSidePanel={this.onCloseSidePanel} participant={participant} />) });
  }

  onAddToSegment() {
    const { customerAnalyticsActions } = this.props;

    this.setState({ showSidePanel: true, sidePanel: (<AddToSegment onCloseSidePanel={this.onCloseSidePanel} customerAnalyticsActions={customerAnalyticsActions} />) });
  }

  onBlacklistCustomer() {
    const { participant, customerAnalyticsActions } = this.state;

    this.setState({ showSidePanel: true, sidePanel: (<BlacklistCustomer onCloseSidePanel={this.onCloseSidePanel} participant={participant} customerAnalyticsActions={customerAnalyticsActions} />) });
  }
  
  onChangeInterval(interval) {
    this.setState({ customerSpendInterval: interval }, () => this.fetchCustomerSpend());
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, showTransactionSidePanel: false, sidePanel: null });
  }

  onChangeDateRange(selectedDateRange) {
    const { configurations } = this.props;
    const { demoMode } = configurations;

    this.setState({ selectedDateRange: selectedDateRange.value ? selectedDateRange.value : selectedDateRange }, () => {
      if(!demoMode) {
        this.fetchCustomerTransactions();
      } else {
        this.createDummyTransactions();
      }
    });
  }

  onLocationChanged(location) {
    this.setState({ selectedLocation: location }, () => this.fetchCustomerTransactions());
  }

  onSelectActivity(activity) {
    const { windowDimensions } = this.props;

    this.createFakeData();

    this.setState({ selectedActivity: activity });

    if(windowDimensions.width <= 768) {
      this.setState({ showSidePanel: true, showTransactionSidePanel: true });
    }

    if (this.activityInformation.current) {
      this.activityInformation.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  redirectToCustomers() {
    const { router } = this.context;
    router.history.push('/customers');
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  encodeSegmentId(segmentId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.encode(segmentId);
  }

  decodeParticipantId(participantId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);

    return hashids.decode(participantId);
  }

  createFakeData() {
    let branchActivities = [];
    let themes = [];

    times.map((time) => {
      branchActivities.push(
        { name: 'Page A', uv: 4000, time, people: this.randomAmount(4, 20) }
      );

      return branchActivities;
    });

    theme.map((theme) => {
      themes.push(
        { theme, nps: this.randomAmount(-20, 100), fullMark: 100 }
      );

      return themes;
    });

    this.setState({ branchActivities, themes });
  }

  randomAmount(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  getFakeCustomer(participantId) {
    this.setState({ isLoadingCustomer: true });
    setTimeout(() => {
      this.setState({ participant: getCustomerDetails(participantId), isLoadingCustomer: false });
    }, 1000);
  }

  createDummyTransactions(initialLoad = false) {
    const { selectedDateRange } = this.state;

    this.setState({ isLoadingTransactions: initialLoad });
    setTimeout(() => {
      const transactions = createDummyTransactions(15, selectedDateRange);
      this.setState({ customerActivity: transactions, selectedActivity: transactions.transactions[0], isLoadingTransactions: false });
    }, 1000)
  }

  extractLocations(filters) {
    const options = [{ key: null, label: 'All Locations' }];
    const location = filters.find((filter) => filter.name === 'location');
    if (location && location.options) {
      location.options
        .filter((option) => {
          const matches = option.match(/\s/g);
          if (matches !== null && matches.length < 3) { // TODO Remove once data has been cleaned up on the API side
            return option;
          }
          return false;
        })
        .forEach((option) => {
          options.push({ key: option.replace(/\s/g, '_'), label: option });
        });
    }
    this.setState({ locations: options, selectedLocation: options[0] });
  }

  extractCounties(filters) {
    const options = [{ key: null, label: 'All Counties' }];
    const county = filters.find((filter) => filter.name === 'county');
    if (county && county.options) {
      county.options.forEach((option) => {
        options.push({ key: option.replace(/\s/g, '_'), label: option });
      });
    }
    this.setState({ counties: options, selectedCounty: options[0] });
  }

  async fetchCustomerDetails() {
    const { appActions, customerAnalyticsActions, EventHandler } = this.props;
    const { participantId } = this.state;
    this.setState({ isLoadingCustomer: true });
    try {
      const fetchCustomerDetailsResult = await customerAnalyticsActions.fetchCustomerDetails(participantId);
      this.setState({ participant: fetchCustomerDetailsResult.data.Data });
    } catch (exception) {
      EventHandler.handleException(exception);
      this.redirectToCustomers();
    } finally {
      this.setState({ isLoadingCustomer: false });
    }
  }

  async fetchCustomerTransactions(initialLoad = false) {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { participantId, selectedDateRange, selectedLocation } = this.state;

    let startTime = '';
    let endTime = '';

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startTime = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    this.setState({ isLoadingTransactions: initialLoad });
    try {
      const fetchCustomerTransactionsResult = await customerAnalyticsActions.fetchCustomerTransactions(participantId, { startTime, endTime }, selectedLocation.key !== null ? { searchKey: 'location', searchValue: selectedLocation.label } : {});
      this.setState({
        customerActivity: fetchCustomerTransactionsResult.data.Data,
        selectedActivity: fetchCustomerTransactionsResult.data.Data.transactions[0]
      });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingTransactions: false });
    }
  }

  async fetchFilters() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    this.setState({ isLoadingFilters: true });

    try {
      const fetchFiltersResult = await customerAnalyticsActions.fetchFilters();
      const filters = fetchFiltersResult.data.Data.filter((filter) => {
        if (filter.filterType === 'SELECT' && filter.options === null) {
          return null;
        } if (filter.filterType === 'SELECT' && !filter.options.length) {
          return null;
        }
        return filter;
      });

      this.extractLocations(filters);
      this.extractCounties(filters);
      customerAnalyticsActions.setFilters(filters.filter((filter) => !['location', 'county'].includes(filter.name)));
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingFilters: false });
    }
  }

  render() {
    const { windowDimensions, user, customerAnalyticsActions, collaborators, alertActions, homeActions, configurations, EventHandler } = this.props;
    const { showSidePanel, sidePanel, participant, participantId, isLoadingCustomer, isLoadingTransactions, selectedActivity, themes, locations, selectedLocation, customerActivity, selectedDateRange, showTransactionSidePanel } = this.state;

    const { width } = windowDimensions;

    let currency = 'KES';
    const { countryId } = user.account;
    if (countryId) {
      currency = user.countries.find((country) => country.id === countryId).currencyCode;
    }

    const actions = [
      {
        items: locations,
        active: selectedLocation,
        callBack: this.onLocationChanged
      },
      {
        items: [
          { key: 1, label: 'Today', value: { from: moment().startOf('day').format(), to: moment().endOf('day').format(), label: 'Today' } },
          { key: 2, label: 'Last 7 Days', value: { from: moment().subtract(7, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 7 Days' } },
          { key: 3, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' } },
          { key: 4, label: 'Last 60 Days', value: { from: moment().subtract(60, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 60 Days' } },
          { key: 5, label: 'Custom Range', dialogTrigger: true, value: {} },
        ],
        active: selectedDateRange,
        callBack: this.onChangeDateRange,
        dialogComponent: <DateRangePicker range={selectedDateRange} />,
      },
    ];

    return (
      <SimpleLayoutExtended
        sidePanel={showSidePanel ? showTransactionSidePanel ?
          <TransactionHistory
            onCloseSidePanel={this.onCloseSidePanel}
            participant={participant}
            windowDimensions={windowDimensions}
            isLoadingTransactions={isLoadingTransactions}
            selectedActivity={selectedActivity}
            currency={currency}
            customerAnalyticsActions={customerAnalyticsActions}
            selectedDateRange={selectedDateRange}
            participantId={participantId}
            EventHandler={EventHandler}
            demoMode={configurations.demoMode}
            themes={themes}
            activityInformation={this.activityInformation}
            width={width}
            onChangeDateRange={this.onChangeDateRange}
            context={this.context}
          />
          : sidePanel : null}
        actions={(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10 }}>
            <ActionBar windowDimensions={windowDimensions} actions={actions} />
            <IconButton icon="info" onClick={this.onViewCustomerInformation} style={{ margin: '0px 5px 3px' }} toolTipText="Information" />
            <IconButton icon="add" onClick={this.onAddToSegment} style={{ margin: '0px 5px 3px' }} toolTipText="Add to segment" />
          </div>
        )}
      >
        <div style={{ width: '100%', backgroundColor: '#fff' }}>
          {
            (!isLoadingCustomer && Object.keys(participant).length === 0 && participant.constructor === Object) ? (
              <GenericPagePlaceholder title="Customer Analytics" text="There are no customers to display...yet!" />
            ) : (
              <div style={{ width: '100%' }}>
                <BasicInformation participant={participant} width={width} currency={currency} loading={isLoadingCustomer} />

                <div className="grid-item" style={{ width: 'inherit', height: width > 768 ? 'calc(100vh - 212px)' : 'calc(100vh - 270px)' }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 2, height: '100%' }}>
                    {
                      (isLoadingTransactions) ? (
                        <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
                          <ActivityList activities={customerActivity.transactions} selectedActivity={selectedActivity} onSelectActivity={this.onSelectActivity} currency={currency} loading={isLoadingTransactions} />
                          {
                            (width > 768) ? (
                              <ActivityContent
                                isLoadingTransactions={isLoadingTransactions}
                                selectedActivity={selectedActivity}
                                currency={currency}
                                customerAnalyticsActions={customerAnalyticsActions}
                                selectedDateRange={selectedDateRange}
                                participantId={participantId}
                                EventHandler={EventHandler}
                                demoMode={configurations.demoMode}
                                themes={themes}
                                activityInformation={this.activityInformation}
                                width={width}
                                context={this.context}
                              />
                            ) : null
                          }
                        </div>
                      ) : (selectedActivity !== undefined) ? (
                        <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
                          <ActivityList activities={customerActivity.transactions} selectedActivity={selectedActivity} onSelectActivity={this.onSelectActivity} currency={currency} loading={isLoadingTransactions} />
                          {
                            (width > 768) ? (
                              <ActivityContent
                                isLoadingTransactions={isLoadingTransactions}
                                selectedActivity={selectedActivity}
                                currency={currency}
                                customerAnalyticsActions={customerAnalyticsActions}
                                selectedDateRange={selectedDateRange}
                                participantId={participantId}
                                EventHandler={EventHandler}
                                demoMode={configurations.demoMode}
                                themes={themes}
                                activityInformation={this.activityInformation}
                                width={width}
                                context={this.context}
                              />
                            ) : null
                          }
                        </div>                        
                      ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                          <ErrorState text='No customer transactions for the time period selected' />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(ViewCustomerAlternate);
