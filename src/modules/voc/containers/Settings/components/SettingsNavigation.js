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
      {/* <div className={`link-container ${path.indexOf('/settings/subscriptions') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/subscriptions')} className={`link parent-link ${path.indexOf('/settings/subscriptions') > -1 ? 'active' : ''}`} to="/settings/subscriptions"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Subscriptions</span></Link>
      </div> */}
      <div className={`link-container ${path.indexOf('/settings/web-hook-events') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/web-hook-events')} className={`link parent-link ${path.indexOf('/settings/web-hook-events') > -1 ? 'active' : ''}`} to="/settings/web-hook-events"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Web Hooks</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/reminders') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/reminders')} className={`link parent-link ${path.indexOf('/settings/reminders') > -1 ? 'active' : ''}`} to="/settings/reminders"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Reminders</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/reinvites') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/reinvites')} className={`link parent-link ${path.indexOf('/settings/reinvites') > -1 ? 'active' : ''}`} to="/settings/reinvites"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Reinvites</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/delays') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/delays')} className={`link parent-link ${path.indexOf('/settings/delays') > -1 ? 'active' : ''}`} to="/settings/delays"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Delays</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/business-numbers') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/business-numbers')} className={`link parent-link ${path.indexOf('/settings/business-numbers') > -1 ? 'active' : ''}`} to="/settings/business-numbers"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Business Numbers</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/payments') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/payments')} className={`link parent-link ${path.indexOf('/settings/payments') > -1 ? 'active' : ''}`} to="/settings/payments"><span style={{ fontSize: 16, fontWeight: 'bold' }}>Payments</span></Link>
      </div>
      <div className={`link-container ${path.indexOf('/settings/dnd-lists') > -1 ? 'active' : ''}`} style={{ minHeight: 42, width: '100%', paddingLeft: 27, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Link onClick={() => onClick(props.EventHandler, '/settings/dnd-lists')} className={`link parent-link ${path.indexOf('/settings/dnd-lists') > -1 ? 'active' : ''}`} to="/settings/dnd-lists"><span style={{ fontSize: 16, fontWeight: 'bold' }}>DND</span></Link>
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
