/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';
import Hashids from 'hashids';
import { XMasonry, XBlock } from 'react-xmasonry/dist/index';
import 'react-placeholder/lib/reactPlaceholder.css';

import Filters from '../../Customers/Actions/Filters';
import SpendOverTime from '../components/SpendOverTime';
import HighestSpenders from '../components/HighestSpenders';
import NpsRating from '../components/NPS';
import Demographics from '../components/Demographics';
import Customer from '../../Customers/Customer';
import TableCount from '../../Customers/Components/Table/TableCount';
import TableTopBar from '../../Customers/Components/Table/Topbar';
import EditSegment from '../components/EditSegment';
import WideConversationListItem from 'Modules/voc/containers/Conversations/components/WideConversationListItem';
import Campaigns from '../components/Campaign/NewCampaign';
import ViewCampaign from '../components/Campaign/ViewCampaign';
import Upload from '../../Customers/Actions/Upload';
import Download from '../../Customers/Actions/Download';
import ChangeColumns from '../../Customers/Actions/ChangeColumns';
import PaginationNext from 'SharedComponents/pagination-next';
import TabMenu from 'SharedComponents/tab';
import UpgradeModal from 'SharedComponents/upgrade-modal';
import Activity from '../components/Activity';
import {getSegmentDetails, createDummyCustomers} from '../../components/DummyData';
import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import ActionBar from '../../components/ActionBar/index';
import DateRangePicker from 'SharedComponents/date-range-picker';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';
import withAuthentication from 'Utils/withAuthentication';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';
import * as audiencesActions from 'Modules/voc/containers/Settings/Audiences/flux/actions';
import 'Modules/analytics/containers/Landing/index.css';


const tabs = [{ label: 'Customers' }, { label: 'Campaigns' }, { label: 'Activity' }];
const activities = [
  { message: 'Sent Customer Feedback(Opt-ins) (KENYA) survey', icon: 'send', date: moment().subtract(1, 'day'), user: 'William Kamau' },
  { message: 'Uploaded 2 participants to the segment', icon: 'cloud_upload', date: moment().subtract(2, 'day'), user: 'Ronnie Nyaga' },
  { message: 'Downloaded an excel containing 100 participants from the segment', icon: 'cloud_download', date: moment().subtract(3, 'day'), user: 'Ian Mihuro' },
  { message: 'Sent Test Swahili with Editable Intro', icon: 'send', date: moment().subtract(4, 'day').subtract('30', 'minutes'), user: 'George Kagambi' },
  { message: 'Modified segment filters', icon: 'filter_list', date: moment().subtract(5, 'day').subtract('220', 'minutes'), user: 'System' },
  { message: 'Editted segment name', icon: 'edit', date: moment().subtract(6, 'day').subtract('90', 'minutes'), user: 'Athman GUde' },
  { message: 'Filters matched 10 more participants', icon: 'filter_list', date: moment().subtract(7, 'day').subtract('120', 'minutes'), user: 'William Kamau' },
  { message: 'Created segment', icon: 'create', date: moment().subtract(8, 'day').subtract('420', 'minutes'), user: 'William Kamau' },
];
@connect((state) => ({
  route: state.route,
  user: state.authentication.user,
  loggedInUserRole: state.roles.loggedInUserRole,
  account: state.account,
}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  audiencesActions: bindActionCreators(audiencesActions, dispatch),
  dispatch,
}))

