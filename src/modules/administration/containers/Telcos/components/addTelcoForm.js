/* eslint-disable jsx-a11y/href-no-hash, no-array-index-key, no-nested-ternary, no-return-assign, no-shadow, object-curly-newline */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Formsy from "formsy-react";
import Switch from "react-switch";
import { connect } from "react-redux";

import Input from "SharedComponents/mwamba-input";
import Select from "SharedComponents/mwamba-dropdown-select";
import ActionButton from "SharedComponents/action-button";
import TextArea from "SharedComponents/mwamba-textarea";

@connect(state => ({
  adminAuthentication: state.adminAuthentication
}))
class AddTelcoForm extends Component {
  static propTypes = {
    countries: PropTypes.array,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    telcoActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onValidSubmit = this.onValidSubmit.bind(this);
    this.onValid = this.onValid.bind(this);
    this.onInvalid = this.onInvalid.bind(this);

    const { countries } = this.props;

    this.state = {
      isFormValid: false,
      validSubmit: false,
      isUpdating: false,
      country: null,
      countries: countries || [],
      commDomain: null,
      commDomains: null,
      commDomainsList: [],
      networkId: null,
      length: [],
      isActive: false
    };

    this.createTelco = this.createTelco.bind(this);
    this.fetchCommDomains = this.fetchCommDomains.bind(this);
  }

  componentDidMount() {
    this.fetchCommDomains();
  }

  componentWillUnmount() {}

  onInvalidSubmit() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: "Telco", action: "invalid submit" });
    this.setState({ validSubmit: false });
  }

  onValidSubmit() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: "Telco", action: "invalid submit" });
    this.setState({ validSubmit: true }, () => this.createTelco());
  }

  onValid() {
    this.setState({ isFormValid: true, validSubmit: true });
  }

  onInvalid() {
    this.setState({ isFormValid: false });
  }

  onChangeNetworkId = e => {
    this.setState({ networkId: e.target.value });
  };

  onChangeCountry = e => {
    this.setState({ country: e.value });
  };

  onChangeCommDomain = e => {
    this.setState({ commDomain: e.value });
  };

  onChangeLengths = e => {
    const myNumberArray = e.target.value
      .split(/\D/)
      .filter(Boolean)
      .map(values => parseInt(values, 10));
    this.setState({ length: [...myNumberArray] });
  };

  onSwitchToggled = e => {
    this.setState({ isActive: e });
  };

  getCommDomainsList = () => {
    const { commDomains } = this.state;
    const aggregatedList = [];
    commDomains.forEach(commDomain => {
      commDomain.commDomains.forEach(subCommDomain => {
        aggregatedList.push({
          label: subCommDomain,
          value: aggregatedList.length + 1
        });
      });
    });
    this.setState({ commDomainsList: aggregatedList });
  };

  async fetchCommDomains() {
    const { alertActions, EventHandler, telcoActions } = this.props;
    try {
      this.setState({ isLoading: true });
      const commDomainsResult = await telcoActions.fetchCommDomains();
      alertActions.addAlert({
        type: "success",
        message: "Comm Domains fetched succesfully!"
      });
      this.setState({ commDomains: commDomainsResult.data.Data });
    } catch (exception) {
      let errorMessage =
        "Oops! Something went wrong and we could not fetch commDomains. Please try again later.";
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
      this.getCommDomainsList();
    }
  }

  async createTelco() {
    const {
      telcoActions,
      alertActions,
      EventHandler,
      onCloseSidePanel
    } = this.props;
    const {
      networkId,
      commDomain,
      country,
      isActive,
      length,
      commDomainsList
    } = this.state;
    const payload = {
      active: isActive,
      commDomain: commDomainsList.filter(value => value.value === commDomain)[0]
        .label,
      countryId: country,
      id: networkId.id,
      networkId,
      validCommIdLengths: length
    };
    this.setState({ isUpdating: true });
    try {
      await telcoActions.createNetworkIDs(payload);
      alertActions.addAlert({
        type: "success",
        message: "Telco created succesfully!"
      });
      await telcoActions.fetchSupportedCountries();
    } catch (exception) {
      const errorMessage =
        "Oops! Something went wrong and we could not create Telco. Please try again later.";

      alertActions.addAlert({ type: "error", message: errorMessage });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isUpdating: false });
      onCloseSidePanel();
    }
  }

  render() {
    const {
      isFormValid,
      networkId,
      commDomain,
      commDomainsList,
      country,
      countries,
      isActive,
      isUpdating,
      length
    } = this.state;

    const countryList = [];
    countries.map(country =>
      countryList.push({ label: country.name, value: country.id })
    );

    return (
      <Formsy
        ref={f => (this.form = f)}
        onValidSubmit={this.onValidSubmit}
        onInvalidSubmit={this.onInvalidSubmit}
        onValid={this.onValid}
        onInvalid={this.onInvalid}
        style={{ padding: "10px 10px", width: "100%" }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            margin: "10px 3px"
          }}
        >
          <small>Country</small>
          <Select
            name="country"
            type="text"
            options={countryList}
            value={country}
            onChange={this.onChangeCountry}
            placeholder="Select a country"
            style={{ width: "100%" }}
            required
          />
        </div>
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            margin: "10px 3px"
          }}
        >
          <small>Comm Domain</small>
          <Select
            name="commDomain"
            type="text"
            options={commDomainsList}
            value={commDomain}
            onChange={this.onChangeCommDomain}
            placeholder="Select a telco"
            style={{ width: "100%" }}
            required
          />
        </div>

        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            margin: "10px 3px"
          }}
        >
          <small>Network ID</small>
          <Input
            name="networkId"
            value={networkId}
            onChange={this.onChangeNetworkId}
            required
          />
        </div>
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            margin: "10px 3px"
          }}
        >
          <small>Lengths</small>
          <TextArea
            name="length"
            value={length}
            onChange={this.onChangeLengths}
            required
          />
        </div>
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            margin: "10px 3px"
          }}
        >
          <small>Active</small>
          <Switch
            name="activeNetworkID"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            checked={isActive}
            onChange={this.onSwitchToggled}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActionButton
            type="submit"
            className="primary"
            text="Submit"
            disabled={!isFormValid || isUpdating}
            loading={isUpdating}
            large
            style={{
              backgroundColor: "#002366",
              color: "#fff",
              width: 200,
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
              borderRadius: 5
            }}
          />
        </div>
      </Formsy>
    );
  }
}
export default AddTelcoForm;
