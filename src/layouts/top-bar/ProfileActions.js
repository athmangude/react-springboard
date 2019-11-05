import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Dropdown } from 'semantic-ui-react/dist/commonjs';
// import QRCode from 'qrcode.react';

import { extractInitials } from 'Utils/UtilFunctions';

import * as authenticationActions from 'Modules/voc/containers/Authentication/flux/actions';
import * as homeActions from 'Modules/voc/containers/Home/flux/actions';
import * as liveChatActions from 'Modules/voc/containers/Convo/flux/actions';
import * as csReportActions from 'Modules/voc/containers/Reports/CS/flux/actions';
import * as aodReportActions from 'Modules/voc/containers/Reports/AOD/flux/actions';

import './ProfileActions.css';

const ProfileActions = (props, context) => {
  let options = [
    {
      key: 'user',
      text: (
        <div
          style={{
            display: 'flex', alignItems: 'center', flexDirection: 'row', margin: '-11px -16px', padding: '10px 10px', backgroundColor: '#fff', color: '#FFF !important', cursor: 'default', borderTopRightRadius: 8, borderTopLeftRadius: 8,
          }}
        >
          {/*
          <div style={{ marginRight: 5 }}>
            <QRCode value="https://www.qa-ui.msurvey.co.ke" size={25} bgColor="#33597f" fgColor="#FFF" />
          </div>
          */}
          <div style={{ display: 'flex', flexDirection: 'column', color: '#FFF' }}>
            <span
              style={{
                color: '#58595b', fontWeight: 100, fontSize: 14, textTransform: 'capitalize',
              }}
            >
              {props.user}
            </span>
            <span
              style={{
                color: '#58595b', fontWeight: 100, fontSize: 10, textTransform: 'capitalize',
              }}
            >
              {props.account}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'activityLog',
      text: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <i className="material-icons" style={{ fontSize: 20, marginRight: 5 }}>list</i>
Activity Log
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <i className="material-icons" style={{ fontSize: 20, marginRight: 5 }}>settings</i>
Settings
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <i className="material-icons" style={{ fontSize: 20, marginRight: 5 }}>exit_to_app</i>
          Sign Out
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
  ];

  const collaboratingAccounts = props.authentication.user.accounts.filter((account) => account.id !== props.authentication.user['x-account-id']);

  options = options.concat(collaboratingAccounts.sort((a, b) => {
    if (a.profilename.toLowerCase() < b.profilename.toLowerCase()) {
      return -1;
    }

    if (a.profilename.toLowerCase() > b.profilename.toLowerCase()) {
      return 1;
    }
    return 0;
  }).map((account) => ({
    key: account.profilename,
    text: (
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start', maxWidth: 150, margin: 'auto -10px',
        }}
      >
        <div
          style={{
            height: 30, width: 30, borderRadius: 15, backgroundColor: '#4a4f57', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', marginRight: 5, textTransform: 'uppercase',
          }}
        >
          <span style={{ fontSize: 13 }}>{extractInitials(account.profilename)}</span>
        </div>
        <div style={{ width: 'calc(100% - 35px)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span
            style={{
              textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', width: 25, whiteSpace: 'nowrap',
            }}
          >
            {account.profilename}
          </span>
        </div>
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

  return (
    <Dropdown
      className="profile-menu"
      trigger={props.trigger}
      options={options}
      style={{ borderRadius: 0 }}
      icon={(
        <i style={{ float: 'right', color: '#4a4f57', margin: '0 10px' }} className="material-icons">more_vert</i>
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
