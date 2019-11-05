/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Accordion from 'SharedComponents/mwamba-accordion/Accordion';
import NetworkID from './networkID';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}))
class CommDomain extends Component {
  static propTypes = {
    country: PropTypes.object,
    countries: PropTypes.array,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    telcoActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.fetchCommDomains = this.fetchCommDomains.bind(this);
  }

  state = {
    commDomains: [],
    isLoading: false,
  }

  componentDidMount() {
    this.fetchCommDomains();
  }

  async fetchCommDomains() {
    const { alertActions, EventHandler, telcoActions } = this.props;
    try {
      this.setState({ isLoading: true });
      const commDomainsResult = await telcoActions.fetchCommDomains();
      alertActions.addAlert({ type: 'success', message: 'Comm Domains fetched succesfully!' });
      this.setState({ commDomains: commDomainsResult.data.Data });
    } catch (exception) {
      let errorMessage = 'Oops! Something went wrong and we could not fetch commDomains. Please try again later.';
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
    const { country, countries, alertActions, EventHandler, telcoActions } = this.props;
    const { commDomains, isLoading } = this.state;
    const commDomainsList = commDomains.filter((value) => value.countryId === country.id);
    return (
      isLoading ? (
        <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
          <span style={{ margin: 20 }}>Fetching Comm Domains....</span>
        </div>
      ) : commDomains.length === 0 ? (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0px 10px 0px', flexDirection: 'column', marginBottom: '20px', marginTop: '20px'}}>
          <span style={{ textAlign: 'center' }}>
          We could not find any Comm Domains.
          </span>
        </div>
      ) : (
        <Accordion allowMultipleOpen={false} accordionStyle={{ backgroundColor: 'transparent', padding: '5px 2px', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', borderTop:"none", alignItems: 'center', marginLeft:'40px', }}>
          {
            commDomainsList[0].commDomains.map((commDomain) => (
              <div label={commDomain} key={commDomain}>
                <NetworkID country={country} countries={countries} commDomain={commDomain} commDomains={commDomains} alertActions={alertActions} EventHandler={EventHandler} telcoActions={telcoActions} />
              </div>

            ))
          }
        </Accordion>
      )
    );
  }
}
export default CommDomain;
