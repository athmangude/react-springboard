/* eslint-disable no-nested-ternary */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router";
import * as EventHandler from "./EventHandler";
import * as alertActions from "Modules/main/containers/App/Alerts/flux/actions";

import * as adminAuthenticationActions from "Modules/administration/containers/Authentication/flux/actions";

const noAuthenticationPaths = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password/:token"
];

export default function withAdminAuthentication(WrappedComponent) {
  @connect(
    state => ({
      ...state
    }),
    dispatch => ({
      adminAuthenticationActions: bindActionCreators(
        adminAuthenticationActions,
        dispatch
      ),
      alertActions: bindActionCreators(alertActions, dispatch)
    })
  )
  class WithAdminAuthenticationClass extends Component {
    static propTypes = {
      adminAuthentication: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      alertActions: PropTypes.object.isRequired
    };

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);

      this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
    }

    state = {
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
        isDrawerMenuDrawn: false
      }
    };

    componentDidMount() {
      window.addEventListener("resize", this.onUpdateDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.onUpdateDimensions);
    }

    onUpdateDimensions() {
      this.setState({
        windowDimensions: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }

    componentDidCatch(err, info) {
      console.log("componentDidCatch", err, info); // eslint-disable-line no-console
    }

    render() {
      if (
        (!this.props.adminAuthentication.admin &&
          (noAuthenticationPaths.includes(this.props.location.pathname) ||
            noAuthenticationPaths.includes(this.props.match.path))) ||
        (this.props.adminAuthentication.admin &&
          !noAuthenticationPaths.includes(this.props.location.pathname))
      ) {
        if (this.props.adminAuthentication.admin) {
          return (
            <WrappedComponent
              authentication={this.props.adminAuthentication.admin}
              EventHandler={EventHandler}
              alertActions={this.props.alertActions}
              {...this.props}
              windowDimensions={this.state.windowDimensions}
            />
          );
        }

        return (
          <WrappedComponent
            authentication={this.props.adminAuthentication.admin}
            EventHandler={EventHandler}
            alertActions={this.props.alertActions}
            {...this.props}
            windowDimensions={this.state.windowDimensions}
          />
        );
      }

      if (
        this.props.adminAuthentication.admin &&
        noAuthenticationPaths.includes(this.props.location.pathname)
      ) {
        return <Redirect to="/" />;
      }

      return <Redirect to="/sign-in" />;
    }
  }

  return WithAdminAuthenticationClass;
}
