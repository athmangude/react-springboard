/* eslint-disable no-nested-ternary, no-mixed-operators, radix */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-spinner-material";

import SurveyListItem from "./SurveyListItem";
import CircularButton from "SharedComponents/circular-button";
import ActionButton from "SharedComponents/action-button";

import USSDSidePanel from "./USSDSidePanel";

import * as accountsActions from "../../flux/actions";

@connect(
  () => ({}),
  dispatch => ({
    accountsActions: bindActionCreators(accountsActions, dispatch)
  })
)
export default class USSD extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    adminAuthentication: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.fetchUSSDSurveys = this.fetchUSSDSurveys.bind(this);
    this.onOpenSidePanel = this.onOpenSidePanel.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  state = {
    isFetchingUSSDSurveys: false,
    showSidePanel: false,
    surveys: [],
    totalCount: 0,
    activeSurvey: null
  };

  componentDidMount() {
    this.fetchUSSDSurveys();
  }

  onOpenSidePanel() {
    const { accountDetails } = this.props;
    this.context.router.history.push(
      `/accounts/${accountDetails.id}?panelView=configureUSSD`
    );
    this.setState({ showSidePanel: true });
  }

  onCloseSidePanel() {
    const { accountDetails } = this.props;
    this.setState({ showSidePanel: false, activeSurveyId: null });
    this.context.router.history.push(`/accounts/${accountDetails.id}`);
  }

  onEdit(survey) {
    this.setState({ activeSurvey: survey }, () => this.onOpenSidePanel());
  }

  onDelete(survey) {
    this.setState({ activeSurvey: survey }, () => {
      const { accountDetails } = this.props;
      this.context.router.history.push(
        `/accounts/${accountDetails.id}?panelView=deleteUSSD`
      );
      this.setState({ showSidePanel: true });
    });
  }

  async fetchUSSDSurveys(params = { type: "ACTIVE", limit: 15, offset: 0 }) {
    this.setState({ isFetchingUSSDSurveys: true });
    const { accountDetails } = this.props;

    try {
      const fetchUSSDSurveysResult = await this.props.accountsActions.fetchUSSDSurveys(
        accountDetails.id,
        params
      );
      this.setState({
        surveys: fetchUSSDSurveysResult.data.Data.objects,
        totalCount: fetchUSSDSurveysResult.data.Data.meta.totalCount
      });
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingUSSDSurveys: false });
    }
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <CircularButton
          className="primary cta"
          style={{ position: "fixed", top: 83, right: 20, zIndex: 1 }}
          icon="add"
          color="#002366"
          onClick={this.onOpenSidePanel}
        />
        {this.state.isFetchingUSSDSurveys ? (
          <div style={{ width: "100%", position: "relative" }}>
            <div
              style={{
                height: 200,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              <Spinner spinnerColor="#002366" size={50} spinnerWidth={4} />
              <span style={{ margin: 20 }}>
                Fetching Surveys with USSD configured
              </span>
            </div>
            <USSDSidePanel
              accountId={this.props.accountDetails.id}
              fetchUSSDSurveys={this.fetchUSSDSurveys}
              showSidePanel={this.state.showSidePanel}
              onCloseSidePanel={this.onCloseSidePanel}
              EventHandler={this.props.EventHandler}
              alertActions={this.props.alertActions}
            />
          </div>
        ) : this.state.surveys.length ? (
          <div style={{ width: "100%", position: "relative" }}>
            {this.state.surveys.map(survey => (
              <SurveyListItem
                key={survey.id}
                survey={survey}
                onEdit={this.onEdit}
                onDelete={this.onDelete}
              />
            ))}
            <USSDSidePanel
              accountId={this.props.accountDetails.id}
              fetchUSSDSurveys={this.fetchUSSDSurveys}
              survey={this.state.activeSurvey}
              showSidePanel={this.state.showSidePanel}
              onCloseSidePanel={this.onCloseSidePanel}
              EventHandler={this.props.EventHandler}
              alertActions={this.props.alertActions}
            />
          </div>
        ) : !this.state.surveys.length ? (
          <div style={{ width: "100%", position: "relative" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "100px 0 0"
              }}
            >
              <h2 style={{ fontWeight: "normal", fontSize: 24 }}>
                You do not have any surveys configured with USSD
              </h2>
              <ActionButton
                className="primary"
                large
                icon="add"
                text="Add USSD"
                onClick={this.onOpenSidePanel}
                style={{
                  backgroundColor: "#002366",
                  color: "#fff",
                  width: 200,
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                  borderRadius: 5
                }}
              />
            </div>
            <USSDSidePanel
              accountId={this.props.accountDetails.id}
              fetchUSSDSurveys={this.fetchUSSDSurveys}
              showSidePanel={this.state.showSidePanel}
              onCloseSidePanel={this.onCloseSidePanel}
              EventHandler={this.props.EventHandler}
              alertActions={this.props.alertActions}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
