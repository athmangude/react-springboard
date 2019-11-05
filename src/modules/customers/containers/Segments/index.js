/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, TextBlock } from 'react-placeholder/lib/placeholders';
import Hashids from 'hashids';
import numeral from 'numeral';
import moment from 'moment';
import { LineChart, Line } from 'recharts';
import 'react-placeholder/lib/reactPlaceholder.css';

import Segment from './components/Segment';
import Customer from '../Customers/Customer';
import ViewSegment from './ViewSegment';
import EditSegment from './components/EditSegment';
import ViewCustomer from '../Customers/ViewCustomer';
import IconButton from 'SharedComponents/icon-button';
import Campaigns from './components/Campaign/NewCampaign';
import SearchBar from 'SharedComponents/search-bar';
import Filters from '../Customers/Actions/Filters/index';
import CircularButton from 'SharedComponents/circular-button';
import { createDummySegments } from '../components/DummyData';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';
import ActionButton from 'SharedComponents/action-button-styled';
import PaginationNext from 'SharedComponents/pagination-next';
import backgroundImage from 'Images/empty_list_background.png';
import withAuthentication from 'Utils/withAuthentication';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';


const raWFakedTouchpoints = {
  1: 'ABC',
  2: 'Aero Club',
  3: 'Aga Khan',
  4: 'Airport View',
  5: 'Airside',
  6: 'CAPITAL',
  7: 'Ciata Mall',
  8: 'CITY HALL',
  9: 'COFFEE SALES',
  10: 'Commissary',
  11: 'Diani',
  12: 'DOWNTOWN',
  13: 'ELDORET',
  14: 'Embassy House',
  15: 'GALLERIA',
  16: 'GARDEN CITY',
  17: 'GIGIRI',
  18: 'GREEENSPAN',
  19: 'HURLINGAM',
  20: 'Java Southfield',
  21: 'JUNCTION',
  22: 'Karen',
  23: 'Kenya Re',
  24: 'KERICHO',
  25: 'Kileleshwa',
  26: 'KIMATHI',
  27: 'KISUMU',
  28: 'KMA',
  29: 'LANDSIDE',
  30: 'Lenana Road',
  31: 'LUNGA LUNGA',
  32: 'Monrovia Street',
  33: 'NAIVASHA',
  34: 'NAKURU CBD',
  35: 'NAKURU WESTSIDE',
  36: 'Nanyuki',
  37: 'NYALI',
  38: 'Nyali',
  39: 'ORBIT',
  40: 'OUTSIDE CATERING',
  41: 'PARKLANDS',
  42: 'PHOENIX',
  43: 'PRESTIGE PLAZA',
  44: 'ROSSLYN',
  45: 'SARIT',
  46: 'SOUTH C',
  47: 'TERMINAL 2',
  48: 'TRM',
  49: 'UNIAFRIC',
  50: 'UPPERHILL',
  51: 'USIU',
  52: 'V/ARCADE',
  53: 'WAIYAKI WAY',
  54: 'WEST END',
  55: 'WESTLANDS SQUARE',
  56: 'YAYA',
  57: 'ADAMS',
};

function randomDate(start, end) {
  const random = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return `${[random.getFullYear(), random.getMonth() + 1, random.getDate()].join('-')} ${[random.getHours(), random.getMinutes(), random.getSeconds()].join(':')}`;
}

  @connect((state) => ({
    route: state.route,
  }),
  (dispatch) => ({
    customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    dispatch,
  }))

class Segments extends Component {
    static contextTypes = {
      router: PropTypes.object.isRequired,
    };

    static propTypes = {
      windowDimensions: PropTypes.object,
      appActions: PropTypes.object,
      customerAnalyticsActions: PropTypes.object,
      configurations: PropTypes.object,
      alertActions: PropTypes.object,
      EventHandler: PropTypes.object,
      route: PropTypes.object,
    }

