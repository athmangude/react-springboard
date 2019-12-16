/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-new */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router";
import Intercom from "react-intercom";
import sha256 from "js-sha256";
import * as EventHandler from "./EventHandler";
import * as alertActions from "Modules/main/containers/App/Alerts/flux/actions";

import * as authenticationActions from "Modules/main/containers/Authentication/flux/actions";

import ErrorHandler from "./error-page/index";

const noAuthenticationPaths = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password/:token",
  "/complete-registration/:token",
];

export default function withAuthentication(WrappedComponent) {
  @connect(
    state => ({
      authentication: state.authentication,
      configurations: state.configurations,
      roles: state.roles,
      collaborators: state.collaborators
    }),
    dispatch => ({
      authenticationActions: bindActionCreators(authenticationActions, dispatch),
      alertActions: bindActionCreators(alertActions, dispatch)
    })
  )
  class WithAuthenticationClass extends Component {
    static propTypes = {
      authentication: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
      alertActions: PropTypes.object.isRequired,
    };

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);

      this.fetchAccountConfigurations = this.fetchAccountConfigurations.bind(
        this
      );
      this.fetchRoles = this.fetchRoles.bind(this);
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
      // fetch configurations if they have not already been fetched
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

    async fetchAccountConfigurations() {
      // TODO: update fetch configuration status
      const { configurationActions, accountActions } = this.props;
      configurationActions.updateIsFetchingAccountConfigurationStatus(true);
      try {
        const fetchAccountConfigurationsResult = await configurationActions.fetchAccountConfigurations();
        configurationActions.setAccountConfigurations(
          fetchAccountConfigurationsResult.data.Data.accountFeatures
        );
        accountActions.setAccountDetails(
          fetchAccountConfigurationsResult.data.Data
        );
      } catch (exception) {
        EventHandler.handleException(exception);
      } finally {
        configurationActions.updateIsFetchingAccountConfigurationStatus(false);
      }
    }

    async fetchRoles() {
      await this.fetchCollaborators();
      const { rolesActions, authentication, collaborators } = this.props;
      try {
        const fetchRolesResult = await rolesActions.fetchRoles();
        const roles = fetchRolesResult.data.data.Data;
        rolesActions.addRoles(roles);
        if (authentication.user) {
          const { user } = authentication.user;
          const collaborator = collaborators.find(
            collaborator => collaborator.id === user.id
          );
          const loggedInUserRole = roles.find(
            role => role.id === collaborator.roleId
          );
          rolesActions.setLoggedInUserRole(loggedInUserRole);
        }
      } catch (exception) {
        EventHandler.handleException(exception);
      }
    }

    async fetchCollaborators() {
      const { collaboratorsActions } = this.props;
      try {
        const fetchCollaboratorsResult = await collaboratorsActions.fetchCollaborators();
        collaboratorsActions.removeCollaborators();
        collaboratorsActions.addCollaborators(
          fetchCollaboratorsResult.data.Data
        );
      } catch (exception) {
        EventHandler.handleException(exception);
      }
    }

    componentDidCatch(err, info) {
      console.log("componentDidCatch", err, info); // eslint-disable-line no-console
    }

    render() {
      const {
        authentication,
        location,
        match,
        configurations,
        roles,
        alertActions
      } = this.props;
      const { windowDimensions } = this.state;
      if (
        (!authentication.user &&
          (noAuthenticationPaths.includes(location.pathname) ||
            noAuthenticationPaths.includes(match.path))) ||
        (authentication.user &&
          !noAuthenticationPaths.includes(location.pathname))
      ) {
        if (authentication.user) {
          let {
            active,
            lastLogin,
            createDate,
            password,
            ...intercomUser
          } = authentication.user.user; // eslint-disable-line prefer-const
          const matchedActiveAccount = authentication.user.accounts.find(
            account => account.id === authentication.user["x-account-id"]
          );
          intercomUser = {
            ...intercomUser,
            accountId: authentication.user["x-account-id"],
            user_id: authentication.user.user.id,
            name: `${authentication.user.user.firstName} ${authentication.user.user.lastName}`,
            accountName: matchedActiveAccount.profilename,
            company: matchedActiveAccount.profilename,
            user_hash: sha256.hmac(
              "soPS6usJm0YZb66uDp4LlwBV4NkNK1TzSaisRla7",
              authentication.user.user.email
            ),
            hide_default_launcher: true,
            alignment: "left"
          };

          return (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ErrorHandler>
                <WrappedComponent
                  authentication={authentication.user}
                  EventHandler={EventHandler}
                  alertActions={alertActions}
                  configurations={configurations}
                  roles={roles}
                  windowDimensions={windowDimensions}
                />
                <Intercom appID="ktbsj3ci" {...intercomUser} />
              </ErrorHandler>
            </div>
          );
        }

        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ErrorHandler>
              <WrappedComponent
                authentication={authentication.user}
                EventHandler={EventHandler}
                alertActions={alertActions}
                configurations={configurations}
                roles={roles}
              />
            </ErrorHandler>
          </div>
        );
      }

      if (
        authentication.user &&
        noAuthenticationPaths.includes(location.pathname)
      ) {
        return (
          <ErrorHandler>
            <Redirect to="/" />
          </ErrorHandler>
        );
      }

      return (
        <ErrorHandler>
          <Redirect to="/sign-in" />
        </ErrorHandler>
      );
    }
  }

  return WithAuthenticationClass;
}
