import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import uuid from "uuid/v1";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { bindActionCreators } from "redux";
import * as errorActions from "./flux/actions";

import logo from "Images/logo.png";
import breakDownImg from "Images/breakdown.png";
import ActionButton from "SharedComponents/action-button-styled";

@connect(
  state => ({
    ...state
  }),
  dispatch => ({
    errorActions: bindActionCreators(errorActions, dispatch),
    dispatch
  })
)
class ErrorPage extends Component {
  static propTypes = {
    authentication: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      error: null,
      errorInfo: null,
      open: false,
      report: null,
      appState: null,
      url: null,
      user: null
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.reportError = this.reportError.bind(this);
    this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    this.sendToBridge = this.sendToBridge.bind(this);
    this.takeMeBackHome = this.takeMeBackHome.bind(this);
  }

  componentDidMount = () => {
    setInterval(() => {
      this.sendToBridge();
    }, 60000);
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  reportError = () => {
    // this.props.errorActions.reportError(this.state);
    this.saveToLocalStorage(this.state);
    this.handleClose();
  };

  handleChange = e => {
    this.setState({ report: e.target.value });
  };

  saveToLocalStorage = payload => {
    const errors = JSON.parse(localStorage.getItem("new-ui-error")) || [];
    errors.push(payload);
    localStorage.setItem("new-ui-error", JSON.stringify(errors));
    this.sendToBridge();
  };

  takeMeBackHome = () => {
    window.location.assign(window.location.origin);
  };

  async sendToBridge() {
    let errors = JSON.parse(localStorage.getItem("new-ui-error")) || [];
    if (errors.length) {
      errors.map(async error => {
        if (
          error.report === null &&
          error.url.includes("http://localhost") === false
        ) {
          await this.props.errorActions.error(error);
        } else if (
          error.url.includes("http://localhost") === false &&
          error.report !== null
        ) {
          await this.props.errorActions.reportError(error);
        }
        return null;
      });
    }
    errors = [];
    localStorage.setItem("new-ui-error", JSON.stringify(errors));
  }

  componentDidCatch(error, errorInfo) {
    const { authentication } = this.props;
    // Catch errors in any components below and re-render with error message
    this.setState(
      {
        id: uuid(),
        error,
        errorInfo,
        // appState: [this.convertReduxState(this.props)],
        url: window.location.href,
        user: authentication.user
          ? authentication.user.user
          : authentication.user
      },
      () => {
        this.saveToLocalStorage(this.state);
      }
    );
  }

  render() {
    const { error, errorInfo, open, report } = this.state;
    if (errorInfo) {
      // Error path
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            minHeight: 200,
            margin: "10px 0px"
          }}
        >
          <img src={logo} alt="logo" />
          <img src={breakDownImg} alt="logo" />
          <div style={{ maxWidth: "600px", padding: "0px 10px" }}>
            <p style={{ fontSize: 28, color: "#3d4553", fontWeight: 80 }}>
              I hate you had to see me like this I'm having one of those days
              where things are just not working but worry not some ninjas are
              fixing me up.
            </p>
            <p style={{ fontSize: 28, color: "#3d4553", fontWeight: 80 }}>
              Btw did you know that coffee is a great stress reliever!
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around"
              }}
            >
              <ActionButton
                text="Report&nbsp;a&nbsp;problem"
                onClick={this.handleClickOpen}
                large
                style={{
                  backgroundColor: "#002366",
                  color: "#fff",
                  width: 200,
                  height: 50,
                  borderRadius: 25,
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                  margin: "5px 0px"
                }}
              />
              <Dialog
                open={open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                fullScreen
              >
                <DialogTitle id="form-dialog-title">
                  Report a problem
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Report this error by filling in the form below.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="error"
                    placeholder="Help us fix this quickly by describing the error in as much detail as possible"
                    type="text"
                    fullWidth
                    value={report}
                    onChange={this.handleChange}
                    multiline
                    rows={4}
                    rowsMax={30}
                  />
                </DialogContent>
                <DialogActions style={{ marginRight: "80px" }}>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.reportError} color="primary">
                    Send
                  </Button>
                </DialogActions>
              </Dialog>
              <ActionButton
                text="Go&nbsp;Home"
                onClick={this.takeMeBackHome}
                large
                style={{
                  backgroundColor: "rgb(72, 125, 179)",
                  color: "#fff",
                  width: 200,
                  height: 50,
                  borderRadius: 25,
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                  margin: "5px 0px"
                }}
              />
            </div>
          </div>
          <span style={{ margin: "60px 0", fontSize: 12, color: "#808285" }}>
            &copy; Copyright 2012 -{moment().format("YYYY")}
          </span>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default withRouter(ErrorPage);
