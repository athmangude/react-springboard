/* eslint-disable no-nested-ternary, no-mixed-operators, radix */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-spinner-material";

import IconButton from "SharedComponents/icon-button";
import CircularButton from "SharedComponents/circular-button";
import ActionButton from "SharedComponents/action-button-styled";
import withAdminAuthentication from "Utils/withAdminAuthentication";
import SimpleLayout from "Layouts/simple-layout";
import AccountListItem from "./components/AccountListItem";
import AccountsPlaceholder from "./components/AccountsPlaceholder";
import SidePanel from "./components/SidePanel";

import * as appActions from "Modules/voc/containers/App/flux/actions";
import * as accountsActions from "./flux/actions";
import * as rolesActions from "Modules/voc/containers/Settings/Roles/flux/actions";

@connect(
  state => ({
    app: state.app,
    accounts: state.accounts,
    roles: state.roles,
    route: state.route
  }),
  dispatch => ({
    appActions: bindActionCreators(appActions, dispatch),
    accountsActions: bindActionCreators(accountsActions, dispatch),
    rolesActions: bindActionCreators(rolesActions, dispatch)
  })
)
class Accounts extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    appActions: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    accounts: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.fetchAccounts = this.fetchAccounts.bind(this);
    this.onAddAccount = this.onAddAccount.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.fetchIndustries = this.fetchIndustries.bind(this);
  }

  state = {
    isFetchingAccounts: false,
    showSidePanel: false
  };

  componentWillMount() {
    this.props.appActions.setRouteTitle("Accounts");
  }

  componentDidMount() {
    // TODO: fetch accounts
    this.fetchAccounts();
    // this.fetchRoles();

    if (!this.props.accounts.industries) {
      // fetch industries if they are not available
      this.fetchIndustries();
    }
  }

  onAddAccount() {
    this.context.router.history.push("/accounts?panelView=createAccount");
    this.setState({ showSidePanel: true });
  }

  async fetchRoles() {
    console.log("[fetchRoles]");
    try {
      const fetchRolesResult = await this.props.rolesActions.fetchAdminRoles(1);
      console.log(fetchRolesResult);
    } catch (exception) {
      console.log(exception);
    }
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false });
    this.context.router.history.push("/accounts");
  }

  async fetchAccounts(
    params = { limit: this.props.accounts.perPage, offset: 0 }
  ) {
    this.setState({ isFetchingAccounts: true });

    try {
      const fetchAccountsResult = await this.props.accountsActions.fetchAccounts(
        params
      );
      this.props.accountsActions.addAccounts({
        items: fetchAccountsResult.data.Data.pageItems,
        totalCount: fetchAccountsResult.data.Data.itemsAvailable,
        page: params.offset / this.props.accounts.perPage
      });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingAccounts: false });
    }
  }

  async fetchIndustries() {
    this.setState({ isFetchingIndustries: true });
    try {
      const fetchIndustriesResult = await this.props.accountsActions.fetchIndustries();
      this.props.accountsActions.setIndustries(fetchIndustriesResult.data.Data);
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingIndustries: false });
    }
  }

  render() {
    const isFirstPage = this.props.accounts.page === 0;
    const isLastPage =
      Math.ceil(
        this.props.accounts.totalCount / this.props.accounts.perPage
      ) ===
      this.props.accounts.page + 1;
    return (
      <SimpleLayout
        className="account"
        action={size => {
          if (size === "small") {
            return (
              <CircularButton
                className="primary cta"
                icon="add"
                small
                color="#002366"
                onClick={this.onAddAccount}
              />
            );
          }

          return (
            <ActionButton
              className="primary"
              icon="add"
              text="Add Account"
              onClick={this.onAddAccount}
              large
              style={{
                backgroundColor: "#002366",
                color: "#fff",
                width: 200,
                height: 50,
                borderRadius: 25,
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)"
              }}
            />
          );
        }}
      >
        <div
          style={{
            height: 48,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "#fff",
            borderBottom: "solid 1px #d9d9d9",
            zIndex: 0
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%"
            }}
          >
            {this.props.accounts.items.length ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {this.state.isFetchingAccounts ? (
                  <div style={{ margin: "0 10px" }}>
                    <Spinner
                      spinnerColor="#002366"
                      size={20}
                      spinnerWidth={2}
                    />
                  </div>
                ) : null}
                <span>
                  {this.props.accounts.page * this.props.accounts.perPage + 1} -{" "}
                  {this.props.accounts.page * this.props.accounts.perPage +
                    this.props.accounts.items.length}{" "}
                  of {this.props.accounts.totalCount}
                </span>
                {!isFirstPage ? (
                  <IconButton
                    disabled={isFirstPage}
                    onClick={() =>
                      this.fetchAccounts({
                        limit: this.props.accounts.perPage,
                        offset:
                          (this.props.accounts.page - 1) *
                          this.props.accounts.perPage
                      })
                    }
                    icon="keyboard_arrow_left"
                    style={{ margin: "0 5px 0 10px" }}
                  />
                ) : (
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                )}
                {!isLastPage ? (
                  <IconButton
                    disabled={isLastPage}
                    onClick={() =>
                      this.fetchAccounts({
                        limit: this.props.accounts.perPage,
                        offset:
                          (this.props.accounts.page + 1) *
                          this.props.accounts.perPage
                      })
                    }
                    icon="keyboard_arrow_right"
                    style={{ margin: "0 10px 0 5px" }}
                  />
                ) : (
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ width: "100%", zIndex: 0 }}>
          {this.state.isFetchingAccounts &&
          !this.props.accounts.items.length ? (
            <AccountsPlaceholder
              items={Math.floor(Math.random() * (10 - 5 + 1) + 5)}
            />
          ) : this.props.accounts.items.length ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh - 113px)"
              }}
            >
              <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
                {this.props.accounts.items.map((account, i) => (
                  <AccountListItem key={account.id} i={i} account={account} />
                ))}
              </div>
              <SidePanel
                showSidePanel={this.state.showSidePanel}
                onCloseSidePanel={this.onCloseSidePanel}
                EventHandler={this.props.EventHandler}
                alertActions={this.props.alertActions}
                fetchAccounts={this.fetchAccounts}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh - 113px)"
              }}
            >
              <div
                style={{
                  width: !this.state.showSidePanel
                    ? "100%"
                    : "calc(100% - 500px)",
                  transition: "width 0.1s",
                  height: "100%",
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 100,
                    flexDirection: "column"
                  }}
                >
                  <h2 style={{ fontWeight: "normal", fontSize: 24 }}>Ooops!</h2>
                  <p style={{ marginBottom: 10, fontSize: 14 }}>
                    You have not created any accounts
                  </p>
                  <ActionButton
                    onClick={this.onAddAccount}
                    className="primary cta"
                    text="Add Account"
                    icon="add"
                    large
                    style={{
                      backgroundColor: "#002366",
                      color: "#fff",
                      boxShadow:
                        "0 0 5px rgba(0, 0, 0, 0.8), 0 2px 5px rgba(0, 0, 0, 0.8)"
                    }}
                  />
                </div>
              </div>
              <SidePanel
                showSidePanel={this.state.showSidePanel}
                onCloseSidePanel={this.onCloseSidePanel}
                EventHandler={this.props.EventHandler}
                alertActions={this.props.alertActions}
                fetchAccounts={this.fetchAccounts}
              />
            </div>
          )}
        </div>
      </SimpleLayout>
    );
  }
}

export default withAdminAuthentication(Accounts);
