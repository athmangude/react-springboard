/* eslint-disable jsx-a11y/interactive-supports-focus, no-nested-ternary */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import SidePanel from "./components/SidePanel";
import AccountDropDown from "./components/account-dropdown";
import SideNavigation from "./components/side-navigation";
import sidebarLinks from "./components/side-navigation/SideBarLinks";
import Alerts from "Modules/main/containers/App/Alerts";
import IconButton from "SharedComponents/icon-button";

import * as appActions from "Modules/main/containers/App/flux/actions";
import * as authenticationActions from "Modules/main/containers/Authentication/flux/actions";

import RightDrawer from "./components/right-drawer";
import BottomNavigation from "./components/bottom-navigation";
import Config from "Config";

import themes from "SharedComponents/themes";

const {
  primaryColor,
  lightPrimaryColor,
  primaryTextColor,
  secondaryTextColor,
  errorColor,
  successColor,
  actionSurfaceTextColor
} = themes.light;

// import logo from 'Images/logo.png';
import logoTextOnly from "Images/logo-text-only.png";
import logoSymbolOnly from "Images/logo-symbol-only.png";

import styles from "./index.css";

const SimpleLayoutExtendedWrapper = styled.div`
  ${styles}
`;

@connect((state) => ({
  ...state,
  app: state.app,
  configurations: state.configurations,
  authentication: state.authentication,
}),
  (dispatch) => ({
    appActions: bindActionCreators(appActions, dispatch),
    authenticationActions: bindActionCreators(authenticationActions, dispatch),
    dispatch,
  }))

