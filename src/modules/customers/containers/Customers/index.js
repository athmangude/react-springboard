/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, TextBlock } from 'react-placeholder/lib/placeholders';
import Hashids from 'hashids';
import 'react-placeholder/lib/reactPlaceholder.css';

import SegmentTags from '../Segments/components/Tags';
import Filters from './Actions/Filters';
import Customer from './Customer';
import ChangeColumns from './Actions/ChangeColumns';
import Upload from './Actions/Upload';
import Download from './Actions/Download';
import Campaigns from '../Segments/components/Campaign/NewCampaign';
import TableSearch from './Components/Table/TableSearch';
import TableCount from './Components/Table/TableCount';
import CreateSegment from './Actions/CreateSegment';
import AddToSegment from './Actions/AddToSegment';
import SelectedFilters from './Actions/Filters/SelectedFilters';
import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button-styled';
import DateRangePicker from 'SharedComponents/date-range-picker';
import SearchBar from 'SharedComponents/search-bar';
import UpgradeModal from 'SharedComponents/upgrade-modal';
import ActionBar from '../components/ActionBar';
import { createDummyCustomers, createDummySegments } from '../components/DummyData';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';
import withAuthentication from 'Utils/withAuthentication';
import ErrorState from 'SharedComponents/mwamba-error-state';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';
import IconButton from 'SharedComponents/icon-button';

@connect((state) => ({
  route: state.route,
  segments: state.customerAnalytics.segments,
  user: state.authentication.user,
  account: state.account,
}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))

