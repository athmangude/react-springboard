/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from "react";
import "react-input-range/lib/css/index.css";
import PropTypes from "prop-types";
import Spinner from "react-spinner-material";
import { connect } from "react-redux";

import IconButton from "SharedComponents/icon-button";
import ActionButton from "SharedComponents/action-button-styled";
import Accordion from "SharedComponents/mwamba-accordion/Accordion";

@connect(
  state => ({
    filters: state.customerAnalytics.filters
  }),
  () => ({})
)
export default class CreateSegment extends Component {
  static propTypes = {
    onCloseSidePanel: PropTypes.func,
    customerAnalyticsActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isSavingSegment: false,
      segmentName: ""
    };

    this.saveSegment = this.saveSegment.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  handleChange(event) {
    this.setState({ segmentName: event.target.value });
  }

  async saveSegment() {
    const {
      customerAnalyticsActions,
      EventHandler,
      alertActions,
      onCloseSidePanel
    } = this.props;
    this.setState({ isSavingSegment: true });
    const { appliedFilters, segmentName } = this.state;
    const filters = {
      analyticsMetadataView: appliedFilters,
      segmentName
    };

    try {
      await customerAnalyticsActions.createSegment(filters);
      onCloseSidePanel();
      alertActions.addAlert({ type: "success", message: "Segment created!" });
    } catch (exception) {
      let errorMessage =
        "Oops! Something went wrong and we could not send out the survey. Please try again later.";

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
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isSavingSegment: false });
    }
  }

  async updateSegment() {
    const {
      customerAnalyticsActions,
      EventHandler,
      segment,
      alertActions,
      onCloseSidePanel
    } = this.props;

    this.setState({ isSavingSegment: true });
    const { appliedFilters, segmentName } = this.state;
    const filters = {
      analyticsMetadataView: appliedFilters,
      segmentName
    };

    try {
      await customerAnalyticsActions.updateSegment(segment.id, filters);
      onCloseSidePanel();
      alertActions.addAlert({ type: "success", message: "Segment updated!" });
    } catch (exception) {
      let errorMessage =
        "Oops! Something went wrong and we could not send out the survey. Please try again later.";

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
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isSavingSegment: false });
    }
  }

  render() {
    const { onCloseSidePanel } = this.props;
    const { segmentName, isSavingSegment } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%"
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            position: "relative"
          }}
        >
          <div
            style={{
              width: "100%",
              height: 63,
              backgroundColor: "#d9d9d9",
              position: "sticky",
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "30px 10px 30px 20px",
              boxShadow: "0 0 7px rgba(0, 0, 0, 0.6)",
              zIndex: 100
            }}
          >
            <h2 style={{ fontWeight: "normal", fontSize: 20, margin: 0 }}>
              Create Segment
            </h2>
            <IconButton icon="close" onClick={onCloseSidePanel} />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            position: "relative"
          }}
        >
          <div style={{ padding: "0 10px 0 10px" }}>
            <div style={{ padding: "20px 0 20px 0" }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  position: "relative"
                }}
              >
                <input
                  type="text"
                  name="segmentName"
                  placeholder="Name of segment..."
                  value={segmentName}
                  onChange={this.handleChange}
                  className="hide-active-border"
                  autoComplete="off"
                  style={{
                    borderRadius: 0,
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",
                    borderBottom: "1px solid #808285",
                    padding: "10px 5px",
                    width: "100%"
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#ffffff",
              position: "sticky",
              bottom: 0,
              paddingBottom: 10,
              zIndex: 2
            }}
          >
            <ActionButton
              onClick={this.saveSegment}
              icon="save"
              text="Save&nbsp;Segment"
              loading={isSavingSegment}
              style={{
                backgroundColor: "#002366",
                color: "#fff",
                width: 200,
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                borderRadius: 5
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
