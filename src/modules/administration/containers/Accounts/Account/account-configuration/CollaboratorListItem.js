import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import CollaboratorSidePanel from "./CollaboratorSidePanel";
import IconButton from "SharedComponents/icon-button";
import { stringToHexColor, extractInitials } from "Utils/UtilFunctions";

export default class AccountListItem extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    collaborator: PropTypes.object.isRequired
  };

  static propTypes = {
    account: PropTypes.object.isRequired,
    collaborator: PropTypes.object.isRequired,
    onFetchCollaborators: PropTypes.func.isRequired,
    accountsActions: PropTypes.object.isRequired,
    accountDetails: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    roles: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onViewAccount = this.onViewAccount.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onView = this.onView.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
  }

  state = {
    isMouseOver: false,
    showSidePanel: false,
    panel: null
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

  onCloseSidePanel() {
    this.setState({ showSidePanel: false });
  }

  onEdit() {
    this.setState({ showSidePanel: true, panel: "edit" });
  }

  onView() {
    this.setState({ showSidePanel: true, panel: "view" });
  }

  render() {
    const {
      collaborator,
      onFetchCollaborators,
      accountsActions,
      accountDetails,
      EventHandler,
      alertActions,
      roles
    } = this.props;
    const { isMouseOver, showSidePanel, panel } = this.state;
    const colorMix = stringToHexColor(
      `${collaborator.firstName} ${collaborator.lastName}`
    );
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
          backgroundColor: this.state.isMouseOver
            ? "rgba(0, 0, 0, 0.03)"
            : "transparent"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%"
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
            {extractInitials(
              `${this.props.collaborator.firstName} ${this.props.collaborator.lastName}`
            )}
          </div>
          <span>{`${collaborator.firstName} ${collaborator.lastName}`}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%"
          }}
        >
          <span>{collaborator.username}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%"
          }}
        >
          <span>{collaborator.email}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%"
          }}
        >
          <span>
            <i>{moment(collaborator.lastLogin).fromNow()}</i>
          </span>
        </div>
        {isMouseOver ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "0 10px"
            }}
          >
            <IconButton
              icon="visibility"
              onClick={this.onView}
              style={{ margin: 0, padding: 6 }}
            />
            <IconButton
              icon="edit"
              onClick={this.onEdit}
              style={{ margin: 0, padding: 6 }}
            />
          </div>
        ) : null}
        {showSidePanel ? (
          <CollaboratorSidePanel
            panel={panel}
            onCloseSidePanel={this.onCloseSidePanel}
            collaborator={collaborator}
            roles={roles}
            onFetchCollaborators={onFetchCollaborators}
            showSidePanel={showSidePanel}
            accountsActions={accountsActions}
            accountDetails={accountDetails}
            EventHandler={EventHandler}
            alertActions={alertActions}
          />
        ) : null}
      </div>
    );
  }
}
