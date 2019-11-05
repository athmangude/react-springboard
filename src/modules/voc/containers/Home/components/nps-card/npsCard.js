/* eslint-disable react/jsx-filename-extension, max-len, react/no-array-index-key, no-mixed-operators */

import React, { Component } from "react";
import { Divider } from "semantic-ui-react";
import PropTypes from "prop-types";
import ReactPlaceholder from "react-placeholder";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import numeral from "numeral";
import "react-placeholder/lib/reactPlaceholder.css";
import Spinner from "react-spinner-material";
import NPSChart from "./nps-chart";
import ActionButton from "SharedComponents/action-button-styled";

import ContactedRespondedChart from "../contacted-responded-chart";

import themes from "SharedComponents/themes";

const { primaryColor } = themes.light;

import NPSSelect from "./nps-select";

class NPSCard extends Component {
  static propTypes = {
    nps: PropTypes.object,
    isFetchingHomeFeed: PropTypes.bool.isRequired,
    fetchNPS: PropTypes.func.isRequired,
    isFetchingNPS: PropTypes.bool.isRequired,
    setNPSFilters: PropTypes.func,
    contactedLast30Days: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    const npsFilters = {};
    if (this.props.nps) {
      Object.keys(this.props.nps.npsMetadataFilters).forEach(key => {
        npsFilters[key] = null;
      });
    }

    this.state = {
      npsFilters
    };

    this.onNPSFIltersChanged = this.onNPSFIltersChanged.bind(this);
  }

  componentWillReceiveProps(nextState) {
    if (this.props.nps !== nextState.nps && !this.props.nps) {
      const npsFilters = {};
      if (this.props.nps) {
        Object.keys(this.props.nps.npsMetadataFilters).forEach(key => {
          npsFilters[key] = null;
        });
      }

      this.setState({ npsFilters });
    }
  }

  onNPSFIltersChanged(filter, value) {
    this.setState(
      { npsFilters: { ...this.state.npsFilters, [filter]: value } },
      () => {
        this.props.setNPSFilters(this.state.npsFilters);
      }
    );
  }

  onToggleContactedRespondedChart = () => {
    const { showContactedRespondedChart } = this.state;
    this.setState({
      showContactedRespondedChart: !showContactedRespondedChart
    });
  };

