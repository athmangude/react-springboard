/* eslint-disable radix, no-return-assign */

import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Formsy from "formsy-react";
import { Label } from "semantic-ui-react";
import { DateRangePicker } from "react-dates";
import styled from "styled-components";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import Switch from "react-switch";

import calendarStyles from "../../components/calendar.css.js";

const DateRangePickerWrapper = styled(DateRangePicker)`
  ${calendarStyles}
`;

import Input from "SharedComponents/mwamba-input";
import CountryPicker from "SharedComponents/mwamba-country-picker";
import ActionButton from "SharedComponents/action-button";
import DropDownSelect from "SharedComponents/mwamba-dropdown-select";

export default class GeneralConfiguration extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    adminAuthentication: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    accountDetails: PropTypes.object.isRequired,
    industries: PropTypes.array
  };

  constructor(props) {
    super(props);

    let { accountDetails } = props;
    if (!accountDetails) {
      accountDetails = {};
    }
    
    this.state = {
      isFetchingConfiguration: false,
      isUpdatingConfiguration: false,
      form: {
        profilename: accountDetails.profilename,
        startDate: moment(accountDetails.startDate),
        endDate: moment(accountDetails.endDate),
        country: accountDetails.country,
        messageCredits: accountDetails.messageCredits,
        incentivesBalance: accountDetails.incentivesBalance,
        quota: accountDetails.quota,
        active: accountDetails.active,
        industryId: accountDetails.industryId
      }
    };

    this.onCountryChange = this.onCountryChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onUpdateAccount = this.onUpdateAccount.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onActiveChanged = this.onActiveChanged.bind(this);
    this.onLNMChanged = this.onLNMChanged.bind(this);
    this.onIndustryChanged = this.onIndustryChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountDetails !== this.props.accountDetails) {
      const { accountDetails } = nextProps;
      this.setState({
        form: {
          profilename: accountDetails.profilename,
          startDate: moment(accountDetails.startDate),
          endDate: moment(accountDetails.endDate),
          country: accountDetails.country,
          messageCredits: accountDetails.messageCredits,
          incentivesBalance: accountDetails.incentivesBalance,
          quota: accountDetails.quota,
          active: accountDetails.active,
          industryId: accountDetails.industryId
        }
      });
    }
  }

  onUpdateSettings() {}

  onActiveChanged(active) {
    this.setState({ form: { ...this.state.form, active } });
  }

  onLNMChanged(lnm) {
    this.setState({ form: { ...this.state.form, lnm } });
  }

  onCountryChange(change) {
    this.setState({ form: { ...this.state.form, country: change.code } });
  }

  onIndustryChanged(change) {
    this.setState({ form: { ...this.state.form, industryId: change.value } });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ form: { ...this.state.form, startDate, endDate } });
  }

  onFormValid() {
    this.setState({ formValid: true });
  }

  onFormInvalid() {
    this.setState({ formValid: false });
  }

  async onUpdateAccount() {
    const { id } = this.context.router.route.match.params;
    this.setState({ isUpdatingConfiguration: true });

    try {
      const accountDetails = {
        ...this.state.form,
        startDate: this.state.form.startDate.format("YYYY-MM-DD"),
        endDate: this.state.form.endDate.format("YYYY-MM-DD"),
        incentivesBalance: parseInt(this.state.form.incentivesBalance),
        messageCredits: parseInt(this.state.form.messageCredits)
      };
      await this.props.accountsActions.updateGeneralAccountDetails(
        id,
        accountDetails
      );
      this.props.alertActions.addAlert({
        type: "success",
        message: "The account was updated successfully"
      });
      this.props.onfetchAccountDetails(id);

      // TODO: update account details
    } catch (exception) {
      this.props.EventHandler.handleException(exception);
      this.props.alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });
    } finally {
      this.setState({ isUpdatingConfiguration: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  handleChange(event) {
    this.setState({
      form: { ...this.state.form, [event.target.name]: event.target.value }
    });
  }

  render() {
    const industryOptions = !this.props.industries
      ? []
      : this.props.industries.map(industry => ({
          ...industry,
          label: industry.name,
          value: industry.id
        }));
    const { countries } = this.props.adminAuthentication.admin.data;

    return (
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Formsy
          ref={form => (this.form = form)}
          action="#"
          onValid={this.onFormValid}
          onInvalid={this.onFormInvalid}
          onValidSubmit={this.onUpdateAccount}
          onInvalidSubmit={this.onInvalidSubmit}
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
            <small>Profile Name</small>
            <Input
              name="profilename"
              value={this.state.form.profilename}
              onChange={this.handleChange}
              placeholder="Profile Name"
              required
              validations={{ isExisty: true }}
              validationErrors={{ isExisty: "This field is required" }}
              style={{
                width: "100%",
                padding: "10px 5px",
                margin: "10px 0 0",
                position: "relative"
              }}
              className="input"
              errorLabel={
                <Label
                  color="red"
                  style={{
                    position: "absolute",
                    bottom: -16,
                    left: 3,
                    borderRadius: 0
                  }}
                />
              }
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              margin: "10px 3px"
            }}
          >
            <small>Subscription Duration</small>
            <DateRangePickerWrapper
              startDate={this.state.form.startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={this.state.form.endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={this.onDatesChange}
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              numberOfMonths={1}
              hideKeyboardShortcutsPanel
              noBorder
            />
          </div>
          <div>
            <small>Country</small>
            <CountryPicker
              options={countries}
              value={this.state.form.country}
              onChange={this.onCountryChange}
            />
          </div>
          <div
            style={{
              width: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              margin: "20px 3px"
            }}
          >
            <small>Industry</small>
            <DropDownSelect
              placeholder="Select an industry"
              options={industryOptions}
              value={this.state.form.industryId}
              onChange={this.onIndustryChanged}
              style={{ width: "100%" }}
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
            <small>Message Credits</small>
            <Input
              name="messageCredits"
              type="number"
              value={this.state.form.messageCredits}
              onChange={this.handleChange}
              placeholder="Message Credits"
              required
              validations={{ isExisty: true, isNumeric: true }}
              validationErrors={{
                isNumeric: "only numeric characters are allowed",
                isExisty: "This field is required"
              }}
              style={{
                width: "100%",
                padding: "10px 5px",
                margin: "10px 0 0",
                position: "relative"
              }}
              className="input"
              errorLabel={
                <Label
                  color="red"
                  style={{
                    position: "absolute",
                    bottom: -16,
                    left: 3,
                    borderRadius: 0
                  }}
                />
              }
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
            <small>Quota</small>
            <Input
              name="quota"
              type="number"
              value={this.state.form.quota}
              onChange={this.handleChange}
              placeholder="Quota"
              required
              validations={{ isExisty: true, isNumeric: true }}
              validationErrors={{
                isNumeric: "only numeric characters are allowed",
                isExisty: "This field is required"
              }}
              style={{
                width: "100%",
                padding: "10px 5px",
                margin: "10px 0 0",
                position: "relative"
              }}
              className="input"
              errorLabel={
                <Label
                  color="red"
                  style={{
                    position: "absolute",
                    bottom: -16,
                    left: 3,
                    borderRadius: 0
                  }}
                />
              }
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
            <small>Incentives Balance</small>
            <Input
              name="incentivesBalance"
              type="number"
              value={this.state.form.incentivesBalance}
              onChange={this.handleChange}
              placeholder="Incentives Balance"
              required
              validations={{ isExisty: true, isNumeric: true }}
              validationErrors={{
                isNumeric: "only numeric characters are allowed",
                isExisty: "This field is required"
              }}
              style={{
                width: "100%",
                padding: "10px 5px",
                margin: "10px 0 0",
                position: "relative"
              }}
              className="input"
              errorLabel={
                <Label
                  color="red"
                  style={{
                    position: "absolute",
                    bottom: -16,
                    left: 3,
                    borderRadius: 0
                  }}
                />
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              margin: "20px 0"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
                flexGrow: 1
              }}
            >
              <Switch
                checked={this.state.form.active}
                onChange={this.onActiveChanged}
                onColor="#ebf2ff"
                onHandleColor="#002366"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span style={{ margin: "0 10px" }}>
                {this.state.form.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div></div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActionButton
              icon="update"
              type="Update"
              className="primary"
              text="Update"
              disabled={
                !this.state.formValid || this.state.isUpdatingConfiguration
              }
              loading={this.state.isUpdatingConfiguration}
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
      </div>
    );
  }
}
