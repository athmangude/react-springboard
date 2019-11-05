/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const menu = [
  {
    icon: 'home',
    label: 'Home',
    path: '/',
  },
  {
    icon: 'smartphone',
    label: 'Surveys',
    path: '/surveys',
  },
  // {
  //   icon: 'person',
  //   label: 'Customers',
  //   path: '/customers',
  // },
  // {
  //   icon: 'people',
  //   label: 'Audience',
  //   path: '/audiences',
  // },
  {
    icon: 'sms',
    label: 'Live Chat',
    path: '/live-chat',
  },
  // {
  //   icon: 'notifications_active',
  //   label: 'Notifications',
  //   path: '/notifications',
  //   hasMenu: true,
  // },
];

function isCurrentRoute(pathname, actionPath) { // eslint-disable-line consistent-return
  if (actionPath.toLowerCase() === '/') {
    return pathname.toLowerCase() === actionPath.toLowerCase();
  }

  if (actionPath.toLowerCase() !== '/') {
    return pathname.toLowerCase().indexOf(actionPath.toLowerCase()) > -1;
  }
}

const BottomNavigation = (props, context) => (
  <div style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff', padding: '0 10px 0', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
    {
      menu.map((item, i) => {
        const isActive = isCurrentRoute(context.router.route.location.pathname, item.path);
        return (
          <Link className="white-on-hover" to={item.path} key={i} onClick={() => props.onLinkClicked(item.path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '10px 0px 0px', padding: '0 20px', position: 'relative', color: isCurrentRoute(context.router.route.location.pathname, item.path) ? '#fff' : '#d9d9d9' }}>
            <i className="material-icons" style={{ color: isActive ? '#33597f' : '#808285' }}>{item.icon}</i>
            <span style={{ fontSize: 10, maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isActive ? '#33597f' : '#808285' }}>{item.label}</span>
          </Link>
        );
      })
    }
  </div>
);

BottomNavigation.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default BottomNavigation;
