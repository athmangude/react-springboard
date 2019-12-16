import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import NavigationLinks from '../side-navigation/SideBarLinks';

import BottomNavigationStyles from './BottomNavigationStyles';
const BottomNavigationWrapper = Styled(BottomNavigation)`${BottomNavigationStyles}`;

export default class MyBottomNavigation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    configurations: PropTypes.object,
  }

  constructor(props, context) {
    super(props);

    const { router } = context;

    this.state = {
      isBottomSheetOpen: false,
      path: `/${router.history.location.pathname.slice(1).split('/')[0]}`,
    };
  }

  onBottomNavigationActionClicked = (path) => {
    const { router } = this.context;
    router.history.push(path);
  }

  render() {
    const { configurations } = this.props;
    const { isBottomSheetOpen, path } = this.state;
    const { router } = this.context;
    return (
      <BottomNavigationWrapper
        isBottomSheetOpen={isBottomSheetOpen}
        value={path}
        onChange={(event, nextPath) => {
          this.setState({ path: nextPath });
          router.history.push(nextPath);
        }}

      >
        {
          app.hasBeforeInstallPromptBeenFired && !(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) ? (
            <AppInstallButton onInstallButtonClicked={onInstallButtonClicked} />
          ) : null
        }
        {
          NavigationLinks.map((sidebarLink) => {
            const active = !!sidebarLink.paths.find((aPath) => (router.route.match.path.substring(1).includes(aPath.substring(1)) && aPath.substring(1).length) || (aPath === '/' && router.route.match.path === '/'));
            return (
              <BottomNavigationAction
                label={sidebarLink.label}
                icon={<i className="material-icons">{sidebarLink.icon}</i>}
                value={sidebarLink.paths[0]}
                onClick={() => this.onBottomNavigationActionClicked(sidebarLink.paths[0])}
                style={{ color: active ? '#000000cc' : '#0000008a' }}
              />
            );
          })
        }
      </BottomNavigationWrapper>
    );
  }
}
