import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Dropdown } from 'semantic-ui-react/dist/commonjs';
// import QRCode from 'qrcode.react';

import * as authenticationActions from 'Modules/shopping/containers/Authentication/flux/actions';
import * as homeActions from 'Modules/shopping/containers/Home/flux/actions';
import * as liveChatActions from 'Modules/shopping/containers/Convo/flux/actions';
import * as csReportActions from 'Modules/shopping/containers/Reports/CS/flux/actions';
import * as aodReportActions from 'Modules/shopping/containers/Reports/AOD/flux/actions';

import './ProfileActions.css';

const ProfileActions = (props, context) => {
  let options = [
    {
      key: 'user',
      text: (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', margin: '-11px -16px', padding: '10px 10px', backgroundColor: '#fff', color: '#FFF !important', cursor: 'default', borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
          {/*
          <div style={{ marginRight: 5 }}>
            <QRCode value="https://www.qa-ui.msurvey.co.ke" size={25} bgColor="#33597f" fgColor="#FFF" />
          </div>
          */}
          <div style={{ display: 'flex', flexDirection: 'column', color: '#FFF' }}>
            <span style={{ color: '#58595b', fontWeight: 100, fontSize: 14, textTransform: 'capitalize' }}>{props.user}</span>
            <span style={{ color: '#58595b', fontWeight: 100, fontSize: 10, textTransform: 'capitalize' }}>{props.account}</span>
          </div>
        </div>
      ),
    },
  ];

  const collaboratingAccounts = props.authentication.user.accounts.filter((account) => account.id !== props.authentication.user['x-account-id']);

  options = options.concat(collaboratingAccounts.sort((a, b) => a.profilename.toUpperCase() > b.profilename.toUpperCase()).map((account) => ({
    key: account.profilename,
    text: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: -10, maxWidth: 104 }}>
        <div style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: '#33597f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', marginRight: 5, textTransform: 'uppercase' }}><span>{account.profilename[0]}</span></div>
        <div style={{ maxWidth: 'calc(100% - 30px)', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', width: 25, whiteSpace: 'nowrap' }}>{account.profilename}</span></div>
      </div>
    ),
    onClick: () => {
      try {
        props.homeActions.clearFeed();
        props.liveChatActions.unMount();
        props.csReportActions.clearCSReports();
        props.aodReportActions.clearAODReports();
      } catch (exception) {
        console.log(exception);
      } finally {
        props.authenticationActions.switchAccount(props.authentication.user, account.id);
      }
    },
  })));
    // {
    //   key: 'stars',
    //   text: (
    //     <div>
    //       <Icon name="star" />Your Stars
    //     </div>
    //   ),
    // },
    // {
    //   key: 'explore',
    //   text: (
    //     <div>
    //       <Icon name="search" />Explore
    //     </div>
    //   ),
    // },
    // {
    //   key: 'integrations',
    //   text: (
    //     <div>
    //       <Icon name="plug" />Integrations
    //     </div>
    //   ),
    // },
    // {
    //   key: 'help',
    //   text: (
    //     <div>
    //       <Icon name="help circle" />Help
    //     </div>
    //   ),
    // },
  options = options.concat([
    {
      key: 'activityLog',
      text: (
        <div>
          <Icon name="list" />Activity Log
        </div>
      ),
      onClick: () => {
        props.onLinkClicked('/activity-log');
        context.router.history.push('/activity-log');
      },
    },
    {
      key: 'settings',
      text: (
        <div>
          <Icon name="setting" />Settings
        </div>
      ),
      onClick: () => {
        props.onLinkClicked('/settings');
        context.router.history.push('/settings/audiences');
      },
    },
    {
      key: 'sign-out',
      text: (
        <div>
          <Icon name="sign out" />Sign Out
        </div>
      ),
      onClick: () => {
        props.homeActions.clearFeed();
        props.liveChatActions.unMount();
        props.onLinkClicked('sign-out');
        props.authenticationActions.signOut();
        context.router.history.push('/sign-in');
      },
    },
  ]);

  return (
    <Dropdown
      className="profile-menu"
      trigger={props.trigger}
      options={options}
      style={{ borderRadius: 0 }}
      icon={(
        <i style={{ float: 'right', color: '#fff', margin: '0 10px' }} className="material-icons">more_vert</i>
      )}
      height={400}
    />
  );
};

ProfileActions.contextTypes = {
  router: PropTypes.object.isRequired,
};

ProfileActions.propTypes = {
  user: PropTypes.string.isRequired,
  trigger: PropTypes.node.isRequired,
  authenticationActions: PropTypes.object.isRequired,
  homeActions: PropTypes.object.isRequired,
  liveChatActions: PropTypes.object.isRequired,
  csReportActions: PropTypes.object.isRequired,
  aodReportActions: PropTypes.object.isRequired,
  onLinkClicked: PropTypes.func,
  account: PropTypes.string.isRequired,
  authentication: PropTypes.object.isRequired,
};

export default connect((state) => ({ authentication: state.authentication }), (dispatch) => ({
  authenticationActions: bindActionCreators(authenticationActions, dispatch),
  homeActions: bindActionCreators(homeActions, dispatch),
  liveChatActions: bindActionCreators(liveChatActions, dispatch),
  csReportActions: bindActionCreators(csReportActions, dispatch),
  aodReportActions: bindActionCreators(aodReportActions, dispatch),
}))(ProfileActions);
