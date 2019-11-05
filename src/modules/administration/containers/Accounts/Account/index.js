import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import withAdminAuthentication from 'Utils/withAdminAuthentication';
import SimpleLayout from 'Layouts/simple-layout';
import AccountConfiguration from './account-configuration/index';

import * as accountsActions from '../flux/actions';
import * as appActions from 'Modules/voc/containers/App/flux/actions';

// import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
  accounts: state.accounts,
  route: state.route,
}), (dispatch) => ({
  accountsActions: bindActionCreators(accountsActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))
class Account extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    accounts: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onfetchAccountDetails = this.onfetchAccountDetails.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);

    if (!this.props.accounts.industries) {
      // fetch industries if they are not available
      this.fetchIndustries();
    }
  }

  state = {
    accountDetails: null,
    isFetchingAccountDeatails: false,
  }

  componentWillMount() {
    const { id } = this.context.router.route.match.params;
    this.onfetchAccountDetails(id);
  }

  componentWillReceiveProps(nextProps) {
    const nextRoutesObject = nextProps.route;
    const currentRoutesObject = this.props.route;

    if (currentRoutesObject.location.pathname !== nextRoutesObject.location.pathname) {
      const id = nextRoutesObject.location.pathname.split('/')[3];
      this.onfetchAccountDetails(id);
    }
  }

  async onfetchAccountDetails(id) {
    this.setState({ isFetchingAccountDeatails: true });

    try {
      const fetchAccountDetailsResult = await this.props.accountsActions.fetchAccount(id);
      
      this.setState({ accountDetails: fetchAccountDetailsResult.data.Data });
      this.props.appActions.setRouteTitle(fetchAccountDetailsResult.data.Data.profilename);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingAccountDeatails: false });
    }
  }

  onUpdateSettings(settings) {
    // TODO: update settings
    this.setState({ settings });
  }

  async fetchIndustries() {
    this.setState({ isFetchingIndustries: true });
    try {
      const fetchIndustriesResult = await this.props.accountsActions.fetchIndustries();
      this.props.accountsActions.setIndustries(fetchIndustriesResult.data.Data);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingIndustries: false });
    }
  }

  render() {
    return (
      <SimpleLayout className="account">
        <div style={{ position: 'relative', display: 'flex', width: '100%', flexDirection: 'column' }}>
          <AccountConfiguration {...this.props} {...this.state} industries={this.props.accounts.industries} onfetchAccountDetails={this.onfetchAccountDetails} />
        </div>
      </SimpleLayout>
    );
  }
}

export default withAdminAuthentication(Account);
