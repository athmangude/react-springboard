/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Spinner from 'react-spinner-material';

import SegmentTags from '../../CustomerSegmentation/Segments/components/Tags';
import Age from './Age';
import Gender from './Gender';
import LSM from './LSM';
import KeyValueList from './KeyValueList';
import HorizontalBarChart from './HorizontalBarChart';
import Filters from '../../CustomerSegmentation/Customers/Actions/Filters';
import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button-styled';
import DateRangePicker from 'SharedComponents/mwamba-date-range-picker';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';
import withAuthentication from 'Utils/withAuthentication';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import * as customerAnalyticsActions from '../flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';

const demographics = {
  ageStats: null,
  genderStats: null,
  lsmStats: null,
  regionStats: null,
  countyStats: null,
  occupationStats: null,
  educationLevelStats: null,
  householdSpendingStats: null,
  bankedStats: null,
  internetAccessStats: null,
};

@connect(() => ({}),
  (dispatch) => ({
    customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    dispatch,
  }))

class Demographic extends Component {
  static propTypes = {
    windowDimensions: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    appActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    configurations: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoadingDemographics: false,
      activeSegment: {},
      demographics,
      sidePanel: null,
      showSidePanel: false,
      appliedFilters: [],
      isFiltered: null,
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    this.onFilter = this.onFilter.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onChangeSegment = this.onChangeSegment.bind(this);
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle('Demographic');
    this.fetchDemographics();
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onFilter() {
    const { customerAnalyticsActions, alertActions, windowDimensions, EventHandler } = this.props;
    const { width } = windowDimensions;
    const { appliedFilters } = this.state;
    this.setState({ showSidePanel: true, sidePanel: (<Filters appliedFilters={JSON.stringify(appliedFilters)} onCloseSidePanel={this.onCloseSidePanel} width={width} applyFilters={this.onApplyFilters} customerAnalyticsActions={customerAnalyticsActions} alertActions={alertActions} EventHandler={EventHandler} />) });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onApplyFilters(appliedFilters) {
    this.setState({ appliedFilters, isFiltered: true }, () => {
      this.onCloseSidePanel();
      this.fetchDemographics();
    });
  }

  onDateRangeChange({ from, to }) {
    this.setState({ startDate: moment(from).startOf('day').format('YYYY-MM-DD HH:mm:ss'), endDate: moment(to).endOf('day').format('YYYY-MM-DD HH:mm:ss') }, () => this.fetchDemographics());
  }

  onChangeSegment(activeSegment) {
    this.setState({ activeSegment }, () => this.fetchDemographics());
  }

  async fetchDemographics() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { activeSegment, startDate, endDate, appliedFilters } = this.state;
    this.setState({ isLoadingDemographics: true });

    try {
      const fetchDemographicsResult = await customerAnalyticsActions.fetchDemographics({ startDate, endDate }, activeSegment, appliedFilters);
      this.setState({ demographics: fetchDemographicsResult.data.Data ? fetchDemographicsResult.data.Data : demographics });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingDemographics: false });
    }
  }

  render() {
    const { windowDimensions, configurations, EventHandler, alertActions } = this.props;
    const { width } = windowDimensions;
    const { demographics, isLoadingDemographics, showSidePanel, sidePanel, isFiltered, startDate, endDate } = this.state;

    return (
      <SimpleLayoutExtended
        sidePanel={showSidePanel ? sidePanel : null}
        action={(size) => {
          if (size === 'small') {
            return (
              <CircularButton className="primary cta" icon="filter_list" small color="#002366" onClick={this.onFilter} />
            );
          }

          return (
            <ActionButton
              className="primary"
              icon="add"
              text={(isFiltered) ? (<span>Modify&nbsp;Filters</span>) : (<span>Apply&nbsp;Filters</span>)}
              onClick={this.onFilter}
              large
              style={{
                backgroundColor: '#002366', color: '#fff', width: 200, height: 50, borderRadius: 25, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
              }}
            />
          );
        }}
        actions={(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10 }}>
            <DateRangePicker handleDateRangeChanged={this.onDateRangeChange} defaultStart={startDate} defaultEnd={endDate} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
          </div>
        )}
      >
        {
          configurations.features.customerAnalytics === null ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Confirming if Customer Analytics feature is enabled for this account...</span>
            </div>
          ) : !configurations.features.customerAnalytics ? (
            <GenericPagePlaceholder title="Customer Analytics" text="Analytics is not active for your account. Please contact support to learn more." width={width} />
          ) : isLoadingDemographics ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Fetching customer demographic info...</span>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <SegmentTags onChangeSegment={this.onChangeSegment} showActions={false} showDescription />
              <Row style={{ width: '100%', margin: 0, padding: 0 }}>
                <Age data={demographics.ageStats} width={width} />
                <Gender data={demographics.genderStats} width={width} />
                <LSM data={demographics.lsmStats} width={width} />
              </Row>
              <Row style={{ width: '100%', margin: 0, padding: 0 }}>
                <KeyValueList data={demographics.regionStats} title="Regions" width={width} />
                <KeyValueList data={demographics.countyStats} title="Counties" width={width} />
              </Row>
              <Row style={{ width: '100%', margin: 0, padding: 0 }}>
                <HorizontalBarChart data={demographics.educationLevelStats} title="Education Levels" width={width} large />
                <HorizontalBarChart data={demographics.occupationStats} title="Occupations" width={width} large />
                <HorizontalBarChart data={demographics.householdSpendingStats} title="Household Spendings" width={width} />
                <HorizontalBarChart data={demographics.bankedStats} title="Banked" width={width} />
                <HorizontalBarChart data={demographics.internetAccessStats} title="Internet Access" width={width} />
              </Row>
            </div>
          )
        }
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(Demographic);
