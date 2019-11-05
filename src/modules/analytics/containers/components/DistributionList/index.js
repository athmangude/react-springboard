/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from "react";
import PropTypes from "prop-types";

import MwambaBar from "SharedComponents/mwamba-bar";
import ActionButton from "SharedComponents/action-button-styled";

const colors = ["#487db3"];

export default class DistributionList extends Component {
  static propTypes = {
    list: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.string
  };

  constructor(props) {
    super(props);

    const { list } = this.props;
    const sortedList = list
      .map(record => {
        const count = record.promoters + record.passives + record.detractors;
        const nps = ((record.promoters - record.detractors) / count) * 100;
        return { ...record, count, nps };
      })
      .sort((a, b) => b.count - a.count);

    this.state = {
      defaultDisplay: 10,
      display: 10,
      increment: 10,
      sortedList
    };

    this.onShowMore = this.onShowMore.bind(this);
    this.onShowLess = this.onShowLess.bind(this);
  }

  onShowMore() {
    const { sortedList, display, increment } = this.state;
    if (display < sortedList.length) {
      this.setState({
        display: display + increment
      });
    }
  }

  onShowLess() {
    const { defaultDisplay } = this.state;
    this.setState({ display: defaultDisplay });
  }

  render() {
    const { name, type } = this.props;
    const { sortedList, display, defaultDisplay } = this.state;
    const total = sortedList.reduce(
      (accumulator, currentValue) => accumulator + currentValue.count,
      0
    );
    return (
      <div style={{ width: "100%", marginTop: 20, padding: "0 20px" }}>
        <span
          style={{
            color: "#3d4553",
            fontSize: 13,
            fontWeight: "bold",
            textTransform: "capitalize"
          }}
        >
          {name}
        </span>
        {sortedList.length
          ? sortedList.slice(0, display).map((bar, index) => (
              <div style={{ width: "100%", minHeight: 30 }}>
                <MwambaBar
                  key={bar.name}
                  bar={bar}
                  total={total}
                  nps={type === "Performance"}
                  barColor={colors[index % colors.length]}
                />
              </div>
            ))
          : null}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10
          }}
        >
          {display < sortedList.length ? (
            <ActionButton
              icon="expand_more"
              text="Show More"
              disabled={display >= sortedList.length}
              onClick={this.onShowMore}
            />
          ) : null}
          {display > defaultDisplay ? (
            <ActionButton
              icon="expand_less"
              text="Show Less"
              onClick={this.onShowLess}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
