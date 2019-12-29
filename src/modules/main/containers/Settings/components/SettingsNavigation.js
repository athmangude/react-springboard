import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './SettingsNavigation.css';

function onClick(EventHandler, action) {
  setTimeout(() => {
    EventHandler.trackEvent({ category: 'navigation', action: 'click', value: action });
  }, 3000);
}

const SettingsNavigation = (props, context) => {
  const { path } = context.router.route.match;
  return (
    <div className="settings-navigation" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'start', borderLeft: 'solid 1px #d9d9d9', height: '100%' }}>
      <div className={`link-container ${path.indexOf('/settings/account') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/account')} className={`link parent-link ${path.indexOf('/settings/account') > -1 ? 'active' : ''}`} to="/settings/account"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Account</span></Link>
        {
          path.indexOf('/settings/account') > -1 ? (
            <div style={{ margin: '10px 10px 10px 10px' }}>
              <Link onClick={() => onClick(props.EventHandler, '/settings/account/nps-dimensions')} className={`link ${path.indexOf('/settings/account/nps-dimensions') > -1 ? 'active' : ''}`} to="/settings/account/nps-dimensions"><span>NPS Dimensions</span></Link>
            </div>
          ) : null
        }
      </div>
      <div className={`link-container ${path.indexOf('/settings/audiences') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/audiences')} className={`link parent-link ${path.indexOf('/settings/audiences') > -1 ? 'active' : ''}`} to="/settings/audiences"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Audiences</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/collaborators') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/collaborators')} className={`link parent-link ${path.indexOf('/settings/collaborators') > -1 ? 'active' : ''}`} to="/settings/collaborators"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Collaborators</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/me') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/me')} className={`link parent-link ${path.indexOf('/settings/me') > -1 ? 'active' : ''}`} to="/settings/me"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Me</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/touch-points') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/touch-points')} className={`link parent-link ${path.indexOf('/settings/touch-points') > -1 ? 'active' : ''}`} to="/settings/touch-points"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Touchpoints</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/incentives-usage') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/incentives-usage')} className={`link parent-link ${path.indexOf('/settings/incentives-usage') > -1 ? 'active' : ''}`} to="/settings/incentives-usage"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Incentives Usage</span></Link>
      </div>
    </div>
  );
};

SettingsNavigation.contextTypes = {
  router: PropTypes.object.isRequired,
};

SettingsNavigation.propTypes = {
  EventHandler: PropTypes.func,
};

export default SettingsNavigation;
