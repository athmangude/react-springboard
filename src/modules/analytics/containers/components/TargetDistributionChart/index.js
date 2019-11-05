/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Cell,
  Surface,
  Symbols,
  Legend,
  Tooltip,
  Label
} from "recharts";
import PropTypes from "prop-types";

export default class TargetDistributionChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    colors: PropTypes.array
  };

  getInitialState() {
    return {
      activeIndex: null
    };
  }

  state = {
    activeIndex: 0
  };

  onPieLeave = (data, index) => {
    this.setState({
      activeIndex: null
    });
  };

  onPieEnter = (data, index) => {
    this.setState({ activeIndex: index });
  };

  renderCusomizedLegend(props) {
    const { payload, verticalAlign } = props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          color: "#4a4a4a",
          font: "300 14px/1.4 Roboto, sans-serif",
          position: "absolute",
          right: 10,
          height: verticalAlign === "middle" ? "100%" : 260,
          paddingTop: verticalAlign === "middle" ? 0 : 35,
          overflowY: verticalAlign === "middle" ? "none" : "scroll"
        }}
      >
        {payload.map(entry => (
          <span style={{ marginLeft: 20, marginRight: 10 }}>
            <Surface width={10} height={10} viewBox="0 0 10 10">
              <Symbols cx={5} cy={5} type="rect" size={50} fill={entry.color} />
            </Surface>
            <span
              style={{
                marginLeft: 10,
                textTransform: "capitalize",
                marginRight: 10
              }}
            >
              {entry.value}
            </span>
          </span>
        ))}
      </div>
    );
  }

  renderActiveShape = props => {
    // console.log("[props]", props);
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 15}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  render() {
    const { data, colors } = this.props;
    const { activeIndex } = this.state;

    const total = data.reduce((sum, current) => sum + current.value, 0);
    return (
      <div style={{ width: "100%", height: 280, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span
            style={{
              color: "#4a4a4a",
              font: "300 26px/20px Roboto,sans-serif",
              marginBottom: 10
            }}
          >
            {total}
          </span>
          <span
            style={{
              color: "#4a4a4a",
              font: "300 14px/10px Roboto,sans-serif"
            }}
          >
            AMOUNT
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            height: 280,
            width: "100%",
            font: "300 12px/14px Roboto,sans-serif",
            letterSpacing: 0.01,
            marginBottom: 20
          }}
        >
          <ResponsiveContainer>
            <PieChart width={400} height={200}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#ffffff"
                paddingAngle={8}
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={this.renderActiveShape}
                onMouseEnter={this.onPieEnter}
                onMouseLeave={this.onPieLeave}
              >
                {data.map(entry => (
                  <Cell key={`cell-${entry.name}`} fill={colors[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload, label }) => {
                  // console.log("TOOLTIP DATA =>", active, payload, label);
                  if (active) {
                    return (
                      <div
                        className="custom-tooltip"
                        style={{
                          backgroundColor: "#fafafa",
                          color: "#818181",
                          padding: 10,
                          border: "solid 1px #d9d9d9",
                          textAlign: "center"
                        }}
                      >
                        <p className="label">{`${payload[0].name}`}</p>
                        <p className="desc">{`${payload[0].value}`}</p>
                        {/* <p> {(percent * 100).toFixed(1)} */}
                        <p className="label">{`${(
                          (payload[0].value / total) *
                          100
                        ).toFixed(1)}%`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={this.renderCusomizedLgend}
                verticalAlign="bottom"
                style={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  marginTop: "20px"
                }}
              />
            </PieChart>
            {/* <TwoLevelPieChart/> */}
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