class Customers extends Component {
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
    segment: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const params = (new URL(document.location)).searchParams;
    this.state = {
      activeSegment: {},
      limit: 30,
      offset: 0,
      currentPage: params.get('page') ? parseInt(params.get('page'), 10) : 1,
      isLoadingCustomers: false,
      isLoadingSegments: false,
      isInitialLoad: false,
      isApplyingFilters: false,
      isShowingAppliedFilters: false,
      isPaginating: false,
      loadSegments: true,
      checkedCustomers: [],
      sidePanel: null,
      showSidePanel: false,
      customers: {
        items: [],
        totalCount: null,
      },
      selectedCustomer: null,
      filters: null,
      segmentId: null,
      segment: null,
      searchTerm: '',
      isLoadingCustomersViaSegment: false,
      isSearchingCustomers: false,
      showMainContent: true,
      chartType: 'bar',
      columns: [
        { name: 'Name', dataKey: 'name', sortField: 'firstName', show: true },
        { name: 'Last transaction spend', dataKey: 'lastTransactionSpent', sortField: 'lastTransactionSpent', show: true },
        { name: 'Phone Number', dataKey: 'commId', sortField: 'commId', show: true },
        { name: 'Last Transaction Spend', dataKey: 'lastTransactionSpent', sortField: 'lastTransactionSpent', show: true },
        { name: 'Last Transaction Location', dataKey: 'lastTransactionLocation', sortField: 'lastTransactionLocation', show: true },
        { name: 'Last Transaction Time', dataKey: 'lastTransactionTimestamp', sortField: 'lastTransactionTimestamp', show: true },
      ],
      selectedDateRange: {
        key: 3, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' },
      },
      sortBy: 'firstName',
      sortOrder: 'asc',
      showUpgradeModal: false,
    };

    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onView = this.onView.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
    this.onAlternateView = this.onAlternateView.bind(this);
    this.onCloseAlternateView = this.onCloseAlternateView.bind(this);
    this.onViewAllSegments = this.onViewAllSegments.bind(this);
    this.onChangeColumns = this.onChangeColumns.bind(this);
    this.onOpenChangeColumns = this.onOpenChangeColumns.bind(this);
    this.onUploadCustomers = this.onUploadCustomers.bind(this);
    this.onDownloadCustomers = this.onDownloadCustomers.bind(this);
    this.onCreateSegment = this.onCreateSegment.bind(this);
    this.onAddToSegment = this.onAddToSegment.bind(this);
    this.onEngageCustomers = this.onEngageCustomers.bind(this);
    this.onRemoveFromFilter = this.onRemoveFromFilter.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.onCancelSearch = this.onCancelSearch.bind(this);
    this.onFetchSegments = this.onFetchSegments.bind(this);
    this.onSortCustomers = this.onSortCustomers.bind(this);
    this.onSelectSegment = this.onSelectSegment.bind(this);
    this.createFakeCustomers = this.createFakeCustomers.bind(this);
    this.applyFiltersOnFakeData = this.applyFiltersOnFakeData.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
  }

  componentDidMount() {
    const { appActions, configurations} = this.props;
    const { demoMode } = configurations; 
    appActions.setRouteTitle('Customers');

    if(!demoMode) {
      this.fetchCustomers(true);
      this.onFetchSegments();
     } else {
      this.createFakeCustomers();
     }
  }

  componentWillReceiveProps(newProps) {
    if(this.props.configurations.demoMode !== newProps.configurations.demoMode) {
      !newProps.configurations.demoMode ? this.fetchCustomers(true) : this.createFakeCustomers();
    }
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onChangeSegment(activeSegment) {
    this.setState({ activeSegment }, () => this.fetchCustomers(false, true, true));
  }

  onCheck(checkedCustomers) {
    this.setState({ checkedCustomers });
  }

  onFilter(showSaveSegment = false) {
    const {
      customerAnalyticsActions, configurations, alertActions, windowDimensions, EventHandler, segments
    } = this.props;
    const { width } = windowDimensions;
    const { filters } = this.state;
    this.setState({
      showSidePanel: true,
      sidePanel: (
        <Filters
          showSaveSegmentAction
          showSaveSegment={showSaveSegment}
          appliedFilters={filters}
          onCloseSidePanel={this.onCloseSidePanel}
          width={width}
          applyFilters={this.applyFilters}
          fetchSegments={this.onFetchSegments}
          onOpenModal={this.onOpenModal}
          segments={segments}
          customerAnalyticsActions={customerAnalyticsActions}
          alertActions={alertActions}
          EventHandler={EventHandler}
          applyFiltersOnFakeData={this.applyFiltersOnFakeData}
          configurations={configurations}
          showUpgradeModal={configurations && !configurations.features.customerAnalytics && segments.items.length >= 4}
        />
      ) 
    });
  }

  onCreateSegment(showSaveSegment = false) {
    const { configurations, segments } = this.props;
    
    if(!configurations.features.customerAnalytics && segments.items.length >= 4) {
      this.onOpenModal();
    } else {
      this.onFilter(showSaveSegment);
    }
  }

  onOpenModal() {
    this.setState({ showUpgradeModal: true });
  }

  onCloseModal() {
    this.setState({ showUpgradeModal: false });
  }

  onAlternateView(customer) {
    this.onCloseSidePanel();

    this.setState({ selectedCustomer: customer, showMainContent: false });
  }

  onCloseAlternateView() {
    this.setState({ showMainContent: true, selectedCustomer: null });
  }

  onView(customer) {
    const { router } = this.context;
    router.history.push(`/customers/${this.encodeParticipantId(customer.participantId)}/view`);
  }

  onViewAllSegments() {
    const { router } = this.context;
    router.history.push('/customers/segments');
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onPaginationNextPageChange(page) {
    const { limit, offset, filters } = this.state;
    const newOffset = parseInt(offset, 10) + parseInt(limit, 10);
    const nextPage = page + 1;

    this.setState({ currentPage: nextPage, offset: newOffset, isPaginating: true }, () => {
      const { router } = this.context;
      const { history, route } = router;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage, 10)}`);
      filters !== null ? this.applyFilters(JSON.parse(filters)) : this.fetchCustomers();
    });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({ selectedDateRange: selectedDateRange.value ? selectedDateRange.value : selectedDateRange }, () => {
      this.fetchCustomers(false);
    });
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
    this.setState({ showSidePanel: true, sidePanel: (<Upload onCloseSidePanel={this.onCloseSidePanel} audiencesActions={audiencesActions} EventHandler={EventHandler} alertActions={alertActions} />) });
  }

  onDownloadCustomers() {
    const { EventHandler, alertActions, customerAnalyticsActions, user } = this.props;
    const { columns, filters, startTime, endTime } = this.state;

    this.setState({ showSidePanel: true,
      sidePanel: (
        <Download
          onCloseSidePanel={this.onCloseSidePanel}
          downloadableColumns={columns}
          customerAnalyticsActions={customerAnalyticsActions}
          EventHandler={EventHandler}
          alertActions={alertActions}
          appliedFilters={filters}
          user={user}
          startTime={startTime}
          endTime={endTime}
        />
    ) });
  }

  onAddToSegment() {
    const { customerAnalyticsActions } = this.props;

    this.setState({ showSidePanel: true, sidePanel: (<AddToSegment onCloseSidePanel={this.onCloseSidePanel} customerAnalyticsActions={customerAnalyticsActions} />) });
  }

  onEngageCustomers() {
    const { EventHandler, alertActions, customerAnalyticsActions, audiencesActions } = this.props;
    const { checkedCustomers } = this.state;
    const participants = [];
    
    checkedCustomers.forEach((customer) => participants.push(customer.participantId));

    this.setState({
      showSidePanel: true,
      sidePanel: (
        <Campaigns
          onCloseSidePanel={this.onCloseSidePanel}
          customerAnalyticsActions={customerAnalyticsActions}
          audiencesActions={audiencesActions}
          EventHandler={EventHandler}
          alertActions={alertActions}
          participants={participants}
        />
      )
    });
  }

  onRemoveFromFilter(index) {
    const { configurations } = this.props;
    const { demoMode } = configurations;
    
    let { filters } = this.state;

    filters = JSON.parse(filters);

    filters.splice(index, 1);

    this.setState({ filters: JSON.stringify(filters), isShowingAppliedFilters: !!filters.length }, () => !demoMode ? this.applyFilters(filters) : this.applyFiltersOnFakeData(filters));
  }

  onCancelSearch() {
    this.setState({ searchTerm: '', isSearchingCustomers: false }, () => this.fetchCustomers());
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

  onSortCustomers(sortBy, sortOrder) {
    this.setState({ sortBy, sortOrder }, () => this.fetchCustomers());
  }

  onSelectSegment(segmentId) {
    const { router } = this.context;
    router.history.push(`/segment/${this.encodeParticipantId(segmentId)}`);
  }

  encodeParticipantId(participantId) {
    const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
    return hashids.encode(participantId);
  }

  createFullName(customers) {
    customers.forEach((customer, index) => {
      customers[index].name = `${customer.firstName} ${customer.lastName}`;
    });

    return customers;
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

  createFakeCustomers(appliedFilters = []) {
    this.setState({ isLoadingCustomers: true });

    setTimeout(() => {
      let customers = this.createFullName(createDummyCustomers(appliedFilters));
      this.createTableDataColumns(customers[0]);
      this.setState({ isLoadingCustomers: false, customers: { ...customers, items: customers, totalCount: 30 } });
    }, 1000);
  }

  applyFiltersOnFakeData(appliedFilters) {

    this.setState({ isLoadingCustomers: true, filters: JSON.stringify(appliedFilters) });

    setTimeout(() => {
      let customers = this.createFullName(createDummyCustomers(appliedFilters));
      this.createTableDataColumns(customers[0]);
      this.setState({ customers: { ...customers, items: customers, totalCount: 30 }, isLoadingCustomers: false, isApplyingFilters: false, isInitialLoad: false, isShowingAppliedFilters: !!appliedFilters.length, showSidePanel: false, isPaginating: false });
    }, 1000);
  }

  sentenseCase(value) {
    const newWord = value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
    return newWord.charAt(0).toUpperCase() + newWord.slice(1);
  }

  async fetchCustomers(isInitialLoad = false, segmentSelected = false, isLoadingCustomersViaSegment = false) {
    const { customerAnalyticsActions, EventHandler, configurations } = this.props;
    const {
      limit, currentPage, activeSegment, searchTerm, selectedDateRange, sortBy, sortOrder,
    } = this.state;
    this.setState({ isLoadingCustomers: true, isInitialLoad, isLoadingCustomersViaSegment });

    let segmentId = null;

    if (Object.keys(activeSegment).length || !segmentSelected) {
      segmentId = activeSegment.id;
    }

    let startTime = '';
    let endTime = '';

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    } else {
      startTime = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
      endTime = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
    }

    const data = [];

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
    } finally {
      this.setState({ isLoadingCustomers: false, isInitialLoad: false, isLoadingCustomersViaSegment: false, isPaginating: false, isSearchingCustomers: false });
    }
  }

  async applyFilters(appliedFilters) {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { limit, currentPage, searchTerm, startTime, endTime, sortBy, sortOrder } = this.state;
    this.setState({ isLoadingCustomers: true, filters: JSON.stringify(appliedFilters) });

    try {
      const fetchCustomersResult = await customerAnalyticsActions.fetchCustomers(limit, (currentPage - 1) * limit, null, appliedFilters, searchTerm, startTime, endTime, sortBy, sortOrder);
      let customers = fetchCustomersResult.data.Data.segmentParticipantList;
      customers = this.createFullName(customers);
      this.setState({ customers: { ...customers, items: customers, totalCount: fetchCustomersResult.data.Data.totalCount } });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingCustomers: false, isApplyingFilters: false, isInitialLoad: false, isShowingAppliedFilters: !!appliedFilters.length, showSidePanel: false, isPaginating: false });
    }
  }

  async onFetchSegments() {
    const { customerAnalyticsActions, fetchSegments, configurations } = this.props;
    const { limit, offset } = this.state;
    this.setState({ isLoadingSegments: true });
    try {
      const fetchSegmentsResult = await customerAnalyticsActions.fetchSegments(limit, offset);
      let segments = fetchSegmentsResult.data.Data;

      // if (!configurations.features.customerAnalytics) {
      //   const dummySegments = createDummySegments();
      //   dummySegments.forEach((segment) => segments.push(segment)); 
      // }
      customerAnalyticsActions.setSegments({
        items: segments,
      });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSegments: false });
    }
  }
  
  render() {
    const {
      windowDimensions, configurations, customerAnalyticsActions, EventHandler, classes, segments
    } = this.props;
    const { width } = windowDimensions;
    const { customers, isLoadingCustomers, isLoadingSegments, isSearchingCustomers, selectedDateRange, searchTerm, limit, offset, columns, isInitialLoad, activeSegment, showSidePanel, sidePanel, currentPage, segmentId, isApplyingFilters, isShowingAppliedFilters, isLoadingCustomersViaSegment, showMainContent, selectedCustomer, allCustomersCount, checkedCustomers, isPaginating, filters, loadSegments, sortBy, sortOrder, showUpgradeModal } = this.state;
    const { demoMode } = configurations;
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

    return (
      <SimpleLayoutExtended
        sidePanel={showSidePanel ? sidePanel : null}
        searchBar={(
          <TableSearch searchTerm={searchTerm} onSearchTermChange={this.onSearchTermChange} onCancelSearch={this.onCancelSearch} isSearchingCustomers={isSearchingCustomers} />
        )}
      >
        {
          isApplyingFilters ? (
            <div
              style={{
                width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Applying filters</span>
            </div>
          ) : (!customers.items.length && !activeSegment) ? (
            <ErrorState text="There are no customers to display yet!" style={{ height: 'calc(100vh - 260px)' }} />
          ) : (
            <div style={{ width: '100%', backgroundColor: '#fff' }}>
              <SegmentTags isLoadingSegments={isLoadingSegments} segments={segments} onViewAllSegments={this.onViewAllSegments} onSelectSegment={this.onSelectSegment} onCreateSegment={this.onCreateSegment} totalCustomersCount={customers.totalCount} width={width} demoMode={demoMode} configurations={configurations} />
              {
                (isShowingAppliedFilters) ? <SelectedFilters filters={filters} onRemoveFromFilter={this.onRemoveFromFilter} createSegment={this.onCreateSegment} /> : null
              }
              {
                (isLoadingCustomersViaSegment) ? (
                  <div
                    style={{
                      width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                    <span style={{ margin: 20 }}>Fetching customers</span>
                  </div>
                ) : (!customers.items.length && isShowingAppliedFilters) ? (
                  <ErrorState text='There are no customers who fit your preffered criteria' style={{ height: 'calc(100vh - 260px)' }} />
                ) : (
                  <div style={{ flex: 1, flexDirection: 'row' }}>
                    <div
                      style={{
                        flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: '10px 10px 10px 0px', display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #dfdfdf',
                      }}
                    >
                      <div
                        style={{
                          flex: 1, flexDirection: 'row', justifyContent: 'flex-start', display: 'flex', alignItems: 'center',
                        }}
                      >
                        <TableCount checkedItems={checkedCustomers} totalCount={customers.totalCount} limit={limit} currentPage={currentPage} offset={offset} isLoadingCustomers={isLoadingCustomers} isPaginating={isPaginating} />
                      </div>

                      <div
                        style={{
                          flex: 1, flexDirection: 'row', justifyContent: 'flex-end', display: 'flex', alignItems: 'center',
                        }}
                      >
                        <ActionBar windowDimensions={windowDimensions} actions={actions} actionBarStyle={{ justifyContent: 'flex-end' }} />
                        <ActionButton text="Engage" onClick={this.onEngageCustomers} show={checkedCustomers.length} preloading={isLoadingCustomers} />
                        <ActionButton text={<span>Add&nbsp;to&nbsp;segment</span>} onClick={this.onAddToSegment} show={checkedCustomers.length} preloading={isLoadingCustomers} />
                        <ActionButton text={<span>Create&nbsp;segment</span>} onClick={this.onCreateSegment} show={checkedCustomers.length} preloading={isLoadingCustomers} />
                        <IconButton icon="cloud_upload" onClick={this.onUploadCustomers} style={{ margin: '0px 5px 3px' }} toolTipText="Upload" show={!checkedCustomers.length} preloading={isLoadingCustomers} />
                        <IconButton icon="cloud_download" onClick={this.onDownloadCustomers} style={{ margin: '0px 5px 3px' }} toolTipText="Download" preloading={isLoadingCustomers} />
                        <IconButton icon="view_column" onClick={this.onOpenChangeColumns} style={{ margin: '0px 5px 3px' }} toolTipText="Columns" preloading={isLoadingCustomers} />
                        <IconButton icon="filter_list" onClick={() => this.onFilter(false)} style={{ margin: '0px 5px 3px' }} toolTipText="Filter" show={!checkedCustomers.length} preloading={isLoadingCustomers} />
                      </div>
                    </div>

                    <UpgradeModal open={showUpgradeModal} onCloseModal={this.onCloseModal} text={'Your account is limited to 4 segments. Upgrade to access new features such as:'} />    
                    <Customer onCheck={this.onCheck} onView={this.onView} checked={!activeSegment.id} limit={limit} offset={offset} page={parseInt(currentPage, 10) - 1} customers={customers} columns={columns} onPaginationNextPageChange={this.onPaginationNextPageChange} onSortCustomers={this.onSortCustomers} isLoadingCustomers={isLoadingCustomers} isPaginating={isPaginating} sortBy={sortBy} sortOrder={sortOrder} />
                  </div>
                )
              }
            </div>
          )
        }
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(Customers);
