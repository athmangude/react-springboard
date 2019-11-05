/* eslint-disable jsx-a11y/href-no-hash, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';
import numeral from 'numeral';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import IconButton from 'SharedComponents/icon-button';
import MwambaLabelWithIcon from 'SharedComponents/mwamba-label-with-icon';
import * as customerAnalyticsActions from 'Modules/analytics/containers/flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';

const spend = {
  customers: {
    new: {
      current: 189,
      previous: 160,
    },
    weekly: {
      current: 1037,
      previous: 1600,
    },
    monthly: {
      current: 75000,
      previous: 56990,
    },
  },
};
const newCustomers = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const returningCustomers = [
  {name: 'Page A', uv: 3000, pv: 2340, amt: 2000},
  {name: 'Page B', uv: 2340, pv: 1238, amt: 2210},
  {name: 'Page C', uv: 1270, pv: 1020, amt: 2290},
  {name: 'Page D', uv: 3420, pv: 2348, amt: 2000},
  {name: 'Page E', uv: 1450, pv: 1330, amt: 2181},
  {name: 'Page F', uv: 2030, pv: 1880, amt: 2500},
  {name: 'Page G', uv: 1320, pv: 2550, amt: 2100},
];

const frequentCustomers = [
  {name: 'Page A', uv: 4234, pv: 5463, amt: 2000},
  {name: 'Page B', uv: 2342, pv: 2343, amt: 2210},
  {name: 'Page C', uv: 2344, pv: 2343, amt: 2290},
  {name: 'Page D', uv: 3453, pv: 3555, amt: 2000},
  {name: 'Page E', uv: 4653, pv: 2343, amt: 2181},
  {name: 'Page F', uv: 2341, pv: 5334, amt: 2500},
  {name: 'Page G', uv: 1320, pv: 2432, amt: 2100},
];

@connect((state) => ({
  user: state.authentication.user,
}),
(dispatch) => ({
  customerAnalyticsActions: bindActionCreators(customerAnalyticsActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))

export default class Landing extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    width: PropTypes.number,
    analytics: PropTypes.object,
    user: PropTypes.object,
    customerAnalyticsActions: PropTypes.object,
    alertActions: PropTypes.object,
    appActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onGoToSegments = this.onGoToSegments.bind(this);
  }

  state = {
    isLoadingSpendSummary: false,
    isLoadingDemographics: false,
    spend,
  }

  componentDidMount() {
    const { appActions } = this.props;
    appActions.setRouteTitle('Segments');
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  onGoToSegments() {
    const { router } = this.context;
    const path = '/customers/segments';
    router.history.push(path);
  }

  render() {
    const { isLoadingSpendSummary, isLoadingDemographics, demographics, spend } = this.state;
    const { user, width, customerAnalyticsActions, alertActions } = this.props;

    if (isLoadingSpendSummary || isLoadingDemographics) {
      return (
        <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
          <span style={{ margin: 20 }}>Loading Customer Analytics modules...</span>
        </div>
      );
    }

    let currency = 'KES';
    const { countryId } = user.account;
    if (countryId) {
      currency = user.countries.find((country) => country.id === countryId).currencyCode;
    }

    return (
      <div style={{ width: '100%' }}>
        <Row style={{ width: '100%', margin: 0, padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 20, padding: '0 10px 0 10px', width: '100%' }}>
            <i className="material-icons" style={{ marginRight: 10, color: '#6d6e71' }}>attach_money</i>
            <div style={{ fontSize: 26, fontWeight: 600, color: '#6d6e71', marginRight: 10, height: 35, display: 'flex', lexDirection: 'row', alignItems: 'center' }}>Segments</div>
            <IconButton onClick={this.onGoToSegments} icon="arrow_right_alt" style={{ fontSize: 20 }} />
          </div>

          <Row style={{ width: '100%', margin: 0, padding: 0 }}>
            <Col xl={4} lg={4} md={4} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
                <div style={{ paddingBottom: 5, borderBottom: 'solid 1px #e2e4eb', fontSize: 20, fontWeight: 900, color: '#6d6e71', textTransform: 'capitalize' }}>New Customers</div>
                <div style={{ width: '100%', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', height: '100px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', width: '100%' }}>
                        <i className="material-icons" style={{ marginRight: 10, color: '#52BF8A' }}>person_add</i>
                        <div style={{ fontSize: 20, color: '#6d6e71' }}>{numeral(100).format('0 a')}</div>
                        <div style={{ fontSize: 11, color: '#6d6e71' }}>
                            &nbsp;
                            (10%)
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left', marginTop: 5 }}>New Customers</div>
                      <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left', marginTop: 5 }}>in the last 7 days</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <LineChart width={300} height={100} data={newCustomers}>
                        <Line type="monotone" dataKey="pv" stroke="#52BF8A" strokeWidth={2} />
                      </LineChart>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xl={4} lg={4} md={4} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
                <div style={{ paddingBottom: 5, borderBottom: 'solid 1px #e2e4eb', fontSize: 20, fontWeight: 900, color: '#6d6e71', textTransform: 'capitalize' }}>Returning Customers</div>
                <div style={{ width: '100%', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', height: '100px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', width: '100%' }}>
                        <i className="material-icons" style={{ marginRight: 10, color: '#52BF8A' }}>person_add</i>
                        <div style={{ fontSize: 20, color: '#6d6e71' }}>{numeral(10).format('0 a')}</div>
                        <div style={{ fontSize: 11, color: '#6d6e71' }}>
                            &nbsp;
                            (14%)
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left', marginTop: 5 }}>Returning Customers</div>
                      <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left', marginTop: 5 }}>in the last 7 days</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <LineChart width={300} height={100} data={returningCustomers}>
                        <Line type="monotone" dataKey="pv" stroke="#52BF8A" strokeWidth={2} />
                      </LineChart>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xl={4} lg={4} md={4} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
                <div style={{ paddingBottom: 5, borderBottom: 'solid 1px #e2e4eb', fontSize: 20, fontWeight: 900, color: '#6d6e71', textTransform: 'capitalize' }}>Frequent Customers</div>
                <div style={{ width: '100%', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', height: '100px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-start', width: '100%' }}>
                        <i className="material-icons" style={{ marginRight: 10, color: '#52BF8A' }}>person_add</i>
                        <div style={{ fontSize: 20, color: '#6d6e71' }}>{numeral(10).format('0 a')}</div>
                        <div style={{ fontSize: 11, color: '#6d6e71' }}>
                            &nbsp;
                            (14%)
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left', marginTop: 5 }}>Frequent Customers</div>
                      <div style={{ fontSize: 11, color: '#6d6e71', width: '100%', textAlign: 'left', marginTop: 5 }}>in the last 7 days</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <LineChart width={300} height={100} data={frequentCustomers}>
                        <Line type="monotone" dataKey="pv" stroke="#52BF8A" strokeWidth={2} />
                      </LineChart>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}