    constructor(props) {
      super(props);

      const params = (new URL(document.location)).searchParams;
      this.state = {
        limit: 10,
        currentPage: params.get('page') ? parseInt(params.get('page'), 10) : 1,
        isLoadingSegments: false,
        isInitialLoad: false,
        isApplyingFilters: false,
        filters: null,
        sidePanel: null,
        showSidePanel: false,
        segments: {
          items: [],
          totalCount: 0,
        },
        customers: {
          items: [],
          totalCount: null,
        },
        view: 'grid',
      };

      this.onView = this.onView.bind(this);
      this.onEdit = this.onEdit.bind(this);
      this.onViewSegmentCustomers = this.onViewSegmentCustomers.bind(this);
      this.onViewCustomer = this.onViewCustomer.bind(this);
      this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
      this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
      this.onViewActions = this.onViewActions.bind(this);
      this.onChangeView = this.onChangeView.bind(this);
      this.createFakeSegments = this.createFakeSegments.bind(this);
    }

    componentDidMount() {
      const { appActions, configurations } = this.props;
      const { demoMode } = configurations;
      appActions.setRouteTitle('Segments');
      !demoMode ? this.fetchSegments(true) : this.createFakeSegments();
    }

    componentWillReceiveProps(newProps) {
      if(this.props.configurations.demoMode !== newProps.configurations.demoMode) {
        !newProps.configurations.demoMode ? this.fetchSegments(true) : this.createFakeSegments();
      }
    }

    componentWillUnmount() {
      const { appActions } = this.props;
      appActions.unsetRouteTitle();
    }

    onView(segment) {
      this.setState({ showSidePanel: true, sidePanel: (<ViewSegment onCloseSidePanel={this.onCloseSidePanel} segment={segment} />) });
    }

    onEdit(segment) {
      this.setState({ showSidePanel: true, sidePanel: (<EditSegment onCloseSidePanel={this.onCloseSidePanel} segment={segment} />) });
    }

    onViewCustomer(customer) {
      this.context.router.history.push(`/customers/${this.encodeSegmentId(customer.participantId)}/view`);
    }

    onViewSegmentCustomers(segment) {
      this.context.router.history.push(`/segment/${this.encodeSegmentId(segment.id)}`);
    }

    onCloseSidePanel() {
      this.setState({ showSidePanel: false, sidePanel: null });
    }

    onChangeView() {
      const { view } = this.state;

      if (view === 'grid') {
        return this.setState({ view: 'list' });
      }

      return this.setState({ view: 'grid' });
    }

    onPaginationNextPageChange({ offset }) {
      const { limit } = this.state;
      const nextPage = (offset / limit) + 1;

      this.setState({ currentPage: nextPage }, () => {
        const { router } = this.context;
        const { history } = router;
        const { route } = this.props;
        history.push(`${route.location.pathname}?page=${parseInt(nextPage, 10)}`);
        this.fetchSegments();
      });
    }

    onViewActions() {
      this.setState({ showSidePanel: true, sidePanel: (<Campaigns closeSidePanel={this.onCloseSidePanel} />) });
    }

    createFakeSegments() {
      const { segments } = this.state;

      this.setState({ isLoadingSegments: true, isInitialLoad: true });
  
      setTimeout(() => {
        this.setState({ segments: { ...segments, items: createDummySegments(), totalCount: 5 }, isLoadingSegments: false, isInitialLoad: false });
        }, 5000);
    }

    encodeSegmentId(segmentId) {
      const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
      return hashids.encode(segmentId);
    }

    async fetchSegments(isInitialLoad) {
      const { customerAnalyticsActions } = this.props;
      const { limit, currentPage, segments } = this.state;
      this.setState({ isLoadingSegments: true, isInitialLoad });

      try {
        const fetchSegmentsResult = await customerAnalyticsActions.fetchSegments(limit, (currentPage - 1) * limit);
        this.setState({ segments: { ...segments, items: fetchSegmentsResult.data.Data, totalCount: fetchSegmentsResult.data.Data.totalCount } });
      } catch (exception) {
        console.log(exception);
      } finally {
        this.setState({ isLoadingSegments: false, isInitialLoad: false });
      }
    }

