/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, TextBlock } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import 'font-awesome/css/font-awesome.min.css';

import Landing from './Landing/index';
import withAuthentication from 'Utils/withAuthentication';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import backgroundImage from '../../images/empty_list_background.png';
import './index.css';

@connect((state) => ({
  history: state.history,
  configurations: state.configurations,
}),
(dispatch) => ({
  dispatch,
}))

class CustomerSegmentation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    configurations: PropTypes.object,
    windowDimensions: PropTypes.object,
    alertActions: PropTypes.object,
  };

  render() {
    const { windowDimensions, configurations, alertActions } = this.props;
    const { width } = windowDimensions;

    return (
      <SimpleLayoutExtended>
        <Helmet>
          <title>Customer Segmentation</title>
          <meta name="description" content="Customer Segmentation" />
        </Helmet>
        <div style={{ width: '100%', padding: width > 425 ? '0 10px 0 10px' : 0 }} className="customer-analytics-main">
          {
            configurations.features.customerAnalytics === null ? (
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                <span style={{ margin: 20 }}>Confirming if Customer Analytics feature is enabled for this account...</span>
              </div>
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
                              <h1 style={{ textAlign: 'center' }}>Customer Segmentation</h1>
                              <p style={{ textAlign: 'center' }}>Analytics is not active for your account. Please contact support to learn more.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            ) : (<Landing width={width} alertActions={alertActions} />)
          }
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(CustomerSegmentation);
