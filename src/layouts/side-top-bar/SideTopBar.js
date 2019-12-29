/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-grid-system';
import styled from 'styled-components';

import AccountDropDown from './account-dropdown';

import SideBar from './side-bar/SideBar';
import logo from 'Images/white-logo.svg';

import sideBarLinks from './side-bar/SideBarLinks';
import SideBarActivityLog from 'Modules/main/containers/ActivityLog/SideBarActivityLog';

import styles from './SideBarWrapperStyles';
const SideBarWrapper = styled.div`${styles}`;


export default class SideTopBar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    activityLogs: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    EventHandler: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
    this.onMouseEnteredDrawer = this.onMouseEnteredDrawer.bind(this);
    this.onMouseLeftDrawer = this.onMouseLeftDrawer.bind(this);
  }

  state = {
    windowDimensions: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    isDrawerExpanded: true,
  }

  componentDidMount() {
    window.addEventListener('resize', this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onUpdateDimensions);
  }

  onUpdateDimensions() {
    this.setState({
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }

  onMouseEnteredDrawer() {
    const activeApp = [...sideBarLinks].reverse().find((sideBarLink) => !!sideBarLink.paths.find((path) => this.context.router.route.match.path.indexOf(path) > -1));
    if (activeApp.sublinks) {
      this.setState({ isDrawerExpanded: true });
    }
  }

  onMouseLeftDrawer() {
    this.setState({ isDrawerExpanded: false });
  }

  render() {
    const activeApp = [...sideBarLinks].reverse().find((sideBarLink) => !!sideBarLink.paths.find((path) => this.context.router.route.match.path.indexOf(path) > -1));

    const canOpen = !!activeApp && Object.keys(activeApp).includes('sublinks');

    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100vw', height: 64, display: 'flex', flexDirection: 'row', zIndex: 2 }}>
          <div className="logo-container" style={{ width: 64, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2574a6' }}>
            <img alt="logo" src={logo} className="logo" />
          </div>
          <div style={{ height: 64, backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100vw - 68px)', borderBottom: 'solid 1px #edecec94' }}>
            <span style={{ margin: '0 10px', fontSize: 20 }}>
              {activeApp.label}
            </span>
            <AccountDropDown {...this.props} windowDimensions={this.state.windowDimensions} />
          </div>
        </div>
        <div style={{ height: 'calc(100vh - 62px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <SideBar windowDimensions={this.state.windowDimensions} open={this.state.isDrawerExpanded && canOpen} canOpen={canOpen} onMouseEnter={this.onMouseEnteredDrawer} onMouseLeave={this.onMouseLeftDrawer} onToggleExpanded={this.onToggleExpanded} />
          <div style={{ width: !canOpen ? 'calc(100vw - 64px)' : this.state.windowDimensions.width > 1440 ? 'calc(100vw - 312px)' : 'calc(100vw - 64px)', marginLeft: !canOpen ? 0 : this.state.windowDimensions.width < 1440 && this.state.isDrawerExpanded ? 64 : 0, height: 'calc(100vh - 64px)', overflowY: 'auto', display: 'flex', flexDirection: 'row' }}>
            <Container fluid style={{ padding: 0, margin: 0, width: activeApp.showActivityLog && this.state.windowDimensions.width > 1440 ? 'calc(100% - 300px)' : '100%' }}>
              {this.props.children}
            </Container>
            <SideBarWrapper activeApp={activeApp} windowDimensions={this.state.windowDimensions}>
              <SideBarActivityLog activityLogs={this.props.activityLogs} collaborators={this.props.collaborators} EventHandler={this.props.EventHandler} />
            </SideBarWrapper>
          </div>
        </div>
      </div>
    );
  }
}

// TODO: collect the actions menu and account dropdown into one component