  render() {
    const { nps, isFetchingHomeFeed } = this.props;
    const { showContactedRespondedChart } = this.state;
    let total = 0;

    if (nps) {
      total = nps.promoters + nps.passives + nps.detractors;
    }

    const contactedCount = this.props.contactedLast30Days.reduce(
      (currentValue, nextValue) => currentValue + nextValue.contacted,
      0
    );
    const completedCount = this.props.contactedLast30Days.reduce(
      (currentValue, nextValue) => currentValue + nextValue.finished,
      0
    );

    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <b style={{ fontSize: 14, color: "#6d6e71" }}>
            Net Promoter Score&nbsp;
            {/* <small>(Last 30 days)</small> */}
          </b>
          &nbsp;&nbsp;
          {this.props.isFetchingNPS ? (
            <div style={{ position: "relative", top: 0 }}>
              <Spinner spinnerColor={primaryColor} size={15} spinnerWidth={2} />
            </div>
          ) : null}
        </div>
        {nps ? (
          <div
            style={{
              margin: 0,
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 10
            }}
          >
            {Object.keys(this.props.nps.npsMetadataFilters).map((filter, i) => (
              <NPSSelect
                filter={filter}
                menu={filter}
                options={this.props.nps.npsMetadataFilters[filter]}
                onChange={this.onNPSFIltersChanged}
                key={i}
                fetchNPS={this.props.fetchNPS}
              />
            ))}
            &nbsp;&nbsp;
          </div>
        ) : null}
        {nps ? (
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
            <NPSChart
              promoters={nps.promoters}
              passives={nps.passives}
              detractors={nps.detractors}
              total={total}
              onFeedFiltersChanged={this.props.onFeedFiltersChanged}
            />
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
                    height: 50,
                    width: 50,
                    border: "solid 1px #d9d9d9",
                    borderRadius: 25,
                    backgroundColor: "#e8eaed"
                  }}
                >
                  <span
                    style={{ fontSize: 20, color: "#6d6e71", marginTop: 10 }}
                  >
                    {nps.score}
                  </span>
                  <small style={{ fontSize: 9 }}>NPS</small>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "calc(100% - 60px)"
                  }}
                >
                  {[
                    {
                      label: "Detractors",
                      value: nps.detractors,
                      color: "#fd9681"
                    },
                    { label: "Passive", value: nps.passives, color: "#fcda6e" },
                    {
                      label: "Promoters",
                      value: nps.promoters,
                      color: "#80c582"
                    }
                  ].map((item, i) => (
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
                            backgroundColor: item.color,
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            margin: "0 3px"
                          }}
                        ></div>
                        <span style={{ color: "#808285", margin: "0 3px" }}>
                          {item.value === 0
                            ? "0%"
                            : `${((item.value / total) * 100).toFixed(1)}%`}
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
                        {item.label}
                      </span>
                    </div>
                  ))}
                  {/*
                    <Button style={{ backgroundColor: '#fff', height: 20, borderRadius: 10, color: '#487db3', border: 'solid 1px #487db3', padding: '0 20px', fontSize: 10, margin: 10 }}>View All +</Button>
                    */}
                </div>
              </div>
              <Divider style={{ width: "100%" }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    flexDirection: "column"
                  }}
                >
                  <span style={{ color: "#808285", fontSize: 18 }}>
                    {contactedCount > 999
                      ? numeral(contactedCount).format("0.0 a")
                      : numeral(contactedCount).format("0 a")}
                  </span>
                  <small style={{ color: "#808285", fontSize: 11 }}>
                    Contacted
                  </small>
                </div>
                <div
                  style={{
                    height: 32,
                    border: "solid 0.5px #d9d9d9",
                    margin: "0 10px"
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "column"
                  }}
                >
                  <span style={{ color: "#808285", fontSize: 18 }}>
                    {completedCount > 999
                      ? numeral(completedCount).format("0.0 a")
                      : numeral(completedCount).format("0 a")}
                  </span>
                  <small style={{ color: "#808285", fontSize: 11 }}>
                    Completed
                  </small>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActionButton
                text={
                  !showContactedRespondedChart
                    ? "Show Contacted Chart"
                    : "Hide Contacted Chart"
                }
                onClick={this.onToggleContactedRespondedChart}
                icon={
                  showContactedRespondedChart
                    ? "keyboard_arrow_up"
                    : "keyboard_arrow_down"
                }
                style={{ border: "solid 1px #d9d9d9", marginTop: 10 }}
                small
              />
              {showContactedRespondedChart ? (
                <ContactedRespondedChart
                  contacted={this.props.contacted}
                  totalContacted={this.props.totalContacted}
                  date={this.props.date}
                  isFetchingContacted={this.props.isFetchingContacted}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
              position: "relative"
            }}
          >
            <div style={{ width: "100%" }}>
              <ReactPlaceholder
                showLoadingAnimation={isFetchingHomeFeed}
                customPlaceholder={
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        alignSelf: "flex-start",
                        flexDirection: "column"
                      }}
                    >
                      <RectShape
                        color="#d9d9d9"
                        style={{
                          height: 22,
                          width: 120,
                          borderRadius: 11,
                          margin: "4px 10px 0"
                        }}
                      />
                      <RectShape
                        color="#d9d9d9"
                        style={{
                          height: 22,
                          width: 120,
                          borderRadius: 11,
                          margin: "4px 10px 0"
                        }}
                      />
                      <RectShape
                        color="#d9d9d9"
                        style={{
                          height: 22,
                          width: 120,
                          borderRadius: 11,
                          margin: "4px 10px 0"
                        }}
                      />
                    </div>
                    <RectShape
                      color="#d9d9d9"
                      style={{
                        height: 10,
                        width: "100%",
                        borderRadius: 0,
                        margin: "10px 0px 20px"
                      }}
                    />
                  </div>
                }
              />
            </div>
          </div>
        )}
        <Divider />
      </div>
    );
  }
}

export default NPSCard;
