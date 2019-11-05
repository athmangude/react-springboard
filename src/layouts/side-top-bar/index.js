import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Alerts from 'Modules/shopping/containers/App/Alerts';
import * as EventHandler from 'Utils/EventHandler';

import * as appActions from 'Modules/shopping/containers/App/flux/actions';
import * as authenticationActions from 'Modules/shopping/containers/Authentication/flux/actions';

import SideTopBar from './SideTopBar';

const SideTopBarLayout = (props) => (
  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
    <div style={{ width: '100%' }}>
      <SideTopBar {...props} EventHandler={EventHandler}>
        <div fluid style={{ position: 'relative', margin: 0, padding: 0 }}>
          <Alerts />
          {props.children}
        </div>
      </SideTopBar>
    </div>
  </div>
);

SideTopBarLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default connect((state) => ({
  ...state,
}), (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  authenticationActions: bindActionCreators(authenticationActions, dispatch),
  dispatch,
}))(SideTopBarLayout);