export default class SimpleLayoutExtended extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static childContextTypes = {
    componentStyle: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    app: PropTypes.object.isRequired,
    action: PropTypes.func,
    customActionBar: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    searchBar: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    pagination: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    actions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    tabs: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    sidePanel: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    rightDrawerComponent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    bottomPanelComponent: PropTypes.node,
    routeTitle: PropTypes.string,
    configurations: PropTypes.object,
    configurationActions: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
    this.onToggleDrawerMenu = this.onToggleDrawerMenu.bind(this);
    this.onToggleRightDrawer = this.onToggleRightDrawer.bind(this);
    this.onToggleDemoMode = this.onToggleDemoMode.bind(this);
  }

  state = {
    windowDimensions: {
      width: window.innerWidth,
      height: window.innerHeight,
      isDrawerMenuDrawn: false
    },
    isRightDrawerDrawn: false
  };

  getChildContext() {
    return {
      componentStyle: {
        primaryColor,
        primaryFontColor: primaryTextColor,
        secondaryColor: primaryColor,
        secondaryFontColor: secondaryTextColor,
        errorColor,
        successColor,
        typographyColor: actionSurfaceTextColor
      }
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onUpdateDimensions);
  }

  onToggleDrawerMenu() {
    const { isDrawerMenuDrawn } = this.state;
    this.setState({ isDrawerMenuDrawn: !isDrawerMenuDrawn });
  }

  onToggleRightDrawer() {
    const { isRightDrawerDrawn } = this.state;
    this.setState({ isRightDrawerDrawn: !isRightDrawerDrawn });
  }

  onToggleDemoMode(demoMode) {
    const { configurationActions } = this.props;
    configurationActions.updateDemoMode(demoMode);
  }

  onUpdateDimensions() {
    this.setState({
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  render() {
    const {
      app,
      pagination,
      actions,
      customActionBar,
      children,
      rightDrawerComponent,
      bottomPanelComponent,
      searchBar,
      action,
      tabs,
      sidePanel,
      configurations,
      authentication
    } = this.props;

    const { onPremise } = Config;

    const {
      windowDimensions,
      isRightDrawerDrawn,
      isDrawerMenuDrawn
    } = this.state;
    const { router } = this.context;
    const { routeTitle } = app;
    const activeApp = [...sidebarLinks]
      .reverse()
      .find(
        sidebarLink =>
          !!sidebarLink.paths.find(
            path => router.route.match.path.indexOf(path) > -1
          )
      );
    const showActionBar = customActionBar || actions || pagination || tabs;

    const hideRightDrawer = windowDimensions.width <= 1024;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { ...this.props })
    );

    return (
      <SimpleLayoutExtendedWrapper
        style={{ width: "100%", display: "flex", position: "relative", overflow: "hidden", maxWidth: 1920 }}
      >
        <div
          style={{
            width:
              rightDrawerComponent && !hideRightDrawer
                ? "calc(100% - 300px)"
                : "100%"
          }}
        >
          <div
            className="side-bar"
            style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative", zIndex: 0 }}
          >
            <Alerts />
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 64, borderBottom: "solid 1px #d9d9d9", width: "100%", position: "absolute", top: 0, left: 0, backgroundColor: "#fff", zIndex: 3 }}
            >
              <div
                style={{ width: windowDimensions.width > 768 ? 200 : 50, height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}
              >
                <Link
                  to="/"
                  style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                >
                  <img
                    src={
                      windowDimensions.width > 768
                        ? logoTextOnly
                        : logoSymbolOnly
                    }
                    height={40}
                    style={{ margin: 10 }}
                    alt="logo"
                  />
                </Link>
                {windowDimensions.width > 768 ? (
                  <span
                    style={{ fontSize: 20, fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 2.5, textTransform: "capitalize" }}
                  >
                    {routeTitle || activeApp.label}
                  </span>
                ) : null}
              </div>
              <div
                style={{ width: "100%", margin: "10px 10px", position: "relative" }}
              >
                {searchBar}
              </div>
              <div
                style={{ height: "100%", width: 114, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 10px 0" }}
              >
                {
                  windowDimensions.width > 768 ? (
                    <IconButton
                      large
                      icon="settings"
                      style={{ margin: 10, color: "#000" }}
                      onClick={() => router.history.push('/settings')}
                    />
                  ) : null
                }
                {
                  authentication.user !== null ? (
                    <AccountDropDown
                      {...this.props}
                      windowDimensions={windowDimensions}
                    />
                  ) : null
                }
                {
                  windowDimensions.width <= 1024 && rightDrawerComponent ? (
                    <div
                      style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <IconButton
                        icon={
                          isRightDrawerDrawn ? "chevron_right" : "chevron_left"
                        }
                        style={{ margin: 10, color: "#000" }}
                        onClick={this.onToggleRightDrawer}
                      />
                    </div>
                  ) : null
                }
              </div>
            </div>
            <div
              style={{ width: "100%", display: "flex", flexDirection: "row", height: "calc(100vh - 64px", marginTop: 64, backgroundColor: "#fff" }}
            >
              {
                windowDimensions.width > 768 ? (
                  <div style={{ height: '100%', overflow: 'auto', width: windowDimensions.width > 768 && activeApp.fullWidthMenu ? 200 : 50 }}>
                    <SideNavigation open={isDrawerMenuDrawn} windowWidth={windowDimensions.width} authentication={authentication} action={action} activeApp={activeApp} configurations={configurations} onToggleDemoMode={this.onToggleDemoMode} />
                  </div>
                ) : null
              }
              {
                windowDimensions.width > 768 ? (
                  <div style={{ height: '100%', overflow: 'auto', width: windowDimensions.width > 768 && activeApp.fullWidthMenu ? 'calc(100% - 200px)' : 'calc(100% - 50px)' }}>
                    {
                      customActionBar ? (
                        <div
                          style={{
                            height: 48, width: '100%', margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottom: 'solid 1px #d9d9d9', zIndex: 0,
                          }}
                        >
                          {customActionBar}
                        </div>
                      ) : showActionBar ? (
                        <div
                          className="hide-scrollbars"
                          style={{ height: 48, width: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottom: 'solid 1px #d9d9d9', zIndex: 0, }}
                        >
                          <div>
                            {tabs}
                          </div>
                          <div
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}
                          >
                            {actions}
                            {pagination}
                          </div>
                        </div>
                      ) : null
                    }
                    <div style={{ height: showActionBar ? 'calc(100vh - 112px)' : '100%', overflow: 'auto' }}>
                      {childrenWithProps}
                    </div>
                  </div>
                ) : (
                    <div
                      style={{ height: "100%", overflow: "auto", width: "100%" }}
                    >
                      {
                        customActionBar ? (
                          <div style={{ height: 48, width: "100%", margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderBottom: "solid 1px #d9d9d9", zIndex: 0 }}>
                            {customActionBar}
                          </div>
                        ) : showActionBar ? (
                          <div
                            className="hide-scrollbars"
                            style={{ height: 48, width: "100%", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderBottom: "solid 1px #d9d9d9", zIndex: 0 }}
                          >
                            <div>{tabs}</div>
                            <div
                              style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                            >
                              {actions}
                              {pagination}
                            </div>
                          </div>
                        ) : null
                      }
                      <div
                        style={{
                          height: showActionBar
                            ? "calc(100vh - 112px - 58px)"
                            : "calc(100% - 58px)",
                          overflow: "auto"
                        }}
                      >
                        {childrenWithProps}
                      </div>
                      {bottomPanelComponent}
                    </div>
                  )}
            </div>
          </div>
        </div>
        <SidePanel component={sidePanel} />
        {rightDrawerComponent ? (
          <RightDrawer
            show={!hideRightDrawer}
            {...this.props}
            drawn={isRightDrawerDrawn}
            onToggleRightDrawer={this.onToggleRightDrawer}
            windowDimensions={windowDimensions}
          >
            {rightDrawerComponent}
          </RightDrawer>
        ) : null}
      </SimpleLayoutExtendedWrapper>
    );
  }
}
