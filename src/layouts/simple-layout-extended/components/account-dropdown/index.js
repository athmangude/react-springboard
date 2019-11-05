/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import styles from "./index.css.js";
import { extractInitials, stringToHexColor } from "Utils/UtilFunctions";
import IconButton from "SharedComponents/icon-button";
import Config from "Config";
import classNames from "classnames";

import brandLogo from "Images/brand-logo.png";

const AccountDropDownWrapper = styled.div`
  ${styles}
`;

export class AccountDropDown extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    authentication: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    authenticationActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.container = React.createRef();

    this.onToggleActionMenu = this.onToggleActionMenu.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
  }

  state = {
    isMenuOpen: false
  };

  componentWillMount() {
    document.addEventListener("mousedown", this.onClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onClickOutside, false);
  }

  onToggleActionMenu() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  onClickOutside(event) {
    if (this.container.current) {
      if (!this.container.current.contains(event.target)) {
        this.setState({ isMenuOpen: false });
      }
    }
  }

  onSignOut() {
    try {
      this.props.appActions.clearStores();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.props.authenticationActions.signOut();
      this.context.router.route("/sign-in");
    }
  }

  onSwitchAccount(user, accountId) {
    try {
      this.props.appActions.clearStores();
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.props.authenticationActions.switchAccount(user, accountId);
    }
  }

  render() {
    const { user } = this.props.authentication.user;
    const activeAccount = this.props.authentication.user.accounts.find(
      account => account.id === this.props.authentication.user["x-account-id"]
    );

    const { onPremise } = Config;

    return (
      <div ref={this.container}>
        <AccountDropDownWrapper
          onClick={this.onToggleActionMenu}
          onPremise={onPremise}
        >
          <div
            className={classNames("account-brand-container", {
              "on-premise": onPremise
            })}
          >
            {onPremise ? <img src={brandLogo} className="brand-logo" /> : null}
            <div
              role="button"
              className={classNames("avatar", { "on-premise": onPremise })}
              onClick={this.onToggleActionMenu}
            >
              {extractInitials(`${user.firstName} ${user.lastName}`)}
            </div>
          </div>
          {this.state.isMenuOpen ? (
            <div className="actions-container">
              <div className="active-user">
                <div className="user">
                  <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
                  <span className="profile-name">
                    {activeAccount.profilename}
                  </span>
                </div>
                <div className="logout-container">
                  <button
                    className="button signout-button"
                    onClick={this.onSignOut}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <i
                      className="material-icons"
                      style={{ margin: 0, padding: 0 }}
                    >
                      exit_to_app
                    </i>
                  </button>
                </div>
              </div>
              <div className="actions">
                {/*
                  <div style={{ width: '100%' }}>
                    <input style={{ width: '100%', height: 48 }} />
                  </div>
                  */}
              </div>
              <div className="divider" />
              <div className="accounts">
                {this.props.authentication.user.accounts
                  .filter(account => account.id !== activeAccount.id)
                  .sort((a, b) => {
                    if (
                      a.profilename.toLowerCase() < b.profilename.toLowerCase()
                    ) {
                      return -1;
                    }

                    if (
                      a.profilename.toLowerCase() > b.profilename.toLowerCase()
                    ) {
                      return 1;
                    }
                    return 0;
                  })
                  .map(account => {
                    const colorMix = stringToHexColor(account.profilename);
                    return (
                      <button
                        className="account"
                        onClick={() =>
                          this.onSwitchAccount(
                            this.props.authentication.user,
                            account.id
                          )
                        }
                      >
                        <div
                          className="avatar"
                          style={{
                            backgroundColor: colorMix.backgroundColor,
                            color: colorMix.color
                          }}
                        >
                          {extractInitials(account.profilename)}
                        </div>
                        <span className="profile-name">
                          {account.profilename}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ) : null}
        </AccountDropDownWrapper>
      </div>
    );
  }
}

export default AccountDropDown;