class ViewSegment extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    windowDimensions: PropTypes.object,
    appActions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    configurations: PropTypes.object,
    route: PropTypes.object,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.customersTab = React.createRef();
    const params = (new URL(document.location)).searchParams;
    this.state = {
      activeSegment: {},
      limit: 20,
      offset: 0,
      currentPage: params.get('page') ? parseInt(params.get('page'), 10) : 1,
      isLoadingCustomers: false,
      isLoadingSegment: false,
      isInitialLoad: false,
      isApplyingFilters: false,
      isShowingAppliedFilters: false,
      isLoadingDemographics: false,
      isLoadingSpend: false,
      appliedFilters: [],
      filters: null,
      checkedCustomers: [],
      sidePanel: null,
      showSidePanel: false,
      customers: {
        items: [],
        totalCount: null,
      },
      segmentSpendData: [],
      conversations: {
        items: [],
        totalCount: null
      },
      segmentId: null,
      segment: null,
      showMainContent: true,
      customer: null,
      isPaginating: false,
      searchTerm: '',
      showMatches: false,
      isSearchingCustomers: false,
      isLoadingConversations: false,
      chartType: 'line',
      type: 'active',
      columns: [
        { name: 'Name', dataKey: 'name', sortField: 'firstName', show: true },
        { name: 'Last transaction spend', dataKey: 'lastTransactionSpent', sortField: 'lastTransactionSpent', show: true },
        { name: 'Phone Number', dataKey: 'commId', sortField: 'commId', show: true },
        { name: 'Last Transaction Spend', dataKey: 'lastTransactionSpent', sortField: 'lastTransactionSpent', show: true },
        { name: 'Last Transaction Location', dataKey: 'lastTransactionLocation', sortField: 'lastTransactionLocation', show: true },
        { name: 'Last Transaction Time', dataKey: 'lastTransactionTimestamp', sortField: 'lastTransactionTimestamp', show: true },
      ],
      selectedTab: 'Customers',
      selectedLocation: {},
      selectedDateRange: {
        key: 3, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' },
      },
      demographics: {},
      startTime: moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      sortBy: 'firstName',
      sortOrder: 'asc',
      segmentSpendInterval: 'daily',
      showUpgradeModal: false,
    };

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onViewFilters = this.onViewFilters.bind(this);
    this.onView = this.onView.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
    this.onAlternateView = this.onAlternateView.bind(this);
    this.onCloseAlternateView = this.onCloseAlternateView.bind(this);
    this.onChangeColumns = this.onChangeColumns.bind(this);
    this.onOpenChangeColumns = this.onOpenChangeColumns.bind(this);
    this.onUploadCustomers = this.onUploadCustomers.bind(this);
    this.onDownloadCustomers = this.onDownloadCustomers.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.onCancelSearch = this.onCancelSearch.bind(this);
    this.onEditSegment = this.onEditSegment.bind(this);
    this.onEngageCustomers = this.onEngageCustomers.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onSortCustomers = this.onSortCustomers.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onChangeInterval = this.onChangeInterval.bind(this);
    this.getFakeSegment = this.getFakeSegment.bind(this);
    this.createFakeCustomers = this.createFakeCustomers.bind(this);
    this.fetchSegmentDetails = this.fetchSegmentDetails.bind(this);
  }


  componentDidMount() {
    const { appActions, configurations } = this.props;
    const { router } = this.context;
    const { demoMode } = configurations;
    appActions.setRouteTitle('Segment');
    const segmentId = this.decodeSegmentId(router.route.match.params.id)[0].toString();
    this.setState({ segmentId }, () => {
      if (!demoMode) {
        this.fetchCustomers(true);
        this.fetchSegmentDetails(segmentId);
        this.fetchConversations();
      } else {
        this.getFakeSegment(segmentId);
      }
    });
  }

  componentWillReceiveProps(newProps){
    if(this.props.configurations.demoMode !== newProps.configurations.demoMode) {
      const { router } = this.context;
      const segmentId = this.decodeSegmentId(router.route.match.params.id)[0].toString();
      if(!newProps.configurations.demoMode){
        this.fetchCustomers(true);
        this.fetchSegmentDetails(segmentId);
        this.fetchConversations();
       } else {
        this.getFakeSegment(segmentId);
       }
    }
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onChangeSegment(activeSegment) {
    this.setState({ activeSegment });
  }

  onCheck(checkedCustomers) {
    this.setState({ checkedCustomers });
  }

  onViewFilters() {
    const { customerAnalyticsActions, user, alertActions, EventHandler, configurations } = this.props;
    const { segment, appliedFilters } = this.state;
    const { demoMode } = configurations;
    
    this.setState({
      showSidePanel: true,
      sidePanel:(
        <Filters
          showSaveSegmentAction
          appliedFilters={(appliedFilters !== null) ? appliedFilters : segment.queryAttribute}
          onCloseSidePanel={this.onCloseSidePanel}
          applyFilters={this.onApplyFilters}
          customerAnalyticsActions={customerAnalyticsActions}
          EventHandler={EventHandler}
          alertActions={alertActions}
          segment={segment}
          user={user}
          demoMode={demoMode}
          onOpenModal={this.onOpenModal}
          configurations={configurations}
          showUpgradeModal={configurations && !configurations.features.customerAnalytics}
        />
      ) 
    });
  }

  onOpenModal() {
    this.setState({ showUpgradeModal: true });
  }

  onView(customer) {
    const { router } = this.context;
    router.history.push(`/customers/${this.encodeParticipantId(customer.participantId)}/view`);
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onPaginationNextPageChange(page) {
    const { limit, offset } = this.state;
    const newOffset = parseInt(offset, 10) + parseInt(limit, 10);
    const nextPage = page + 1;

    this.setState({ currentPage: nextPage, offset: newOffset, isPaginating: true }, () => {
      const { router } = this.context;
      const { history } = router;
      const { route } = this.props;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage, 10)}`);
      this.fetchCustomers();
    });
  }

  onAlternateView(customer) {
    this.onCloseSidePanel();

    this.setState({ customer, showMainContent: false });
  }

  onCloseAlternateView() {
    this.setState({ showMainContent: true, customer: null });
  }

  onChangeColumns(columns) {
    this.setState({ columns });
  }

  onOpenChangeColumns() {
    const { columns } = this.state;

    this.setState({ showSidePanel: true, sidePanel: (<ChangeColumns onCloseSidePanel={this.onCloseSidePanel} options={columns} onChange={this.onChangeColumns} />) });
  }

  onUploadCustomers() {
    const { EventHandler, alertActions, audiencesActions } = this.props;
    this.setState({ showSidePanel: true, sidePanel: (<Upload onCloseSidePanel={this.onCloseSidePanel} showSegmentNameInput={false} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onDownloadCustomers() {
    const { EventHandler, alertActions, customerAnalyticsActions, user } = this.props;
    const { columns, appliedFilters, selectedDateRange, segmentId } = this.state;

    let startTime = '';
    let endTime = '';

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    } else {
      startTime = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }

    this.setState({
      showSidePanel: true,
      sidePanel: (
        <Download
          onCloseSidePanel={this.onCloseSidePanel}
          downloadableColumns={columns}
          customerAnalyticsActions={customerAnalyticsActions}
          EventHandler={EventHandler}
          alertActions={alertActions}
          appliedFilters={appliedFilters}
          user={user}
          startTime={startTime}
          endTime={endTime}
          segmentId={segmentId}
        />
      )
      });
  }

  onEngageCustomers() {
    const { EventHandler, alertActions, customerAnalyticsActions } = this.props;
    const { segmentId } = this.state;
    this.setState({
      showSidePanel: true,
      sidePanel: (
        <Campaigns
          onCloseSidePanel={this.onCloseSidePanel}
          segmentId={segmentId}
          customerAnalyticsActions={customerAnalyticsActions}
          audiencesActions={audiencesActions}
          EventHandler={EventHandler}
          alertActions={alertActions}
        />
      ) 
    });
  }

  onCloseModal() {
    this.setState({ showUpgradeModal: false });
  }

  onSearchTermChange(event) {
    clearTimeout(this.timer);
    const searchTerm = event.target.value;
    this.setState({ searchTerm, isSearchingCustomers: true }, () => {
      this.timer = setTimeout(() => {
        this.fetchCustomers();
      }, 750);
    });
  }

  onEditSegment() {
    const { customerAnalyticsActions, configurations, alertActions, EventHandler } = this.props;
    const { segment, appliedFilters } = this.state;
    const { demoMode } = this.state;

    if(configurations && !configurations.features.customerAnalytics && !demoMode) {
      this.setState({ showUpgradeModal: true });
    } else {
      this.setState({
        showSidePanel: true,
        sidePanel: (
          <EditSegment
            reloadSegment={this.fetchSegmentDetails}
            onCloseSidePanel={this.onCloseSidePanel}
            filters={appliedFilters}
            fetchSegmentDetails={this.fetchSegmentDetails}
            customerAnalyticsActions={customerAnalyticsActions}
            alertActions={alertActions}
            EventHandler={EventHandler}
            segment={segment}
          />
        )
      });
    }
  }

  onCancelSearch() {
    this.setState({ searchTerm: '', isSearchingCustomers: false }, () => this.fetchCustomers());
  }

  onChangeLocation(selectedLocation) {
    this.setState({ selectedLocation });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({ selectedDateRange: selectedDateRange.value ? selectedDateRange.value : selectedDateRange }, () => {
      this.fetchCustomers(false);
    });
  }

  onSortCustomers(sortBy, sortOrder) {
    this.setState({ sortBy, sortOrder }, () => this.fetchCustomers(false));
  }

  onApplyFilters(appliedFilters) {
    this.setState({
      appliedFilters: JSON.stringify(appliedFilters),
    }, () => {
      this.fetchCustomers(false);
    });
  }

  onChangeInterval(interval) {
    this.setState({ segmentSpendInterval: interval }, () => this.fetchSpendOverview());
  }

  encodeParticipantId(participantId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.encode(participantId);
  }

  decodeSegmentId(segmentId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);

    return hashids.decode(segmentId);
  }

  createTableDataColumns(data) {
    const { columns } = this.state;

    Object.keys(data).forEach((value) => {
      const item = columns.find((column) => column.dataKey === value);

      if (item === undefined) {
        columns.push({ name: this.sentenseCase(value), dataKey: value, sortField: value, show: false });
      }
    });

    this.setState({ columns });
  }

  sentenseCase(value) {
    const newWord = value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
    return newWord.charAt(0).toUpperCase() + newWord.slice(1);
  }

  createFullName(customers) {
    customers.forEach((customer, index) => {
      customers[index].name = `${customer.firstName} ${customer.lastName}`;
    });

    return customers;
  }

  getFakeSegment(segmentId) {
    const { selectedDateRange } = this.state;
    setTimeout(() => {
      const segment = getSegmentDetails(segmentId);
      this.setState({ segment, appliedFilters: segment.queryAttribute, isLoadingSegment: false });
      this.createFakeCustomers();
    }, 500)
  }

  createFakeCustomers() {
    const { appliedFilters } = this.state;

    this.setState({ isLoadingCustomers: true });

    setTimeout(() => {
      let customers = this.createFullName(createDummyCustomers(JSON.parse(appliedFilters), 20));
      this.createTableDataColumns(customers[0]);
      this.setState({ isLoadingCustomers: false, customers: { ...customers, items: customers, totalCount: 20 } });
    }, 3000);
  }

  async fetchCustomers(isInitialLoad = false) {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { limit, currentPage, appliedFilters, segmentId, searchTerm, startTime, endTime, sortBy, sortOrder } = this.state;
    this.setState({ isLoadingCustomers: true, isInitialLoad });

    const data = (appliedFilters.length) ? JSON.parse(appliedFilters) : [];

    try {
      const fetchCustomersResult = await customerAnalyticsActions.fetchCustomers(limit, (currentPage - 1) * limit, segmentId, data, searchTerm, startTime, endTime, sortBy, sortOrder);
      let customers = fetchCustomersResult.data.Data.segmentParticipantList;
      customers = this.createFullName(customers);
      this.setState({ customers: { ...customers, items: customers, totalCount: fetchCustomersResult.data.Data.totalCount } });
      if (fetchCustomersResult.data.Data.segmentParticipantList.length > 0) {
        this.createTableDataColumns(fetchCustomersResult.data.Data.segmentParticipantList[0]);
      }
    } catch (exception) {
      EventHandler.handleException(exception);
      this.setState({ isLoadingCustomers: false, isInitialLoad: false });
    } finally {
      this.setState({ isLoadingCustomers: false, isInitialLoad: false, isPaginating: false, isSearchingCustomers: false, showSidePanel: false });
    }
  }

  async fetchSegmentDetails() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { segmentId } = this.state;
    this.setState({ isLoadingSegment: true });

    try {
      const fetchSegmentDetailsResult = await customerAnalyticsActions.fetchSegmentDetails(segmentId);
      this.setState({ segment: fetchSegmentDetailsResult.data.Data, appliedFilters: fetchSegmentDetailsResult.data.Data.queryAttribute });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSegment: false });
    }
  }

  async fetchConversations(page = 1) {
    const { EventHandler, conversationActions } = this.props;
    const { type, conversations } = this.state;
    this.setState({ isLoadingConversations: true });

    try {
      const fetchConversationsResult = await conversationActions.fetchConversations(page, type, 10, 10, false);
      this.setState({ conversations: { ...conversations, items: fetchConversationsResult.data.Data.objects, totalCount: fetchConversationsResult.data.Data.meta.totalCount } });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingConversations: false });
    }
  }

  render() {
    const { windowDimensions, configurations, customerAnalyticsActions, conversationActions, EventHandler, account, loggedInUserRole, alertActions, user } = this.props;
    const { width } = windowDimensions;
    const { customers, isLoadingCustomers, conversations, type, limit, offset, isPaginating, columns, searchTerm, isLoadingConversations, showUpgradeModal, isSearchingCustomers, activeSegment, showSidePanel, sidePanel, segment, currentPage, checkedCustomers, segmentId, isApplyingFilters, isShowingAppliedFilters, showMainContent, customer, selectedTab, selectedDateRange, sortBy, sortOrder, appliedFilters } = this.state;
    
    const actions = [
      {
        items: [
          { key: 1, label: 'Last 7 Days', value: { from: moment().subtract(7, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 7 Days' } },
          { key: 2, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' } },
          { key: 3, label: 'Last 60 Days', value: { from: moment().subtract(60, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 60 Days' } },
          { key: 4, label: 'Custom Range', dialogTrigger: true, value: {} },
        ],
        active: selectedDateRange,
        callBack: this.onChangeDateRange,
        dialogComponent: <DateRangePicker range={selectedDateRange} />,
      },
    ];

    let currency = 'KES';
    const { countryId } = user.account;
    if (countryId) {
      currency = user.countries.find((country) => country.id === countryId).currencyCode;
    }

    return (
      <SimpleLayoutExtended
        sidePanel={showSidePanel ? sidePanel : null}
        actions={(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10 }}>
            <ActionButton text="Engage" onClick={this.onEngageCustomers} show={segment && segment.status.toLowerCase() === 'active'} />
            <ActionBar windowDimensions={windowDimensions} actions={actions} />
            <IconButton icon="edit" onClick={this.onEditSegment} style={{ margin: '0px 5px 3px' }} toolTipText="Edit" />
            <IconButton icon="filter_list" onClick={this.onViewFilters} style={{ margin: '0px 5px 3px' }} toolTipText="Filters" show={segment && segment.status.toLowerCase() === 'active'} />
          </div>
        )}
        tabs={(
          <div style={{ width: 500, height: '100%', display: 'flex', alignContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontweight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize' }}>
              {
                (segment) ? segment.name : null
              }
            </div>
            {
              (segment && segment.status.toLowerCase() === 'inactive') ? (
                <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fce8e6', padding: 15, margin: '5px 5px', borderRadius: 30, height: 30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <span style={{ color: '#d93024', fontSize: 12 }}>INACTIVE</span>
                  </div>
                </div>
              ) : null
            }
          </div>
        )}
      >
        {
          <div id="ca-landing" style={{ width: '100%', backgroundColor: '#fff', padding: width > 425 ? '0 10px 0 10px' : 0 }}>
            <UpgradeModal open={showUpgradeModal} onCloseModal={this.onCloseModal} text={'You can not edit a segment or change filters. Upgrade to access new features such as:'}  />    
            <XMasonry>
              <XBlock key="spendingOverTime" width={6}>
                <SpendOverTime
                  width={width}
                  segmentId={segmentId}
                  selectedDateRange={selectedDateRange}
                  onChangeInterval={this.onChangeInterval}
                  title="When are your customers spending?"
                  EventHandler={EventHandler}
                  alertActions={alertActions}
                  appliedFilters={appliedFilters}
                  customerAnalyticsActions={customerAnalyticsActions}
                  demoMode={configurations.demoMode}
                />
              </XBlock>

              <XBlock key="highestSpenders" width={3}>
                <HighestSpenders
                  segmentId={segmentId}
                  selectedDateRange={selectedDateRange}
                  appliedFilters={appliedFilters}
                  currency={currency}
                  EventHandler={EventHandler}
                  alertActions={alertActions}
                  customerAnalyticsActions={customerAnalyticsActions}
                  demoMode={configurations.demoMode}
                  onView={this.onView}
                />
              </XBlock>

              <XBlock key="npsRating" width={2}>
                <NpsRating
                  segmentId={segmentId}
                  selectedDateRange={selectedDateRange}
                  EventHandler={EventHandler}
                  alertActions={alertActions}
                  appliedFilters={appliedFilters}
                  customerAnalyticsActions={customerAnalyticsActions}
                  demoMode={configurations.demoMode}
                />
              </XBlock>

              <XBlock key="demographics" width={2}>
                <Demographics
                  width={width}
                  segmentId={segmentId}
                  selectedDateRange={selectedDateRange}
                  appliedFilters={appliedFilters}
                  customerAnalyticsActions={customerAnalyticsActions}
                  EventHandler={EventHandler}
                  alertActions={alertActions}
                  demoMode={configurations.demoMode}
                />
              </XBlock>

              <XBlock key="customers" width={6}>
                <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ borderBottom: '1px solid rgb(217, 217, 217)' }} />
                {
                  selectedTab === 'Customers' ? (
                    <div style={{ flex: 1, flexDirection: 'row', marginTop: 5 }} ref={this.customersTab}>
                      {
                        (customers.items.length && !isLoadingCustomers) ? (
                          <TableTopBar
                            isSearchingCustomers={isSearchingCustomers}
                            onCancelSearch={this.onCancelSearch}
                            onSearchTermChange={this.onSearchTermChange}
                            searchTerm={searchTerm}
                            onDownloadCustomers={this.onDownloadCustomers}
                            onUploadCustomers={this.onUploadCustomers}
                            onOpenChangeColumns={this.onOpenChangeColumns}
                            tableBarActions={(
                              <div style={{ display: 'flex' }}>
                                <IconButton icon="cloud_upload" large onClick={this.onUploadCustomers} style={{ margin: '0px 5px 3px' }} toolTipText="Upload" />
                                <IconButton icon="cloud_download" large onClick={this.onDownloadCustomers} style={{ margin: '0px 5px 3px' }} toolTipText="Download" />
                                <IconButton icon="view_column" large onClick={this.onOpenChangeColumns} style={{ margin: '0px 5px 3px' }} toolTipText="Columns" />
                              </div>
                            )}
                            tableCount={(<TableCount checkedItems={checkedCustomers} totalCount={customers.totalCount} limit={limit} currentPage={currentPage} offset={offset} isPaginating={isPaginating} />)}
                          />
                        ) : null
                      }
                      <Customer onCheck={this.onCheck} onView={this.onView} checked={!activeSegment.id} limit={limit} offset={offset} page={parseInt(currentPage, 10) - 1} customers={customers} columns={columns} onPaginationNextPageChange={this.onPaginationNextPageChange} onSortCustomers={this.onSortCustomers} isLoadingCustomers={isLoadingCustomers} isPaginating={isPaginating} sortBy={sortBy} sortOrder={sortOrder} />
                    </div>
                  ) : (selectedTab === 'Campaigns') ? (
                    <ViewCampaign 
                      segmentId={segmentId}
                      conversationActions={conversationActions}
                      account={account}
                      loggedInUserRole={loggedInUserRole}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      audiencesActions={audiencesActions}
                      demoMode={configurations.demoMode}
                      windowDimensions={windowDimensions}
                      currentPage={currentPage}
                    />
                  ) : (selectedTab === 'Activity') ? (
                    <div style={{ width: 'calc(100% - 20)' }}>
                      <Activity
                        segmentId={segmentId}
                        customerAnalyticsActions={customerAnalyticsActions}
                        EventHandler={EventHandler}
                        alertActions={alertActions}
                        demoMode={configurations.demoMode}
                      />
                    </div>
                  ) : null
                }
              </XBlock>
            </XMasonry>
          </div>
        }
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(ViewSegment);
