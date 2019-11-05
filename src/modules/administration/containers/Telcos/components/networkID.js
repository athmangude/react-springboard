/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NetworkIDListItem from './networkIDListItem';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}))
class NetworkID extends Component {
  static propTypes = {
    commDomain: PropTypes.string,
    commDomains: PropTypes.array,
    country: PropTypes.object,
    countries: PropTypes.array,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    telcoActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.fetchNetworkIDs = this.fetchNetworkIDs.bind(this);
  }

  state = {
    networkIds: [],
    isLoading: false,
    isActive: true,
  }

  componentDidMount() {
    this.fetchNetworkIDs();
  }

  async fetchNetworkIDs() {
    const { alertActions, EventHandler, telcoActions, country } = this.props;
    const { isActive } = this.state;
    try {
      this.setState({ isLoading: true });
      const networkIDResult = await telcoActions.fetchNetworkIDs(country.id, isActive);
      alertActions.addAlert({ type: 'success', message: 'Comm Domains fetched succesfully!' });
      this.setState({ networkIds: networkIDResult.data.Data });
    } catch (exception) {
      let errorMessage = 'Oops! Something went wrong and we could not fetch Network IDs. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      alertActions.addAlert({ type: 'error', message: errorMessage });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { commDomain, commDomains, country, countries, alertActions, EventHandler, telcoActions } = this.props;
    const { networkIds, isLoading } = this.state;
    return (
      isLoading ? (
        <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
          <span style={{ margin: 20 }}>Fetching Network IDs...</span>
        </div>
      ) : networkIds.length === 0 ? (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', flexDirection: 'column', marginBottom: '20px', marginTop: '20px', marginLeft: '100px'}}>
          <span style={{ textAlign: 'center' }}>
          We could not find any Network IDs.
          </span>
        </div>
      ) : (
        <div>
          {
            networkIds.filter((value) => value.commDomain === commDomain.toLowerCase()).map((networkId) => (
              <NetworkIDListItem networkId={networkId} commDomain={commDomain} commDomains={commDomains} country={country} countries={countries} alertActions={alertActions} EventHandler={EventHandler} telcoActions={telcoActions} />
            ))
          }
        </div>
      )
    );
  }
}
export default NetworkID;
