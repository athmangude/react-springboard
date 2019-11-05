/* eslint-disable object-curly-newline */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Spinner from "react-spinner-material";
import moment from "moment";
import styled from "styled-components";

// import SpendOverTime from '../../../Segments/components/SpendOverTime';
import SpendOverTime from "../../../Graph/SpendOverTime";
import ChartTypes from "Modules/analytics/containers/components/ChartTypes";
import Intervals from "Modules/analytics/containers/components/Intervals";

import { createFakeCustomerSpendData } from "../../../../components/DummyData";
import Title from "Modules/analytics/containers/components/Title";
import styles from "./index.css";
const SpendOverTimeWrapper = styled.div`
  ${styles}
`;

export default class CustomerSpendOverTime extends Component {
  static propTypes = {
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    participantId: PropTypes.number,
    selectedDateRange: PropTypes.object,
    currency: PropTypes.string,
    width: PropTypes.number
  };

  constructor(props) {
    super(props);

    const { chartType } = props;

    this.state = {
      chartType: chartType || "line",
      isLoadingCustomerSpend: false,
      customerSpendData: [],
      interval: "daily"
    };

    this.fetchCustomerSpend = this.fetchCustomerSpend.bind(this);
    this.createFakeCustomerSpendData = this.createFakeCustomerSpendData.bind(
      this
    );
    this.onChangeInterval = this.onChangeInterval.bind(this);
    this.onChangeChartType = this.onChangeChartType.bind(this);
  }

  componentDidMount() {
    const { demoMode } = this.props;

    if (!demoMode) {
      this.fetchCustomerSpend();
    } else {
      this.createFakeCustomerSpendData(true);
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.selectedDateRange.from !== this.props.selectedDateRange.from ||
      newProps.selectedDateRange.to !== this.props.selectedDateRange.to
    ) {
      if (!newProps.demoMode) {
        this.fetchCustomerSpend();
      } else {
        this.createFakeCustomerSpendData(false);
      }
    }
  }

  onChangeInterval(interval) {
    const { demoMode } = this.props;

    this.setState({ interval }, () => {
      if (!demoMode) {
        this.fetchCustomerSpend();
      } else {
        this.createFakeCustomerSpendData(false);
      }
    });
  }

  onChangeChartType(chartType) {
    this.setState({ chartType });
  }

  createFakeCustomerSpendData(initialLoad = false) {
    const { selectedDateRange } = this.props;
    const { interval } = this.state;

    this.setState({ isLoadingCustomerSpend: initialLoad });

    setTimeout(() => {
      const data = createFakeCustomerSpendData(selectedDateRange);

      const customerSpendData = [];

      Object.keys(data).forEach(element => {
        let period = "";

        if (interval === "daily" || interval === "weekly") {
          period = moment(element).format("D MMM YYYY");
        } else if (interval === "monthly") {
          period = moment(element).format("MMM YYYY");
        } else {
          period = moment(element).format("YYYY");
        }

        customerSpendData.push({
          period,
          amount: data[element]
        });
      });

      this.setState({ customerSpendData, isLoadingCustomerSpend: false });
    }, 1000);
  }

  async fetchCustomerSpend(initialLoad = false) {
    const {
      customerAnalyticsActions,
      EventHandler,
      selectedDateRange,
      participantId
    } = this.props;
    const { interval } = this.state;

    let startTime = "";
    let endTime = "";

    if (selectedDateRange.value !== undefined) {
      startTime = moment(selectedDateRange.value.from)
        .startOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
      endTime = moment(selectedDateRange.value.to)
        .endOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
    } else {
      startTime = moment(selectedDateRange.from)
        .startOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
      endTime = moment(selectedDateRange.to)
        .endOf("day")
        .format("YYYY-MM-DD HH:MM:SS");
    }

    this.setState({ isLoadingCustomerSpend: initialLoad });

    try {
      const fetchCustomerSpendResult = await customerAnalyticsActions.fetchCustomerSpend(
        participantId,
        { startTime, endTime, interval }
      );

      const customerSpendData = [];

      Object.keys(fetchCustomerSpendResult.data.Data).forEach(element => {
        let period = "";

        if (interval === "daily" || interval === "weekly") {
          period = moment(element).format("D MMM YYYY");
        } else if (interval === "monthly") {
          period = moment(element).format("MMM YYYY");
        } else {
          period = moment(element).format("YYYY");
        }

        customerSpendData.push({
          period,
          amount: fetchCustomerSpendResult.data.Data[element]
        });
      });

      this.setState({ customerSpendData });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingCustomerSpend: false });
    }
  }

  render() {
    const { currency, width } = this.props;
    const { isLoadingCustomerSpend, customerSpendData, chartType } = this.state;

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: 10,
            backgroundColor: "rgb(236, 236, 236)",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Title
            title="Spend Over Time"
            subtitle="How much is my customer spending over time?"
            loading={isLoadingCustomerSpend}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: 5 }}>
          <SpendOverTimeWrapper>
            <div className="grid-item" style={{ width: "100%", padding: 0 }}>
              <div
                className="container"
                style={{ boxShadow: "none", padding: 0 }}
              >
                <div className="button-container">
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    <ChartTypes
                      defaultChartType={chartType}
                      chartOptions={["line", "bar"]}
                      onChange={this.onChangeChartType}
                      width={300}
                    />
                    <Intervals
                      onIntervalChange={this.onChangeInterval}
                      defaultInterval="daily"
                      width={300}
                    />
                  </div>
                  <div className="content-container" style={{ padding: 0 }}>
                    <div className="graph-container">
                      {isLoadingCustomerSpend ? (
                        <div className="spinner-area">
                          <Spinner
                            spinnerColor="#bf2a2c"
                            size={40}
                            spinnerWidth={4}
                          />
                        </div>
                      ) : !customerSpendData.length ? (
                        <div className="no-data-text">No data to display</div>
                      ) : (
                        <SpendOverTime
                          data={customerSpendData}
                          chartType={chartType}
                          currency={currency}
                          style={{ boxShadow: 0, padding: 0 }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SpendOverTimeWrapper>
        </div>
      </div>
    );
  }
}
