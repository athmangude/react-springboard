import React from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import { Container } from 'react-grid-system';
import Alerts from 'Modules/shopping/containers/App/Alerts';

import Header from './header';
import HeaderMinimal from './HeaderMinimal';
import BottomNavigation from './BottomNavigation';
import * as EventHandler from 'Utils/EventHandler';

function onLinkClicked(path) {
  EventHandler.trackEvent({ category: 'navigation', action: 'click', value: path });
}

const TopBarLayout = (props) => (
  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
    <ContainerDimensions>
      {
        ({ width }) => {
          if (width > 767) {
            return (
              <div style={{ width: '100%' }}>
                <Header onLinkClicked={onLinkClicked} />
                <Container style={{ position: 'relative' }}>
                  <Alerts />
                  {props.children}
                </Container>
              </div>
            );
          }

          return (
            <div style={{ width: '100%', margin: 0, padding: 0 }}>
              <HeaderMinimal onLinkClicked={onLinkClicked} />
              <Container fluid style={{ padding: 0, marginTop: 60, marginBottom: 40, position: 'relative' }}>
                <Alerts />
                {props.children}
              </Container>
              <BottomNavigation onLinkClicked={onLinkClicked} />
            </div>
          );
        }
      }
    </ContainerDimensions>
  </div>
);

TopBarLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default TopBarLayout;
