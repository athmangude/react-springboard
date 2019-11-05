/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "react-spinner-material";
import moment from "moment";

import { createFakeSegmentSpendData } from "../../../components/DummyData";
import SpendOverTime from "../../../Customers/Graph/SpendOverTime";
import ChartTypes from "Modules/analytics/containers/components/ChartTypes";
import Intervals from "Modules/analytics/containers/components/Intervals";
import ActionButton from "SharedComponents/action-button-styled";
import MwambaRequestDemo from "SharedComponents/mwamba-request-demo";
import ErrorState from "SharedComponents/mwamba-error-state";
import themes from "SharedComponents/themes";
const { primaryColor } = themes.light;
import styled from "styled-components";
import styles from "./index.css";
const SpendOverTimeWrapper = styled.button`
  ${styles}
`;
const noData = require("Images/no_data.png");

export default class Spend extends Component {
  static propTypes = {
    width: PropTypes.string,
    onChangeInterval: PropTypes.func,
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    style: PropTypes.object,
    chartType: PropTypes.string,
    currency: PropTypes.string
  };

  constructor(props) {
    super(props);

    const { chartType } = props;

    this.state = {
      chartType: chartType || "line",
      blur: true,
      segmentSpendData: [],
      segmentSpendInterval: "daily",
      isLoading: false,
      selectedDateRange: {}
    };

    this.onChangeChartType = this.onChangeChartType.bind(this);
    this.onChangeInterval = this.onChangeInterval.bind(this);
    this.createFakeSegmentSpendData = this.createFakeSegmentSpendData.bind(
      this
    );
    this.fetchSpendOverview = this.fetchSpendOverview.bind(this);
  }

  componentDidMount() {
    const { demoMode, selectedDateRange } = this.props;

    this.setState({ selectedDateRange }, () => {
      if (!demoMode) {
        this.fetchSpendOverview();
      } else {
        this.createFakeSegmentSpendData();
      }
    });
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.selectedDateRange.from !== this.props.selectedDateRange.from ||
      newProps.selectedDateRange.to !== this.props.selectedDateRange.to
    ) {
      this.setState({ selectedDateRange: newProps.selectedDateRange }, () => {
        if (!newProps.demoMode) {
          this.fetchSpendOverview();
        } else {
          this.createFakeSegmentSpendData();
        }
      });
    }
  }

  createFakeSegmentSpendData() {
    const { selectedDateRange } = this.props;

    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({
        segmentSpendData: createFakeSegmentSpendData(selectedDateRange),
        isLoading: false
      });
    }, 500);
  }

  onChangeChartType(chartType) {
    this.setState({ chartType });
  }

  onChangeInterval(interval) {
    const { demoMode } = this.props;

    this.setState({ segmentSpendInterval: interval }, () => {
      if (!demoMode) {
        this.fetchSpendOverview();
      } else {
        this.createFakeSegmentSpendData();
      }
    });
  }

  async fetchSpendOverview() {
    const {
      customerAnalyticsActions,
      EventHandler,
      segmentId,
      appliedFilters
    } = this.props;
    const { segmentSpendInterval, selectedDateRange } = this.state;

    let startDate = "";
    let endDate = "";

    if (selectedDateRange.value !== undefined) {
      startDate = moment(selectedDateRange.value.from)
        .startOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
      endDate = moment(selectedDateRange.value.to)
        .endOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
    } else {
      startDate = moment(selectedDateRange.from)
        .startOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
      endDate = moment(selectedDateRange.to)
        .endOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
    }

    this.setState({ isLoading: true });

    try {
      const fetchSpendResult = await customerAnalyticsActions.fetchSpendOverview(
        { startDate, endDate },
        segmentSpendInterval,
        !appliedFilters.length ? segmentId : null,
        appliedFilters.length ? JSON.parse(appliedFilters) : []
      );
      const segmentSpendData = [];

      Object.keys(fetchSpendResult.data.Data)
        .sort((a, b) => moment(a) - moment(b))
        .forEach(element => {
          let period = "";

          if (
            segmentSpendInterval === "daily" ||
            segmentSpendInterval === "weekly"
          ) {
            period = moment(element).format("D MMM YYYY");
          } else if (segmentSpendInterval === "monthly") {
            period = moment(element).format("MMM YYYY");
          } else {
            period = moment(element).format("YYYY");
          }

          segmentSpendData.push({
            period,
            amount: fetchSpendResult.data.Data[element]
          });
        });
      this.setState({ segmentSpendData });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { chartType, isLoading, segmentSpendData } = this.state;
    const { width, title, style, currency } = this.props;

    return (
      <SpendOverTimeWrapper style={{ style }} blur={false}>
        <div
          className="grid-item"
          style={{ width: "100%", padding: "0px 10px 10px" }}
        >
          {title ? <div className="title">{title}</div> : null}
          <div className="container">
            <div className="button-container">
              <div
                style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <ChartTypes
                  defaultChartType={chartType}
                  chartOptions={["line", "bar"]}
                  onChange={this.onChangeChartType}
                  width={width}
                />
                <Intervals
                  onIntervalChange={this.onChangeInterval}
                  defaultInterval="daily"
                  width={width}
                />
              </div>
              <div className="content-container">
                <div className="graph-container">
                  {isLoading ? (
                    <div className="spinner-area">
                      <Spinner
                        spinnerColor={primaryColor}
                        size={40}
                        spinnerWidth={4}
                      />
                    </div>
                  ) : !segmentSpendData.length ? (
                    <ErrorState />
                  ) : (
                    <SpendOverTime
                      data={segmentSpendData}
                      chartType={chartType}
                      currency={currency}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SpendOverTimeWrapper>
    );
  }
}