    renderFilteredCustomers() {
      const { customers } = this.state;
      return (
        <div style={{ width: '100%' }}>
          <Row style={{ width: '100%', margin: 0, padding: 0 }}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
                {
                  customers.items.map((participant) => {
                    const lastSeen = moment(randomDate(new Date(2018, 11, 21), new Date(2019, 0, 21))).fromNow();
                    const fakedTouchpoints = Object.values(raWFakedTouchpoints);
                    const lastTouchpoint = fakedTouchpoints[Math.floor(Math.random() * fakedTouchpoints.length)];
                    return (
                      <Customer key={participant.participantId} participant={participant} lastSeen={lastSeen} lastTouchpoint={lastTouchpoint} onCheck={this.onCheck} onView={this.onViewCustomer} />
                    );
                  })
                }
              </div>
            </Col>
          </Row>
        </div>
      );
    }

    render() {
      const { windowDimensions, configurations, customerAnalyticsActions } = this.props;
      const { width } = windowDimensions;
      const { segments, customers, isLoadingSegments, isInitialLoad, showSidePanel, sidePanel, currentPage, isApplyingFilters, isShowingAppliedFilters, view } = this.state;
      const { demoMode } = configurations;

      return (
        <SimpleLayoutExtended
          sidePanel={showSidePanel ? sidePanel : null}
          actions={(
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10 }}>
              <IconButton icon={(view === 'grid') ? 'list' : 'grid_on'} large onClick={this.onChangeView} style={{ margin: '0px 5px 3px' }} toolTipText="Change View" />
            </div>
          )}
          searchBar={(
            <SearchBar placeholder="Search segments" searchAction={customerAnalyticsActions.searchSegments} itemDisplayProp="name" itemOnClickAction={this.onViewSegmentCustomers} />
          )}
          pagination={(
            <PaginationNext
              totalItems={segments.totalCount ? segments.totalCount : 0}
              perPage={10}
              onPageChange={this.onPaginationNextPageChange}
              isLoading={isLoadingSegments}
              currentPage={parseInt(currentPage, 10) - 1}
              visibleItems={segments.items.length}
            />
          )}
        >
          {
            configurations.features.customerAnalytics === null ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                <span style={{ margin: 20 }}>Confirming if Customer Analytics feature is enabled for this account...</span>
              </div>
            ) : isApplyingFilters ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                <span style={{ margin: 20 }}>Applying filters...</span>
              </div>
            ) : (isShowingAppliedFilters && !customers.items.length) ? (
              <GenericPagePlaceholder title="Customer Analytics" text="There are no customers that match your preferred criteria. Please modify your criteria!" width={width} />
            ) : (customers.items.length) ? (
              this.renderFilteredCustomers()
            ) : !configurations.features.customerAnalytics ? (
              <div style={{ margin: '50px auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%', margin: '0 auto', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: 'calc(80vh)' }}>
                  <ReactPlaceholder
                    ready={false}
                    customPlaceholder={(
                      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'row', width: width > 425 ? 500 : '100%', border: 'solid 2px #d9d9d9', padding: 10, backgroundColor: '#fafafa' }}>
                          <div style={{ width: 70, margin: 10, position: 'relative', top: 0, height: '100%' }}>
                            <RectShape style={{ width: 70, height: 70, borderRadius: '50%' }} color="#efefef" />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: 'calc(100% - 70px)', padding: 5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>
                              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', width: '50%' }}>
                                  <i className="material-icons" style={{ color: '#efefef', fontSize: 25, marginTop: -5 }}>flag</i>
                                  <div style={{ height: 20, width: 'calc(100% - 25px)' }}>
                                    <div style={{ width: '100%' }}>
                                      <TextBlock rows={1} color="#efefef" style={{ margin: '0 0 1px 0', height: 20 }} />
                                    </div>
                                    <div style={{ width: '80%' }}>
                                      <TextBlock rows={1} color="#efefef" style={{ margin: '0', height: 5 }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '10%', display: 'flex', alignItems: 'end' }}>
                                <TextBlock rows={1} color="#efefef" style={{ height: 8 }} />
                              </div>
                            </div>
                            <div style={{ width: '100%', margin: '20px 0' }}>
                              <div style={{ width: '100%', marginBottom: 3 }}>
                                <TextBlock rows={1} color="#efefef" />
                              </div>
                              <div style={{ width: '80%' }}>
                                <TextBlock rows={1} color="#efefef" style={{ height: 10 }} />
                              </div>
                            </div>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                              <RectShape color="transparent" style={{ height: 10, width: '7%', border: 'solid 1px #d9d9d9', borderRadius: 7 }} />
                              <RectShape color="transparent" style={{ height: 10, width: '7%', border: 'solid 1px #d9d9d9', borderRadius: 7 }} />
                              <RectShape color="transparent" style={{ height: 10, width: '7%', border: 'solid 1px #d9d9d9', borderRadius: 7 }} />
                            </div>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                              <RectShape color="transparent" style={{ height: 15, width: '15%', border: 'solid 1px #d9d9d9', borderRadius: 7 }} />
                              <RectShape color="transparent" style={{ height: 15, width: '15%', border: 'solid 1px #d9d9d9', borderRadius: 7 }} />
                              <RectShape color="transparent" style={{ height: 15, width: '15%', border: 'solid 1px #d9d9d9', borderRadius: 7 }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                          <div style={{ fontSize: 12, fontWeight: 'lighter', color: 'rgb(128, 130, 133)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                              <h1 style={{ textAlign: 'center' }}>Customer Analytics</h1>
                              <p style={{ textAlign: 'center' }}>Analytics is not active for your account. Please contact support to learn more.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            ) : isInitialLoad ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                <span style={{ margin: 20 }}>Fetching Segments and their info...</span>
              </div>
            ) : !segments.items.length ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontWeight: 'normal', fontSize: 24 }}>There are no Segments to display...yet!</h2>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {
                  (view === 'grid') ? (
                    <Col style={{ width: '100%', margin: 0, padding: 0 }}>
                      <Row xl={3} lg={3} md={3} sm={3} xs={3} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
                        {
                          segments.items.map((segment) => (
                            <div onClick={() => this.onViewSegmentCustomers(segment)} key={segment.id} style={{ padding: '0 10px 0 10px', borderRadius: 8, cursor: 'pointer' }}>
                              <div style={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 0px 4px', marginBottom: 20, marginTop: 10 }}>
                                <span style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', color: '#8898aa', fontSize: 14, padding: 0 }}>{segment.name}</span>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: '#525f7f', fontSize: '1.25rem' }}>
                                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    {numeral(segment.count).format('0.0 a').replace(' ', '')}
                                  </div>
                                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                      <i className="material-icons" style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem' }}>trending_up</i>
                                      &nbsp;
                                      <span style={{ color: '#2dce89', fontWeight: 300, fontSize: '.875rem', marginRight: '.5rem' }}>3.48%</span>
                                    </div>
                                    <div style={{ color: '#525f7f', fontWeight: 300, fontSize: 10, width: '100%', textAlign: 'right' }}>Since last month</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </Row>
                    </Col>
                  ) : (
                    <Row style={{ width: '100%', margin: 0, padding: 0 }}>
                      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
                          {
                            segments.items.map((segment) => (
                              <Segment key={segment.id} segment={segment} onView={this.onView} onEdit={this.onEdit} onViewSegmentCustomers={this.onViewSegmentCustomers} onViewActions={this.onViewActions} />
                            ))
                          }
                        </div>
                      </Col>
                    </Row>
                  )
                }
              </div>
            )
          }
        </SimpleLayoutExtended>
      );
    }
  }

export default withAuthentication(Segments);
