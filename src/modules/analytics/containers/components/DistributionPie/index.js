/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Legend,
  ResponsiveContainer,
  Cell,
  Surface,
  Symbols,
  Tooltip
} from "recharts";
import PropTypes from "prop-types";

import TabMenu from "SharedComponents/tab";

const npsTabs = [{ label: "Average" }, { label: "Individual" }];

const npsColorScale = ["#fd9681", "#fcda6e", "#80c582"];

export default class DistributionPie extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    nps: PropTypes.bool,
    minimal: PropTypes.bool
  };

  state = {
    activeIndex: 0,
    selectedTab: "Average"
  };

  onPieEnter = (data, index) => {
    this.setState({ activeIndex: index });
  };

  onTabSelected = selectedTab => {
    this.setState({ selectedTab });
  };

  renderCusomizedLegend(props) {
    const { payload, verticalAlign } = props;

    return (
      <div
        className="hide-scrollbars"
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
          <span style={{ marginLeft: 10, marginRight: 10 }}>
            <Surface width={10} height={10} viewBox="0 0 10 10">
              <Symbols cx={5} cy={5} type="rect" size={50} fill={entry.color} />
            </Surface>
            <span style={{ marginLeft: 5, textTransform: "capitalize" }}>
              {entry.value}
            </span>
          </span>
        ))}
      </div>
    );
  }

  renderActiveShape = props => {
    const { nps, minimal } = this.props;
    const { selectedTab } = this.state;

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
        {nps && selectedTab === "Average" ? null : (
          <g>
            <text
              x={cx}
              y={cy - 20}
              dy={8}
              textAnchor="middle"
              fill="rgb(72, 125, 179)"
              className="svg-text-style"
            >
              {payload.name}
            </text>
            <text
              x={cx}
              y={cy}
              dy={8}
              textAnchor="middle"
              fill="rgb(72, 125, 179)"
              className="svg-text-style"
            >{`NPS ${value}`}</text>
            <text
              x={cx}
              y={cy + 20}
              dy={8}
              textAnchor="middle"
              fill="rgb(72, 125, 179)"
              className="svg-text-style"
            >
              {(percent * 100).toFixed(1)}%
            </text>
          </g>
        )}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 15}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        {/* <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        /> */}
        {/* {
          !minimal ? (
            <g>
              <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}  fill="none" />
              <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
              <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="svg-text-style">{`${payload.name} ${value}`}</text>
              <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="svg-text-style">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
              </text>
            </g>
          ) : null
        } */}
      </g>
    );
  };

  render() {
    const { data: original, nps } = this.props;
    const { activeIndex, selectedTab } = this.state;

    let detractors = 0;
    let passives = 0;
    let promoters = 0;
    const data = original
      .map(record => {
        detractors += record.detractors;
        passives += record.passives;
        promoters += record.promoters;

        const count = record.promoters + record.passives + record.detractors;
        const npsValue = (
          ((record.promoters - record.detractors) / count) *
          100
        ).toFixed(1);
        return { ...record, count, nps: parseFloat(npsValue, 10) };
      })
      .sort((a, b) => (nps ? b.nps - a.nps : b.count - a.count));

    const overallNpsData = [
      { name: "Detractors", count: detractors },
      { name: "Passives", count: passives },
      { name: "Promoters", count: promoters }
    ];
    const overallNPS = (
      ((promoters - detractors) / (promoters + passives + detractors)) *
      100
    ).toFixed(1);
    return (
      <div style={{ width: "100%" }}>
        {nps ? (
          <div style={{ width: "100%" }}>
            <TabMenu
              tabs={npsTabs}
              selectedTab={selectedTab}
              onTabSelected={this.onTabSelected}
            />
            {selectedTab === "Average" ? (
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
                    {overallNPS}
                  </span>
                  <span
                    style={{
                      color: "#4a4a4a",
                      font: "300 14px/10px Roboto,sans-serif"
                    }}
                  >
                    NPS
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 280,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        activeIndex={this.state.activeIndex}
                        activeShape={this.renderActiveShape}
                        data={overallNpsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="rgb(72, 125, 179)"
                        dataKey="count"
                        startAngle={-270}
                        activeIndex={activeIndex}
                        activeShape={this.renderActiveShape}
                        onMouseEnter={this.onPieEnter}
                        onMouseLeave={this.onPieLeave}
                      >
                        {overallNpsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={npsColorScale[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload, label }) => {
                          console.log(
                            "TOOLTIP DATA =>",
                            active,
                            payload,
                            label
                          );
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
                                <p className="desc">
                                  {`${payload[0].value}`}
                                  <p className="label">{`${payload[0].percent}`}</p>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        content={this.renderCusomizedLegend}
                        verticalAlign="top"
                        style={{
                          marginRight: "5px"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 280,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={this.renderActiveShape}
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="rgb(72, 125, 179)"
                      dataKey="nps"
                      startAngle={-270}
                      activeIndex={activeIndex}
                      activeShape={this.renderActiveShape}
                      onMouseEnter={this.onPieEnter}
                      onMouseLeave={this.onPieLeave}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`rgba(72, 125, 179, ${(data.length - index) /
                            data.length})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload, label }) => {
                        console.log("TOOLTIP DATA =>", active, payload, label);
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
                              <p className="desc">
                                {`${payload[0].value}`}
                                <p className="label">{`${payload[0].percent}`}</p>
                                Anything you want can be displayed here.
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      content={this.renderCusomizedLegend}
                      verticalAlign="top"
                      style={{
                        marginRight: "5px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: 280,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={this.renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="rgb(72, 125, 179)"
                  dataKey="count"
                  startAngle={-270}
                  activeIndex={activeIndex}
                  activeShape={this.renderActiveShape}
                  onMouseEnter={this.onPieEnter}
                  onMouseLeave={this.onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`rgba(72, 125, 179, ${(data.length - index) /
                        data.length})`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload, label }) => {
                    console.log("TOOLTIP DATA =>", active, payload, label);
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
                          <p className="desc">
                            {`${payload[0].value}`}
                            <p className="label">{`${payload[0].percent}`}</p>
                            Anything you want can be displayed here.
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  content={this.renderCusomizedLegend}
                  verticalAlign="top"
                  style={{
                    marginRight: "5px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }
}
