/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from "react";
import Spinner from "react-spinner-material";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SimpleLayout from "Layouts/simple-layout";
import Accordion from "SharedComponents/mwamba-accordion/Accordion";
import withAdminAuthentication from "Utils/withAdminAuthentication";
import ActionButton from "SharedComponents/action-button";
import TelcoSidePanel from "./components/telcosSidePanel";
import AddTelcoFrom from "./components/addTelcoForm";

import CommDomain from "./components/commDomain";

import * as EventHandler from "Utils/EventHandler";
import * as alertActions from "Modules/voc/containers/App/Alerts/flux/actions";
import * as telcoActions from "./flux/actions";

@connect(
  state => ({
    adminAuthentication: state.adminAuthentication
  }),
  dispatch => ({
    telcoActions: bindActionCreators(telcoActions, dispatch),
    alertActions: bindActionCreators(alertActions, dispatch),
    dispatch
  })
)
class Telcos extends Component {
  static propTypes = {
    telcoActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.fetchSupportedCountries = this.fetchSupportedCountries.bind(this);
  }

  state = {
    countries: [],
    isLoading: false,
    showSidePanel: false,
    title: "Add New Telco"
  };

  componentDidMount() {
    this.fetchSupportedCountries();
  }

  onShowSidePanel = () => {
    this.setState({ showSidePanel: true });
  };

  onCloseSidePanel = () => {
    this.setState({ showSidePanel: false });
  };

  async fetchSupportedCountries() {
    const { telcoActions } = this.props;
    try {
      this.setState({ isLoading: true });
      const countriesResult = await telcoActions.fetchSupportedCountries();
      alertActions.addAlert({
        type: "success",
        message: "Countries fetched succesfully!"
      });
      this.setState({ countries: countriesResult.data.Data.items });
    } catch (exception) {
      let errorMessage =
        "Oops! Something went wrong and we could not fetch countries. Please try again later.";

      if (Object.keys(exception).includes("message")) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes("response")) {
        if (
          Object.keys(exception.response).includes("data") &&
          Object.keys(exception.response.data.message)
        ) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      alertActions.addAlert({ type: "error", message: errorMessage });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { countries, isLoading, showSidePanel, title } = this.state;
    const { telcoActions, alertActions, EventHandler } = this.props;

    return (
      <SimpleLayout
        className="account"
        action={() => (
          <ActionButton
            className="primary"
            icon="add"
            text="Add Telco"
            onClick={this.onShowSidePanel}
            large
            style={{
              backgroundColor: "#002366",
              color: "#fff",
              width: 200,
              height: 50,
              borderRadius: 25,
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)"
            }}
          />
        )}
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
            <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
            <span style={{ margin: 20 }}>Fetching Telcos</span>
          </div>
        ) : countries.length === 0 ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              flexDirection: "column",
              marginBottom: "20px",
              marginTop: "20px"
            }}
          >
            <span style={{ textAlign: "center" }}>
              We could not find any Telcos.
            </span>
          </div>
        ) : (
          <div>
            <Accordion
              allowMultipleOpen={false}
              accordionStyle={{
                backgroundColor: "transparent",
                padding: "5px 5px",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "none"
                // borderTop: "none",
              }}
            >
              {countries.map(country => (
                <div label={country.name} key={country.id}>
                  <CommDomain
                    country={country}
                    alertActions={alertActions}
                    EventHandler={EventHandler}
                    countries={countries}
                    telcoActions={telcoActions}
                  />
                </div>
              ))}
            </Accordion>
            <TelcoSidePanel
              showSidePanel={showSidePanel}
              onCloseSidePanel={this.onCloseSidePanel}
              title={title}
            >
              <AddTelcoFrom
                alertActions={alertActions}
                EventHandler={EventHandler}
                countries={countries}
                telcoActions={telcoActions}
              />
            </TelcoSidePanel>
          </div>
        )}
      </SimpleLayout>
    );
  }
}
export default withAdminAuthentication(Telcos);
