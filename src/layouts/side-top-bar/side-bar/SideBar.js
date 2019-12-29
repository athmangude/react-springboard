import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import SideBarLink from './SideBarLink';

import sideBarLinks from './SideBarLinks';

import styles from './SideBarStyles';

const SideBarWrapper = styled.div`${styles}`;

const SideBar = (props, context) => {
  const currentApp = [...sideBarLinks].reverse().find((sideBarLink) => !!sideBarLink.paths.find((path) => context.router.route.match.path.indexOf(path.substring(1)) > -1 || sideBarLink.paths.includes(context.router.route.match.path)));

  return (
    <SideBarWrapper {...props} onMouseOver={props.onMouseEnteredDrawer} onFocus={props.onMouseEnteredDrawer} onMouseOut={props.onMouseLeftDrawer} onBlur={props.onMouseLeftDrawer}>
      <div className="apps-container">
        {
          sideBarLinks.map((sideBarLink) => (
            <Link to={sideBarLink.paths[0]} className={classNames('app-button', { active: !!sideBarLink.paths.find((path) => (context.router.route.match.path.substring(1).includes(path.substring(1)) && path.substring(1).length) || (path === '/' && context.router.route.match.path === '/')) })} key={sideBarLink.app}>
              <i className="material-icons action-icon">{sideBarLink.icon}</i>
            </Link>
          ))
        }
      </div>
      {
        Object.keys(currentApp).includes('sublinks') ? (
          <div className="sidebar-actions-container">
            {
              currentApp.sublinks.map((link) => (
                <SideBarLink link={link} windowDimensions={props.windowDimensions} open={props.open} key={link.label} />
              ))
            }
          </div>
        ) : null
      }
    </SideBarWrapper>
  );
};

SideBar.contextTypes = {
  router: PropTypes.object.isRequired,
};

SideBar.propTypes = {
  onMouseEnteredDrawer: PropTypes.func,
  onMouseLeftDrawer: PropTypes.func,
  open: PropTypes.bool,
};

export default SideBar;
