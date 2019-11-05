/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import * as appActions from 'Modules/shopping/containers/App/flux/actions';
import { withRouter } from 'react-router-dom';

class SettingsNavigationContainer extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    topRightComponent: PropTypes.node,
    topLeftComponent: PropTypes.node,
    searchBar: PropTypes.node,
    sidePanel: PropTypes.node,
    pagination: PropTypes.node,
    appActions: PropTypes.object,
  };

  componentDidMount() {
    const { appActions, location } = this.props;
    const pathArray = location.pathname.split('/');
    const title = pathArray[pathArray.length - 1].split('-').join(' ');
    appActions.setRouteTitle(title);
  }

  componentWillUnmount() {
    const { appActions } = this.props;
    appActions.unsetRouteTitle();
  }

  render() {
    const { topLeftComponent, topRightComponent, searchBar, sidePanel, pagination, children } = this.props;
    return (
      <SimpleLayoutExtended actions={topLeftComponent} tabs={topRightComponent} searchBar={searchBar} sidePanel={sidePanel} pagination={pagination}>
        <div style={{ flexDirection: 'column', width: '100%' }} className="audience-page">
          <div style={{ width: '100%', padding: 10 }}>
            {children}
          </div>
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default connect((state) => ({
  conversations: state.conversations,
  route: state.route,
}),
(dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  dispatch,
}))(withRouter(SettingsNavigationContainer))
