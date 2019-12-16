/* eslint-disable jsx-a11y/interactive-supports-focus, no-nested-ternary */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-spinner-material";
import styled from "styled-components";

import ComponentMenu from "./components/ComponentMenu";
import SideNavigation from "./components/side-navigation";
import Alerts from "Modules/main//containers/App/Alerts";

import * as adminAuthenticationActions from "Modules/administration/containers/Authentication/flux/actions";
import * as accountsActions from "Modules/administration/containers/Home/flux/actions";

import logo from "Images/logo.png";

import styles from "./index.css";

const SimpleLayoutWrapper = styled.div`
  ${styles}
`;

@connect(
  state => ({
    app: state.app
  }),
  dispatch => ({
    adminAuthenticationActions: bindActionCreators(
      adminAuthenticationActions,
      dispatch
    ),
    accountsActions: bindActionCreators(accountsActions, dispatch),
    dispatch
  })
)
export default class SimpleLayout extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    adminAuthenticationActions: PropTypes.object.isRequired,
    accountsActions: PropTypes.object.isRequired
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    app: PropTypes.object.isRequired,
    action: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.onSearchAccounts = this.onSearchAccounts.bind(this);
    this.onViewAccount = this.onViewAccount.bind(this);
    this.onCancelSearch = this.onCancelSearch.bind(this);
    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
  }

  state = {
    isSearchingAccounts: false,
    matchedAccounts: null,
    searchTerm: "",
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };

  componentDidMount() {
    window.addEventListener("resize", this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onUpdateDimensions);
  }

  onUpdateDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  async onSearchAccounts(event) {
    const searchTerm = event.target.value;

    this.setState({ searchTerm }, async () => {
      if (searchTerm.length) {
        this.setState({ isSearchingAccounts: true });
        try {
          const fetchAccountsResult = await this.props.accountsActions.searchAccounts(
            this.state.searchTerm
          );
          this.setState({ matchedAccounts: fetchAccountsResult.data.Data });
        } catch (exception) {
          // TODO: handle the exception
          this.setState({ matchedAccounts: null });
        } finally {
          this.setState({ isSearchingAccounts: false });
        }
      }
    });
  }

  onCancelSearch() {
    this.setState({
      matchedAccounts: null,
      searchTerm: "",
      isSearchingAccounts: false
    });
  }

  onViewAccount(accountId) {
    this.setState(
      {
        isSearchingAccounts: false,
        matchedAccounts: null,
        searchTerm: ""
      },
      () => {
        this.context.router.history.replace(`/accounts/${accountId}`);
      }
    );
  }

  render() {
    const showMatches =
      this.state.matchedAccounts && this.state.matchedAccounts.length;
    return (
      <SimpleLayoutWrapper
        className="side-bar"
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          zIndex: 0
        }}
      >
        <Alerts />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 64,
            borderBottom: "solid 1px #d9d9d9",
            width: "100%",
            position: "fixed",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1
          }}
        >
          <div
            style={{
              width: this.state.windowWidth > 768 ? 200 : 50,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <img src={logo} height={40} style={{ margin: 10 }} alt="logo" />
            {this.state.windowWidth > 768 ? (
              <span
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: 25
                }}
              >
                {this.props.app.routeTitle}
              </span>
            ) : null}
          </div>
          <div
            style={{
              width:
                this.state.windowWidth > 768
                  ? "calc(100% - 260px)"
                  : "calc(100% - 110px)",
              margin: "10px 10px",
              position: "relative",
              boxShadow:
                showMatches ||
                (this.state.searchTerm.length &&
                  !this.state.isSearchingAccounts)
                  ? "0 0 10px rgba(0, 0, 0, 0.3)"
                  : "none"
            }}
          >
            <div style={{ width: "100%", display: "flex" }}>
              <input
                type="search"
                value={this.state.searchTerm}
                placeholder="Search accounts"
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "#e8eaed",
                  borderRadius:
                    showMatches ||
                    (this.state.searchTerm.length &&
                      !this.state.isSearchingAccounts)
                      ? 0
                      : 25,
                  outline: "none",
                  padding: "0 50px 0 20px",
                  fontSize: 21,
                  outline: "none",
                  border: "none"
                }}
                onChange={this.onSearchAccounts}
              />
              {this.state.isSearchingAccounts ? (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    bottom: 0,
                    right: 10
                  }}
                >
                  <Spinner spinnerColor="#808285" size={30} spinnerWidth={3} />
                </div>
              ) : this.state.searchTerm.length ? (
                <div
                  role="button"
                  onClick={this.onCancelSearch}
                  style={{ position: "absolute", top: 5, bottom: 0, right: 5 }}
                >
                  <i
                    className="material-icons"
                    style={{
                      color: "#808285",
                      fontSize: 40,
                      cursor: "pointer"
                    }}
                  >
                    cancel
                  </i>
                </div>
              ) : (
                <div
                  style={{ position: "absolute", top: 5, bottom: 0, right: 5 }}
                >
                  <i
                    className="material-icons"
                    style={{ color: "#d9d9d9", fontSize: 40 }}
                  >
                    search
                  </i>
                </div>
              )}
            </div>
            {showMatches ? (
              <div
                className="search-results"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  overflowY: "auto",
                  position: "absolute",
                  top: 50,
                  backgroundColor: "#fff",
                  overflow: "auto",
                  boxShadow: "0 5px 10px rgba(0 , 0, 0, 0.3)",
                  borderBottomRightRadius: 3,
                  borderBottomLeftRadius: 3
                }}
              >
                {this.state.matchedAccounts.map(account => (
                  <div
                    role="button"
                    className="search-results-item"
                    style={{ width: "100%", padding: 10 }}
                    onClick={() => this.onViewAccount(account.accountId)}
                  >
                    <span>{account.profilename}</span>
                  </div>
                ))}
              </div>
            ) : this.state.searchTerm.length &&
              !this.state.isSearchingAccounts ? (
              <div
                className="search-results"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  overflowY: "auto",
                  position: "absolute",
                  top: 50,
                  padding: "20px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  overflow: "auto",
                  boxShadow: "0 5px 10px rgba(0 , 0, 0, 0.3)",
                  borderBottomRightRadius: 3,
                  borderBottomLeftRadius: 3
                }}
              >
                <span>No results found</span>
              </div>
            ) : null}
          </div>
          <div
            style={{
              height: "100%",
              width: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 10px 0"
            }}
          >
            <ComponentMenu
              adminAuthenticationActions={this.props.adminAuthenticationActions}
              trigger={
                <div
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "gray",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#fff"
                  }}
                >
                  SA
                </div>
              }
              windowWidth={this.state.windowWidth}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            height: "calc(100vh - 64px",
            marginTop: 64,
            backgroundColor: "#fff"
          }}
        >
          <div
            style={{
              height: "100%",
              overflow: "auto",
              width: this.state.windowWidth > 768 ? 200 : 50
            }}
          >
            <SideNavigation
              windowWidth={this.state.windowWidth}
              action={this.props.action}
            />
          </div>
          <div
            style={{
              height: "100%",
              overflow: "auto",
              width:
                this.state.windowWidth > 768
                  ? "calc(100% - 200px)"
                  : "calc(100% - 50px)"
            }}
          >
            {this.props.children}
          </div>
        </div>
      </SimpleLayoutWrapper>
    );
  }
}
