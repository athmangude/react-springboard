import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Message } from "semantic-ui-react";
import PropTypes from "prop-types";
import moment from "moment";
import { Helmet } from "react-helmet";
import Intercom from "react-intercom";
import Alerts from "Modules/voc/containers/App/Alerts";
import ActionButton from "SharedComponents/action-button";

import withAdminAuthentication from "Utils/withAdminAuthentication";
import * as adminAuthenticationActions from "../flux/actions";

import logo from "Images/logo.png";
import wrapperBackground from "Images/empty_list_background.png";

@connect(
  state => ({
    adminAuthentication: state.adminAuthentication
  }),
  dispatch => ({
    adminAuthenticationActions: bindActionCreators(
      adminAuthenticationActions,
      dispatch
    )
  })
)
class ResetPassword extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    adminAuthenticationActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onGoToSignIn = this.onGoToSignIn.bind(this);
    this.onResetPassword = this.onResetPassword.bind(this);
    this.onFetchTokenUser = this.onFetchTokenUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  state = {
    password: "",
    confirmationPassword: "",
    isSubmitting: false,
    doPasswordsMatch: -1,
    success: false,
    resetPasswordError: null,
    user: {}
  };

  componentDidMount() {
    this.onFetchTokenUser();
  }

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onResetPassword();
    }
  }

  onGoToSignIn() {
    this.context.router.history.push("/sign-in");
  }

  async onResetPassword() {
    // eslint-disable-line consistent-return
    this.setState({
      isSubmitting: true
    });

    const { password, confirmationPassword, user } = this.state;
    const token = this.context.router.route.match.params.token;
    if (password !== confirmationPassword) {
      this.setState({
        isSubmitting: false
      });
      return;
    }

    /**
     * ^ The password string will start this way
     * (?=.*[a-z]) The string must contain at least 1 lowercase alphabetical character
     * (?=.*[A-Z]) The string must contain at least 1 uppercase alphabetical character
     * (?=.*[0-9]) The string must contain at least 1 numeric character
     * (?=.[!@#\$%\^&]) The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
     * (?=.{8,}) The string must be eight characters or longer
     */
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
      password
    );
    if (!strong) {
      this.setState({
        isSubmitting: false,
        resetPasswordError:
          "password must be at least 8 characters long, contain a numeric character, have at least one lower case alphabetic character, one uppercase alphabetic character and one special character"
      });
      return;
    }

    try {
      await this.props.adminAuthenticationActions.resetPassword(user.id, {
        password,
        updateToken: token
      });
      this.setState({ success: true });
      setInterval(() => this.onGoToSignIn(), 3000);
    } catch (exception) {
      if (!exception.response) {
        this.setState({
          resetPasswordError:
            "Network Error! We could not submit your request you while offline. Also check if you are using HTTPS"
        });
      } else if (exception.response && exception.response.status === 401) {
        this.setState({
          resetPasswordError: exception.response.data.message
        });
      }
    } finally {
      this.setState({
        isSubmitting: false
      });
    }
  }

  async onFetchTokenUser() {
    const token = this.context.router.route.match.params.token;
    try {
      const onFetchTokenUserResult = await this.props.adminAuthenticationActions.fetchTokenUser(
        token
      );
      this.setState({ user: onFetchTokenUserResult.data.data.Data.user });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({
        type: "error",
        message: exception.response.data.message
      });
    }
  }

  handleChangePassword(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { password, confirmationPassword } = this.state;
      if (
        !!password &&
        !!confirmationPassword &&
        password !== confirmationPassword
      ) {
        this.setState({ doPasswordsMatch: 0 });
      } else if (
        !!password &&
        !!confirmationPassword &&
        password === confirmationPassword
      ) {
        this.setState({ doPasswordsMatch: 1 });
      } else {
        this.setState({ doPasswordsMatch: -1 });
      }
    });
  }

  render() {
    return (
      <div
        className="login-wrapper"
        style={{
          background: "linear-gradient(0.25turn, #FFFFFF, #F0F3F3)",
          height: "100vh",
          width: "100vw"
        }}
      >
        <Helmet
          title="Reset Password"
          meta={[
            {
              name: "description",
              content: "Reset password page for Ajua administration platform"
            }
          ]}
        />
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundImage: `url(${wrapperBackground})`,
            backgroundSize: "cover"
          }}
        >
          <Alerts />
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFF",
                flexDirection: "column",
                padding: 20,
                borderRadius: 10,
                maxWidth: 392,
                boxShadow: "0 0 3px #d9d9d9, 0 3px 2px #d9d9d9"
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  marginBottom: 10
                }}
              >
                <img
                  src={logo}
                  className="image"
                  alt="logo"
                  style={{ height: 40, width: 40, margin: "0 0 10px" }}
                />
                <h2 style={{ fontWeight: "normal", margin: 0 }}>Sign In</h2>
                <p>to access the administration area</p>
              </div>
              <form
                className="ui large form"
                action="#"
                style={{ width: 260 }}
                onSubmit={this.onSignIn}
              >
                <div className="ui stacked">
                  <div className="field">
                    <div>
                      <input
                        disabled
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.user.email}
                        style={{
                          borderRadius: 0,
                          borderTop: "none",
                          borderRight: "none",
                          borderLeft: "none",
                          borderBottom: "1px solid #D8D8D8",
                          padding: "10px 5px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div>
                      <input
                        disabled={this.state.isSubmitting}
                        type="password"
                        name="password"
                        placeholder="Password"
                        onKeyDown={this.onKeyDown}
                        value={this.state.password}
                        onChange={this.handleChangePassword}
                        style={{
                          borderRadius: 0,
                          borderTop: "none",
                          borderRight: "none",
                          borderLeft: "none",
                          borderBottom: "1px solid #D8D8D8",
                          padding: "10px 5px"
                        }}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <input
                        type="password"
                        name="confirmationPassword"
                        onKeyDown={this.onKeyDown}
                        placeholder="Confirmation password"
                        value={this.state.confirmationPassword}
                        onChange={this.handleChangePassword}
                        style={{
                          borderRadius: 0,
                          borderTop: "none",
                          borderRight: "none",
                          borderLeft: "none",
                          borderBottom: "1px solid #D8D8D8",
                          padding: "10px 5px"
                        }}
                      />
                      {this.state.doPasswordsMatch === 1 ? (
                        <i
                          className="material-icons"
                          style={{ fontSize: 15, color: "#80c582" }}
                        >
                          check
                        </i>
                      ) : this.state.doPasswordsMatch === 0 ? (
                        <i
                          className="material-icons"
                          style={{ fontSize: 15, color: "#f26b50" }}
                        >
                          clear
                        </i>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="ui error message"></div>
              </form>
              {this.state.success ? (
                <Message
                  color="green"
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    textAlign: "center"
                  }}
                >
                  Successfully reset password. Redirecting to login page...
                </Message>
              ) : null}
              {this.state.resetPasswordError ? (
                <Message
                  color="red"
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    textAlign: "center"
                  }}
                >
                  {this.state.resetPasswordError}
                </Message>
              ) : null}
              <ActionButton
                text="Reset Password"
                large
                primary
                onClick={this.onResetPassword}
                loading={this.state.isSubmitting}
                disabled={
                  !this.state.password ||
                  !this.state.confirmationPassword ||
                  this.state.isSubmitting
                }
                style={{
                  width: "100%",
                  padding: 15,
                  backgroundColor: "#DB2828",
                  color: "#fff",
                  margin: "20px 0 10px"
                }}
              />
              <br />
              <p>
                <a href="/sign-in" style={{ color: "#BF2A2B" }}>
                  Sign In
                </a>
              </p>
              <p style={{ marginTop: 30 }}>
                &copy; Copyright 2012 - {`${moment().format("YYYY")}`}
              </p>
            </div>
          </div>
        </div>
        <Intercom appID="ktbsj3ci" />
      </div>
    );
  }
}

// export default SignIn;
export default withAdminAuthentication(ResetPassword);
