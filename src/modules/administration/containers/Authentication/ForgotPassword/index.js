import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Message, Popup } from "semantic-ui-react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import moment from "moment";
import Intercom from "react-intercom";
import Alerts from "Modules/voc/containers/App/Alerts";
import ActionButton from "SharedComponents/action-button";

import withAdminAuthentication from "Utils/withAdminAuthentication";
import * as adminAuthenticationActions from "../flux/actions";

import logo from "Images/logo.png";
import wrapperBackground from "Images/empty_list_background.png";

const callBackUrl = window.location.origin.concat("/reset-password/");

const isValidEmail = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

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
class ForgotPassword extends Component {
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
    this.onForgotPassword = this.onForgotPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    email: "",
    isInvalidEmail: null,
    isSubmitting: false,
    forgotPasswordError: null,
    successMessage: null
  };

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onForgotPassword();
    }
  }

  async onForgotPassword() {
    // eslint-disable-line consistent-return
    this.setState({
      isSubmitting: true
    });

    if (!isValidEmail(this.state.email)) {
      this.setState({ isInvalidEmail: true, isSubmitting: false });
      return;
    }

    try {
      const forgotPasswordResult = await this.props.adminAuthenticationActions.forgotPassword(
        { email: this.state.email, callBackUrl }
      );
      this.setState({ successMessage: forgotPasswordResult.data.data.Data });
    } catch (exception) {
      if (!exception.response) {
        this.setState({
          forgotPasswordError:
            "Network Error! We could not submit your request you while offline. Also check if you are using HTTPS"
        });
      } else if (exception.response && exception.response.status === 401) {
        this.setState({
          forgotPasswordError: exception.response.data.message
        });
      }
    } finally {
      this.setState({
        isSubmitting: false
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isInvalidEmail: false
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
          title="Forgot Password"
          meta={[
            {
              name: "description",
              content: "Forgot password page for Springboard admin"
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
                <h2 style={{ fontWeight: "normal", margin: 0 }}>
                  Forgot Password
                </h2>
                <p>Provide email and we'll send you a password reset link</p>
              </div>
              <form
                className="ui large form"
                action="#"
                style={{ width: "100%" }}
                onSubmit={this.onSignIn}
              >
                <div className="ui stacked">
                  <div className="field">
                    <div>
                      <input
                        disabled={this.state.isSubmitting}
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={this.state.email}
                        onKeyDown={this.onKeyDown}
                        onChange={this.handleChange}
                        style={{
                          borderRadius: 0,
                          borderTop: "none",
                          borderRight: "none",
                          borderLeft: "none",
                          borderBottom: "1px solid #D8D8D8",
                          padding: "10px 5px"
                        }}
                      />
                      {this.state.isInvalidEmail ? (
                        <Popup
                          trigger={<i className="material-icons">clear</i>}
                          content={
                            <span
                              style={{
                                color: "#fff",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              Invalid email address
                            </span>
                          }
                          basic
                          inverted
                          hoverable
                          style={{
                            padding: "2px 5px",
                            backgroundColor: "#58595b"
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="ui error message"></div>
              </form>
              {this.state.successMessage ? (
                <Message
                  color="green"
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    textAlign: "center"
                  }}
                >
                  {this.state.successMessage}
                </Message>
              ) : null}
              {this.state.forgotPasswordError ? (
                <Message
                  color="red"
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    textAlign: "center"
                  }}
                >
                  {this.state.forgotPasswordError}
                </Message>
              ) : null}
              <ActionButton
                text="Submit"
                large
                primary
                onClick={this.onForgotPassword}
                loading={this.state.isSubmitting}
                disabled={!this.state.email || this.state.isSigningIn}
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
export default withAdminAuthentication(ForgotPassword);
