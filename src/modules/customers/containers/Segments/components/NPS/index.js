/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Spinner from "react-spinner-material";

import { createFakeNPSData } from "../../../components/DummyData";
import NPSChart from "Modules/voc/containers/Home/components/nps-card/nps-chart";
// import MwambaRequestDemo from 'SharedComponents/mwamba-request-demo';
import themes from "SharedComponents/themes";
import ErrorState from "SharedComponents/mwamba-error-state";
const { primaryColor } = themes.light;
const noData = require("Images/no_data.png");

export default class NpsRating extends Component {
  static propTypes = {
    width: PropTypes.string,
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      npsAggregation: {
        summary: {
          total: 0
        },
        stats: {
          detractors: {
            value: 0,
            color: "#80c582"
          },
          passives: {
            value: 0,
            color: "#fcda6e"
          },
          promoters: {
            value: 0,
            color: "#fd9681"
          }
        }
      },
      isLoading: false,
      selectedDateRange: {}
    };

    this.createFakeNPSData = this.createFakeNPSData.bind(this);
    this.fetchNPSSummary = this.fetchNPSSummary.bind(this);
  }

  componentDidMount() {
    const { demoMode, selectedDateRange } = this.props;

    this.setState({ selectedDateRange }, () => {
      if (!demoMode) {
        this.fetchNPSSummary();
      } else {
        this.createFakeNPSData();
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
          this.fetchNPSSummary();
        } else {
          this.createFakeNPSData();
        }
      });
    }
  }

  createFakeNPSData() {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ npsAggregation: createFakeNPSData(), isLoading: false });
    }, 500);
  }

  async fetchNPSSummary() {
    const {
      customerAnalyticsActions,
      EventHandler,
      segmentId,
      appliedFilters
    } = this.props;
    const { selectedDateRange } = this.state;

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

    this.setState({ isLoading: true });

    try {
      const fetchNPSSummaryResult = await customerAnalyticsActions.fetchNPSSummary(
        { startTime, endTime },
        !appliedFilters.length ? segmentId : null,
        appliedFilters.length ? JSON.parse(appliedFilters) : []
      );
      const detractors =
        fetchNPSSummaryResult.data.Data.detractors !== null
          ? fetchNPSSummaryResult.data.Data.detractors
          : 0;
      const passives =
        fetchNPSSummaryResult.data.Data.passives !== null
          ? fetchNPSSummaryResult.data.Data.passives
          : 0;
      const promoters =
        fetchNPSSummaryResult.data.Data.promoters !== null
          ? fetchNPSSummaryResult.data.Data.promoters
          : 0;

      const npsAggregation = {
        summary: {
          total:
            parseInt(detractors, 10) +
            parseInt(passives, 10) +
            parseInt(promoters, 10),
          nps: fetchNPSSummaryResult.data.Data.nps
        },
        stats: {
          detractors: {
            value: detractors,
            color: "#f39681"
          },
          passives: {
            value: passives,
            color: "#f7d96e"
          },
          promoters: {
            value: promoters,
            color: "#80c582"
          }
        }
      };
      this.setState({ npsAggregation });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { npsAggregation, isLoading } = this.state;

    return (
      <div
        className="grid-item"
        style={{ width: "100%", padding: "0px 10px 10px" }}
      >
        <div
          style={{
            height: 18,
            margin: "16px 0 8px 0",
            color: "#4a4a4a",
            font: "300 18px/14px Roboto,sans-serif",
            letterSpacing: 0
          }}
        >
          What do they think about your business?
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            padding: 10,
            borderRadius: 2,
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)",
            marginBottom: 20,
            marginTop: 10
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: 10,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: "100%",
                  height: 100,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Spinner
                  spinnerColor={primaryColor}
                  size={40}
                  spinnerWidth={4}
                />
              </div>
            ) : npsAggregation.summary.total === 0 &&
              npsAggregation.stats.detractors.value === 0 &&
              npsAggregation.stats.promoters.value === 0 &&
              npsAggregation.stats.passives.value === 0 ? (
              <ErrorState />
            ) : (
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
                {Object.keys(npsAggregation.stats).length ? (
                  <NPSChart
                    promoters={npsAggregation.stats.promoters.value}
                    passives={npsAggregation.stats.passives.value}
                    detractors={npsAggregation.stats.detractors.value}
                    total={npsAggregation.summary.total}
                  />
                ) : null}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: 200
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        backgroundColor: "#E8EAED",
                        paddingTop: 10
                      }}
                    >
                      <span style={{ fontSize: 25, color: "#6d6e71" }}>
                        {npsAggregation.summary.nps}
                      </span>
                      <small style={{ fontSize: 9 }}>NPS</small>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      {Object.keys(npsAggregation.stats).map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            width: "100%"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <div
                              style={{
                                backgroundColor:
                                  npsAggregation.stats[item].color,
                                height: 10,
                                width: 10,
                                borderRadius: 5,
                                margin: "0 3px"
                              }}
                            ></div>
                            <span style={{ color: "#808285", margin: "0 3px" }}>
                              {npsAggregation.stats[item].value === 0
                                ? "0%"
                                : `${(
                                    (npsAggregation.stats[item].value /
                                      npsAggregation.summary.total) *
                                    100
                                  ).toFixed(1)}%`}
                            </span>
                          </div>
                          <span
                            style={{
                              color: "#808285",
                              margin: "0 3px",
                              fontSize: 10,
                              marginLeft: 20
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
