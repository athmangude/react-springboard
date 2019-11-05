import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Dropdown } from 'semantic-ui-react';
import QRCode from 'qrcode.react';

import * as authenticationActions from 'Modules/voc/containers/Authentication/flux/actions';

import './ProfileActions.css';

const ProfileActions = (props, context) => {
  const options = [
    {
      key: 'user',
      text: (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', margin: '-11px -16px', padding: '3px 5px', backgroundColor: '#33597f', color: '#FFF !important', cursor: 'default' }}>
          <div style={{ marginRight: 5 }}>
            <QRCode value="https://www.qa-ui.msurvey.co.ke" size={25} bgColor="#33597f" fgColor="#FFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', color: '#FFF' }}>
            <span style={{ color: '#FFF', fontWeight: 100, fontSize: 8 }}>{props.user}</span>
            <span style={{ color: '#FFF', fontWeight: 100, fontSize: 8 }}>Java House</span>
            <span style={{ color: '#FFF', fontWeight: 100, fontSize: 8 }}>12348900</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stars',
      text: (
        <div>
          <Icon name="star" />Your Stars
        </div>
      ),
    },
    {
      key: 'explore',
      text: (
        <div>
          <Icon name="search" />Explore
        </div>
      ),
    },
    {
      key: 'integrations',
      text: (
        <div>
          <Icon name="plug" />Integrations
        </div>
      ),
    },
    {
      key: 'help',
      text: (
        <div>
          <Icon name="help circle" />Help
        </div>
      ),
    },
    {
      key: 'settings',
      text: (
        <div>
          <Icon name="setting" />Settings
        </div>
      ),
    },
    {
      key: 'sign-out',
      text: (
        <div>
          <Icon name="sign out" />Sign Out
        </div>
      ),
      onClick: () => {
        props.authenticationActions.signOut();
        context.router.route('/sign-in');
      },
    },
  ];
  return (
    <Dropdown upward className="profile-menu" trigger={props.trigger} options={options} style={{ borderRadius: 0 }} pointing="left" />
  );
};

ProfileActions.contextTypes = {
  router: PropTypes.object.isRequired,
};

ProfileActions.propTypes = {
  user: PropTypes.string.isRequired,
  trigger: PropTypes.node.isRequired,
  authenticationActions: PropTypes.object.isRequired,
};

export default connect((state) => ({ authentication: state.authentication }), (dispatch) => ({ authenticationActions: bindActionCreators(authenticationActions, dispatch) }))(ProfileActions);
