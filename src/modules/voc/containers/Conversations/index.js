/* eslint-disable jsx-a11y/href-no-hash, radix, no-nested-ternary, no-shadow */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import Hashids from "hashids";
import Spinner from "react-spinner-material";

import WideConversationListItem from "./components/WideConversationListItem";
import PaginationNext from "SharedComponents/pagination-next";
import SearchBar from "SharedComponents/search-bar";
import CircularButton from "SharedComponents/circular-button";
import SimpleLayoutExtended from "Layouts/simple-layout-extended";
import withAuthentication from "Utils/withAuthentication";

import ActionButton from "SharedComponents/action-button-styled";

import themes from "SharedComponents/themes";

const { primaryColor } = themes.light;

import * as conversationActions from "./flux/actions";
import * as audiencesActions from "Modules/voc/containers/Settings/Audiences/flux/actions";

import "./index.css";

@connect(
  state => ({
    audiences: state.audiences,
    authentication: state.authentication,
    conversations: state.conversations,
    loggedInUserRole: state.roles.loggedInUserRole,
    account: state.account,
    history: state.history,
    route: state.route
  }),
  dispatch => ({
    audiencesActions: bindActionCreators(audiencesActions, dispatch),
    conversationActions: bindActionCreators(conversationActions, dispatch),
    dispatch
  })
)
@observer
class ConversationList extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    conversations: PropTypes.object.isRequired,
    authentication: PropTypes.object.isRequired,
    loggedInUserRole: PropTypes.object,
    route: PropTypes.object.isRequired,
    conversationActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    audiencesActions: PropTypes.object.isRequired,
    audiences: PropTypes.object.isRequired,
    windowDimensions: PropTypes.object,
    account: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const params = new URL(document.location).searchParams;

    this.state = {
      isLoading: false,
      type: "active",
      isFetchingAudiences: false,
      currentPage: params.page ? parseInt(params.page) : 1
    };

    this.onViewSurvey = this.onViewSurvey.bind(this);
    this.fetchConversations = this.fetchConversations.bind(this);
    this.onSwitchTab = this.onSwitchTab.bind(this);
    this.encodeSurveyId = this.encodeSurveyId.bind(this);
    this.onFetchAudiences = this.onFetchAudiences.bind(this);
    this.onViewReport = this.onViewReport.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(
      this
    );
    this.onCreateSurvey = this.onCreateSurvey.bind(this);
  }

  componentWillMount() {
    this.timer = null;
    const { router } = this.context;
    this.setState({
      type: router.route.match.params.type
        ? router.route.match.params.type
        : "active"
    });
  }

  componentDidMount() {
    this.fetchConversations(1);
    this.onFetchAudiences();
  }

  onCreateSurvey() {
    const { loggedInUserRole, alertActions } = this.props;
    if (!loggedInUserRole || loggedInUserRole.name !== "ADMIN") {
      alertActions.addAlert({
        type: "error",
        message: "Your account role does not allow you to create a survey"
      });
    } else {
      const { router } = this.context;
      router.history.push("/surveys/new");
    }
  }

  onViewSurvey(id, type) {
    const { router } = this.context;
    return router.history.push(
      `/surveys/${this.encodeSurveyId(id)}/report/${type}`
    );
  }

  async onFetchAudiences() {
    this.setState({ isFetchingAudiences: true });
    const { EventHandler, audiencesActions } = this.props;
    try {
      const fetchAudiencesResult = await audiencesActions.fetchSelectableAudiences();
      const fetchAudiencesResultLength =
        fetchAudiencesResult.data.Data.panelsOwned.length +
        fetchAudiencesResult.data.Data.panelsSharedWithAccount.length;
      audiencesActions.setAudiences(
        fetchAudiencesResult.data.Data,
        fetchAudiencesResultLength,
        1
      );
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({
        isFetchingAudiences: false
      });
    }
  }

  onPaginationNextPageChange({ offset }) {
    const nextPage = offset / 12 + 1;

    this.setState({ currentPage: nextPage }, () => {
      const { router } = this.context;
      const { history, route } = router;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage)}`);

      this.fetchConversations(nextPage);
    });
  }

  onSwitchTab(type) {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({
      category: "survey",
      action: "survey list type change",
      value: type
    });
    this.setState({ type }, () => this.fetchConversations(1));
  }

  onViewReport(conversation) {
    const { router } = this.context;
    return router.history.push(
      `/surveys/${this.encodeSurveyId(
        conversation.id
      )}/report/${conversation.objective.toLowerCase()}`
    );
  }

  encodeSurveyId(surveyId) {
    const hashids = new Hashids("&%^%#$&^(*^&&^$%@#%@", 15);
    return hashids.encode(surveyId);
  }

  async fetchConversations(page) {
    this.setState({ isLoading: true });
    const { EventHandler, conversationActions } = this.props;
    const { type } = this.state;

    try {
      const fetchConversationsResult = await conversationActions.fetchConversations(
        page,
        type
      );
      conversationActions.setConversations(
        {
          items: fetchConversationsResult.data.Data.objects,
          page,
          totalCount: fetchConversationsResult.data.Data.meta.totalCount
        },
        type
      );
    } catch (exception) {
      console.log("[exception]", exception);
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const {
      windowDimensions,
      audiences: audiencesList,
      conversations,
      conversationActions,
      audiencesActions,
      EventHandler,
      alertActions,
      authentication,
      loggedInUserRole,
      account
    } = this.props;
    const { type, isLoading, currentPage, isFetchingAudiences } = this.state;
    const audiences = {
      items: [
        ...audiencesList.items.panelsOwned,
        ...audiencesList.items.panelsSharedWithAccount
      ]
    };
    return (
      <SimpleLayoutExtended
        action={size => {
          if (size === "small") {
            return (
              <CircularButton
                className="primary cta"
                icon="add"
                small
                color="#002366"
                onClick={this.onCreateSurvey}
              />
            );
          }

          return (
            <ActionButton
              icon="add"
              text="Create Survey"
              onClick={this.onCreateSurvey}
              large
              style={{
                width: 200,
                height: 50,
                borderRadius: 25,
                boxShadow: "0 0 3px rgba(0, 0, 0, 0.3)"
              }}
            />
          );
        }}
        actions={
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Link to="/surveys" onClick={() => this.onSwitchTab("active")}>
              <ActionButton text="Active" />
            </Link>
            <Link to="/surveys/draft" onClick={() => this.onSwitchTab("draft")}>
              <ActionButton text="Drafts" />
            </Link>
            <Link
              to="/surveys/inactive"
              onClick={() => this.onSwitchTab("inactive")}
            >
              <ActionButton text="Deactivated" />
            </Link>
          </div>
        }
        searchBar={
          <SearchBar
            placeholder="search surveys"
            searchAction={conversationActions.searchSurveys}
            dataProp="objects"
            itemDisplayProp="title"
            itemOnClickAction={this.onViewReport}
          />
        }
        pagination={
          <PaginationNext
            totalItems={
              conversations[type].totalCount
                ? conversations[type].totalCount
                : 0
            }
            perPage={12}
            onPageChange={this.onPaginationNextPageChange}
            isLoading={isLoading}
            currentPage={parseInt(currentPage, 10) - 1}
            visibleItems={conversations[type].items.length}
          />
        }
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column"
          }}
        >
          {isLoading ? (
            <div
              style={{
                width: "100%",
                padding: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner spinnerColor={primaryColor} size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Loading surveys</span>
            </div>
          ) : !conversations[type].items ? (
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
                No surveys...yet!
              </h2>
              <ActionButton
                className="primary"
                large
                icon="add"
                text="Create Surveys"
                onClick={this.onCreateSurvey}
                style={{
                  backgroundColor: "#002366",
                  color: "#fff",
                  width: 200,
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                  borderRadius: 5
                }}
              />
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  width: "100%"
                }}
              >
                {conversations[type].items
                  .filter(item => item !== null)
                  .map(conversation => (
                    <WideConversationListItem
                      account={account}
                      audiences={audiences}
                      loggedInUserRole={loggedInUserRole}
                      audiencesActions={audiencesActions}
                      isFetchingAudiences={isFetchingAudiences}
                      EventHandler={EventHandler}
                      alertActions={alertActions}
                      key={conversation.id}
                      conversation={conversation}
                      conversationActions={conversationActions}
                      listType={type}
                      windowDimensions={windowDimensions}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(ConversationList);
