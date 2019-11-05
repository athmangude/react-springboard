/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

import IconButton from "SharedComponents/icon-button";
import MwambaListMenu from "SharedComponents/mwamba-list-menu";
import { stringToHexColor, extractInitials } from "Utils/UtilFunctions";

export default class Customer extends Component {
  static propTypes = {
    segment: PropTypes.object,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onViewSegmentCustomers: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onViewSegmentCustomers = this.onViewSegmentCustomers.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onViewActions = this.onViewActions.bind(this);
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

  onView(segment) {
    const { onView } = this.props;
    onView(segment);
  }

  onEdit(segment) {
    const { onEdit } = this.props;
    onEdit(segment);
  }

  onViewSegmentCustomers(segment) {
    const { onViewSegmentCustomers } = this.props;
    onViewSegmentCustomers(segment);
  }

  onViewActions() {
    const { onViewActions } = this.props;
    onViewActions();
  }

  render() {
    const { segment } = this.props;
    const { isMouseOver } = this.state;
    const colorMix = stringToHexColor(`${segment.name}`);
    const menuListActions = [
      {
        id: 1,
        label: "Send Survey",
        icon: "question_answer",
        onClick: this.onViewActions
      }
    ];

    return (
      <div
        role="button"
        tabIndex={0}
        className="account-list-item"
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
          position: "relative",
          cursor: "pointer",
          backgroundColor: isMouseOver ? "rgba(0, 0, 0, 0.03)" : "transparent"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%"
          }}
          onClick={() => this.onViewSegmentCustomers(segment)}
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
            {extractInitials(`${segment.name}`)}
          </div>
          <span>{segment.name}</span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%"
          }}
        >
          <i
            className="material-icons"
            style={{ fontSize: 20, marginRight: 10, color: "#808285" }}
          >
            people_outline
          </i>
          <span>
            {numeral(segment.count)
              .format("0.0 a")
              .replace(" ", "")}
          </span>
          <MwambaListMenu actions={menuListActions} />
        </div>
      </div>
    );
  }
}
