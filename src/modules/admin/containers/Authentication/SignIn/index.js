import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
class SignIn extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    adminAuthenticationActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onSignIn = this.onSignIn.bind(this);
    this.onGoToSignUp = this.onGoToSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    username: "",
    password: "",
    isSigningIn: false,
    signInError: null,
    successfullySignedIn: null
  };

  onGoToSignUp() {
    this.context.router.history.push("/sign-up");
  }

  async onSignIn() {
    // eslint-disable-line consistent-return
    this.setState({
      isSigningIn: true,
      successfullySignedIn: null,
      signInError: false
    });

    try {
      const signInResult = await this.props.adminAuthenticationActions.authenticate(
        { username: this.state.username, password: this.state.password }
      );
      const { Metadata, ...userData } = signInResult.data;

      // this is super hacky and we should find a way to do it right
      this.props.adminAuthenticationActions.signIn(userData);
      this.setState({
        successfullySignedIn: true
      });

      this.props.EventHandler.trackEvent({
        category: "AdminAuthentication",
        action: "sign in",
        value: true
      });
      this.context.router.history.replace("/");
      window.location.reload();
    } catch (exception) {
      this.setState({
        signInError: true,
        successfullySignedIn: false
      });
      this.props.alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });

      this.props.EventHandler.trackEvent({
        category: "Authentication",
        action: "sign in",
        value: false
      });

      if (!exception.response) {
        return this.setState({
          signInError:
            "Network Error! Please check your internet connection and try again"
        });
      }

      if (exception.response && exception.response.status === 401) {
        return this.setState({
          signInError: exception.response.data.message
        });
      }
    } finally {
      this.setState({
        isSigningIn: false
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    console.log("LOADING SIGN IN");
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
          title="Sign In"
          meta={[
            {
              name: "description",
              content: "Sign in page for Spring board admin"
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
                        disabled={this.state.isSigningIn}
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={this.state.username}
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
                    </div>
                  </div>
                  <div className="field">
                    <div>
                      <input
                        disabled={this.state.isSigningIn}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
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
                    </div>
                  </div>
                </div>
                <div className="ui error message"></div>
              </form>
              <ActionButton
                text="Sign In"
                large
                primary
                onClick={this.onSignIn}
                loading={this.state.isSigningIn}
                disabled={
                  !(!!this.state.username && !!this.state.password) ||
                  this.state.isSigningIn
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
export default withAdminAuthentication(SignIn);
