/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from "react";
import PropTypes from "prop-types";

import MwambaCheckedMultiSelect from "SharedComponents/mwamba-checked-multi-select";

export default class CES extends Component {
  static propTypes = {
    question: PropTypes.object
  };

  constructor(props) {
    super(props);
    const { question } = props;
    const { score, analysis } = question;

    this.state = {
      options: analysis.map(option => option.text).sort(),
      selectedOptions: [],
      score
    };

    this.onChange = this.onChange.bind(this);
    this.calculateScore = this.calculateScore.bind(this);
  }

  onChange(selectedOptions) {
    this.setState({ selectedOptions }, () => this.calculateScore());
  }

  calculateScore() {
    const { question } = this.props;
    const { analysis } = question;
    const { selectedOptions } = this.state;
    let { score } = question;
    if (selectedOptions.length) {
      const total = analysis.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.count, 10),
        0
      );
      const cumulativeSelected = analysis
        .filter(option => selectedOptions.includes(option.text))
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.count, 10),
          0
        );

      score = (cumulativeSelected / total) * 100;
    }
    this.setState({ score });
  }

  render() {
    const { options, score } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#b31e20",
            color: "#FFF",
            position: "relative"
          }}
        >
          <span>{parseFloat(score).toFixed(1)}</span>
          <small
            style={{
              fontSize: 8,
              color: "#fff",
              position: "absolute",
              bottom: 0
            }}
          >
            CES
          </small>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
        >
          <MwambaCheckedMultiSelect
            options={options}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
