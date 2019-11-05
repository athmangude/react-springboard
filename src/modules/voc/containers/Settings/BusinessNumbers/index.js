/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline, no-shadow */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Spinner from "react-spinner-material";

import CircularButton from "SharedComponents/circular-button";
import PaginationNext from "SharedComponents/pagination-next";
import SearchBar from "SharedComponents/search-bar";
import ActionButton from "SharedComponents/action-button-styled";
import withAuthentication from "Utils/withAuthentication";
import SettingsNavigationContainer from "../components/SettingsNavigationContainer";
import TabMenu from "Modules/administration/containers/Accounts/Account/TabMenu";

import * as businessNumberActions from "./flux/actions";
import * as conversationActions from "../../Conversations/flux/actions";

import BusinessNumber from "./components/BusinessNumber";
import BusinessNumbersUpload from "./BusinessNumbersUpload";
import EditBusinessNumber from "./components/EditBusinessNumber";
import ViewBusinessNumber from "./components/ViewBusinessNumber";

const tabs = [{ label: "Active" }, { label: "Disabled" }];

@connect(
  state => ({
    businessNumbers: state.businessNumbers,
    route: state.route
  }),
  dispatch => ({
    businessNumberActions: bindActionCreators(businessNumberActions, dispatch),
    conversationActions: bindActionCreators(conversationActions, dispatch),
    dispatch
  })
)
class BusinessNumbers extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    businessNumbers: PropTypes.object.isRequired,
    EventHandler: PropTypes.func,
    alertActions: PropTypes.func,
    businessNumberActions: PropTypes.func,
    conversationActions: PropTypes.func,
    route: PropTypes.object
  };

  constructor(props) {
    super(props);

    const params = new URL(document.location).searchParams;

    this.state = {
      isFetchingBusinessNumbers: false,
      surveyId: null,
      currentPage: params.page ? parseInt(params.page, 10) : 1,
      limit: 12,
      offset: 0,
      sidePanel: null,
      showSidePanel: false,
      selectedTab: "Active",
      isBusinessNumberActive: true
    };

    this.onChangeSurvey = this.onChangeSurvey.bind(this);
    this.onAddBusinessNumber = this.onAddBusinessNumber.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(
      this
    );
    this.fetchBusinessNumbers = this.fetchBusinessNumbers.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onView = this.onView.bind(this);
  }

  componentWillMount() {
    const { router } = this.context;
    const { history } = router;
    const { route } = this.props;
  }

  onAddBusinessNumber() {
    const { EventHandler, alertActions } = this.props;
    this.setState({
      showSidePanel: true,
      sidePanel: (
        <BusinessNumbersUpload
          onCloseSidePanel={this.onCloseSidePanel}
          EventHandler={EventHandler}
          alertActions={alertActions}
        />
      )
    });
  }

  onView(businessNumber) {
    const { EventHandler, alertActions } = this.props;
    this.setState({
      showSidePanel: true,
      sidePanel: (
        <ViewBusinessNumber
          onCloseSidePanel={this.onCloseSidePanel}
          businessNumber={businessNumber}
          EventHandler={EventHandler}
          alertActions={alertActions}
        />
      )
    });
  }

  onEdit(businessNumber) {
    const { EventHandler, alertActions, businessNumberActions } = this.props;
    const { surveyId } = this.state;
    this.setState({
      showSidePanel: true,
      sidePanel: (
        <EditBusinessNumber
          onCloseSidePanel={this.onCloseSidePanel}
          businessNumber={businessNumber}
          businessNumberActions={businessNumberActions}
          surveyId={surveyId}
          EventHandler={EventHandler}
          alertActions={alertActions}
        />
      )
    });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onChangeSurvey(value) {
    const name = "surveyId";
    this.setState({ [name]: value.id, offset: 0, currentPage: 1 }, () => {
      this.fetchBusinessNumbers();
    });
  }

  onPaginationNextPageChange({ offset }) {
    const { router } = this.context;
    const { limit } = this.state;
    const nextPage = offset / limit + 1;

    this.setState({ currentPage: nextPage, offset: offset + limit }, () => {
      const { history } = router;
      const { route } = this.props;
      history.push(`${route.location.pathname}?page=${parseInt(nextPage, 10)}`);

      this.fetchBusinessNumbers();
    });
  }

  onCancel() {
    this.setState({ surveyId: null, offset: 0 });
  }

  onTabSelected(selectedTab) {
    this.setState({
      selectedTab,
      isBusinessNumberActive: selectedTab === "Active"
    });
  }

  async fetchBusinessNumbers() {
    const { EventHandler, businessNumberActions } = this.props;
    this.setState({ isFetchingBusinessNumbers: true });
    const { surveyId, limit, offset } = this.state;
    try {
      const fetchBusinessNumbersResult = await businessNumberActions.fetchBusinessNumbers(
        surveyId,
        limit,
        offset
      );
      businessNumberActions.setBusinessNumbers(
        fetchBusinessNumbersResult.data.data.Data.items,
        fetchBusinessNumbersResult.data.data.Data.totalCount,
        1
      );
      EventHandler.trackEvent({
        category: "BusinessNumbers",
        action: "fetch business numbers",
        value: true
      });
    } catch (exception) {
      EventHandler.trackEvent({
        category: "BusinessNumbers",
        action: "fetch business numbers",
        value: false
      });
    } finally {
      this.setState({
        isFetchingBusinessNumbers: false,
        offset: limit + offset
      });
    }
  }

  render() {
    const {
      businessNumbers,
      businessNumberActions,
      conversationActions,
      EventHandler
    } = this.props;
    const {
      surveyId,
      isFetchingBusinessNumbers,
      isBusinessNumberActive,
      selectedTab,
      currentPage,
      showSidePanel,
      sidePanel
    } = this.state;
    return (
      <SettingsNavigationContainer
        searchBar={
          <SearchBar
            placeholder="search surveys"
            searchAction={conversationActions.searchSurveys}
            dataProp="objects"
            itemDisplayProp="title"
            itemOnClickAction={this.onChangeSurvey}
          />
        }
        topRightComponent={
          <TabMenu
            tabs={tabs}
            selectedTab={selectedTab}
            onTabSelected={this.onTabSelected}
            style={{ backgroundColor: "inherit", borderBottom: "none" }}
          />
        }
        pagination={
          surveyId && businessNumbers.totalCount ? (
            <PaginationNext
              totalItems={
                businessNumbers.totalCount ? businessNumbers.totalCount : 0
              }
              perPage={12}
              onPageChange={this.onPaginationNextPageChange}
              isLoading={isFetchingBusinessNumbers}
              currentPage={parseInt(currentPage, 10) - 1}
              visibleItems={businessNumbers.items.length}
            />
          ) : null
        }
        sidePanel={showSidePanel ? sidePanel : null}
        EventHandler={EventHandler}
      >
        <CircularButton
          className="primary cta"
          style={{ position: "fixed", top: 100, right: 20, zIndex: 1 }}
          icon="add"
          color="#002366"
          onClick={this.onAddBusinessNumber}
        />
        {isFetchingBusinessNumbers ? (
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
            <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
            <span style={{ margin: 20 }}>Loading Business Numbers</span>
          </div>
        ) : !surveyId ? (
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
              Select a survey to view the business numbers
            </h2>
            <div style={{ marginBottom: 15 }}>OR</div>
            <ActionButton
              className="primary"
              large
              icon="add"
              text="Add"
              onClick={this.onAddBusinessNumber}
              style={{
                backgroundColor: "#002366",
                color: "#fff",
                width: 200,
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                borderRadius: 5
              }}
            />
          </div>
        ) : surveyId && !businessNumbers.items.length ? (
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
              There are no business numbers added to this survey
            </h2>
            <ActionButton
              className="primary"
              large
              icon="add"
              text="Add"
              onClick={this.onAddBusinessNumber}
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
            {businessNumbers.items
              .filter(
                businessNumber =>
                  businessNumber.status === isBusinessNumberActive
              )
              .map(businessNumber => (
                <BusinessNumber
                  key={businessNumber.business_identifier}
                  onEdit={this.onEdit}
                  onView={this.onView}
                  businessNumber={businessNumber}
                  businessNumberActions={businessNumberActions}
                  conversationActions={conversationActions}
                  surveyId={surveyId}
                />
              ))}
          </div>
        )}
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(BusinessNumbers);
