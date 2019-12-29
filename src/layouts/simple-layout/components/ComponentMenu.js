/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import enhanceWithClickOutside from "react-click-outside";
import styled from "styled-components";

import styles from "./ComponentMenu.css";

const ComponentMenuWrapper = styled.div`
  ${styles}
`;

class ComponentMenu extends Component {
  static propTypes = {
    trigger: PropTypes.node.isRequired,
    adminAuthenticationActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
  }

  state = {
    isOpen: false
  };

  onToggleMenu() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  onSignOut() {
    this.props.adminAuthenticationActions.signOut();
  }

  render() {
    return (
      <ComponentMenuWrapper
        className="component-menu"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
          zIndex: 9999999999
        }}
      >
        <div role="button" onClick={this.onToggleMenu}>
          {this.props.trigger}
        </div>
        {this.state.isOpen ? (
          <div
            className="menu-container"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "#fff",
              boxShadow: "0 0 3px rgba(0, 0, 0, 0.4)",
              borderRadius: 3,
              width: 150
            }}
          >
            <div
              className="header"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexDirection: "column",
                padding: 10,
                borderBottom: "solid 1px #d9d9d9"
              }}
            >
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
              <small>System Admin</small>
            </div>
            <div
              className="menu"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                role="button"
                onClick={this.onSignOut}
                className="menu-item"
                style={{
                  width: "100%",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: 10,
                  cursor: "pointer"
                }}
              >
                <span>Sign Out</span>
              </div>
            </div>
          </div>
        ) : null}
      </ComponentMenuWrapper>
    );
  }
}

export default enhanceWithClickOutside(ComponentMenu);
