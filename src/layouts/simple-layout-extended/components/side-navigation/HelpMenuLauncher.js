import React, { Component } from "react";
import styled from "styled-components";
import { IntercomAPI } from "react-intercom";

import AppPackage from "Root/package.json";

import styles from "./HelpMenuLauncher.css";
const HelpMenuLauncherWrapper = styled.div`
  ${styles}
`;

export default class HelpMenuLauncher extends Component {
  constructor(props) {
    super(props);

    this.container = React.createRef();
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

  onLaunchIntercomMessagebox = () => {
    IntercomAPI("show");
    this.setState({ isMenuOpen: false });
  };

  onClickOutside = event => {
    if (
      this.container.current &&
      !this.container.current.contains(event.target)
    ) {
      this.setState({ isMenuOpen: false });
    }
  };

  render() {
    const { isMenuOpen } = this.state;
    return (
      <HelpMenuLauncherWrapper>
        {isMenuOpen ? (
          <div className="menu" ref={this.container}>
            <a
              href="https://helpdesk.springboard.com"
              target="_blank"
              style={{ color: "inherit" }}
            >
              <button
                type="button"
                className="menu-item"
                style={{ borderTopRightRadius: 8, borderTopLeftRadius: 8 }}
              >
                Guides and FAQs
              </button>
            </a>
            <button
              type="button"
              className="menu-item"
              onClick={this.onLaunchIntercomMessagebox}
            >
              Chat with us
            </button>
            <hr />
            <a
              href="https://springboard.com/careers"
              target="_blank"
              style={{ color: "inherit" }}
            >
              <button type="button" className="menu-item">
                Join Us
              </button>
            </a>
            <a
              href="https://springboard.com/terms"
              target="_blank"
              style={{ color: "inherit" }}
            >
              <button type="button" className="menu-item mini">
                Terms & Privacy
              </button>
            </a>
            <a
              href="https://twitter.com/springboard"
              target="_blank"
              style={{ color: "inherit" }}
            >
              <button type="button" className="menu-item mini">
                Twitter – @mSurvey
              </button>
            </a>
            <hr />
            <small className="labels">{`Version ${AppPackage.version}`}</small>
          </div>
        ) : null}
        <button
          className="help-launcher"
          type="button"
          onClick={() => this.setState({ isMenuOpen: !isMenuOpen })}
        >
          <i className="material-icons">help</i>
        </button>
      </HelpMenuLauncherWrapper>
    );
  }
}
