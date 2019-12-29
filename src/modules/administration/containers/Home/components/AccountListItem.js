import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "SharedComponents/icon-button";

import { stringToHexColor, extractInitials } from "Utils/UtilFunctions";

export default class AccountListItem extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    account: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onViewAccount = this.onViewAccount.bind(this);
  }

  state = {
    isMouseOver: false
  };

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onViewAccount() {
    this.context.router.history.push(`/accounts/${this.props.account.id}`);
  }

  render() {
    const colorMix = stringToHexColor(this.props.account.profilename);
    return (
      <div
        role="button"
        className="account-list-item"
        onClick={this.onViewAccount}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={{
          width: "100%",
          borderBottom: "solid 1px #d9d9d9",
          padding: "10px 10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          backgroundColor: this.state.isMouseOver
            ? "rgba(0, 0, 0, 0.03)"
            : "transparent",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              margin: "0 10px",
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: colorMix.backgroundColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colorMix.color
            }}
          >
            {extractInitials(this.props.account.profilename)}
          </div>
          <span>{this.props.account.profilename}</span>
        </div>
        {this.state.isMouseOver ? (
          <div style={{}}>
            <IconButton icon="more_vert" style={{ margin: 0, padding: 6 }} />
          </div>
        ) : null}
      </div>
    );
  }
}
