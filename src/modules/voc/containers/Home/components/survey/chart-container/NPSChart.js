/* eslint-disable no-nested-ternary, no-mixed-operators, radix */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import { VictoryChart, VictoryPie, VictoryAxis } from 'victory';

const colorScale = ['#f26b50', '#ffac28', '#20ab9c'];

class MyRadialBarChart extends Component {
  constructor(props) {
    super(props);

    this.calculateNPS = this.calculateNPS.bind(this);
  }

  state = {
    nps: {
      detractors: 0,
      passives: 0,
      promoters: 0,
    },
    totalRespondents: 0,
    npsValue: 0,
  }

  componentDidMount() {
    this.calculateNPS();
  }

  calculateNPS() {
    const { responses } = this.props.question;

    const npsValues = {
      detractors: 0,
      passives: 0,
      promoters: 0,
    };

    let total = 0;

    Object.values(responses).forEach((value) => {
      if (value <= 6) {
        npsValues.detractors += 1;
      } else if (value > 8) {
        npsValues.promoters += 1;
      } else {
        npsValues.passives += 1;
      }
      total += 1;
    });

    const npsValue = (npsValues.promoters - npsValues.detractors) / total * 100;

    this.setState({
      nps: npsValues,
      totalRespondents: total,
      npsValue,
    });
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', width: 200, height: '100%', alignSelf: 'start' }}>
            {
              Object.keys(this.state.nps).map((key, i) => (
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', margin: '10px 0' }}>
                  <div>
                    <div style={{ backgroundColor: colorScale[i], height: 6, width: 100, borderRadius: 3 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#9fa7aa', margin: '0 3px' }}>{key}</span>
                    <span style={{ color: '#9fa7aa', margin: '0 3px' }}>({`${parseFloat(this.state.nps[key] / this.state.totalRespondents * 100).toFixed(1)}%`})</span>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ width: 'calc(100% - 200px)', minWidth: 200, maxWidth: 260, position: 'relative' }}>
            <ContainerDimensions>
              {
                ({ width }) => (
                  <VictoryChart width={width} height={width}>
                    <VictoryAxis height={width} width={width} style={{ axis: { stroke: 'none' } }} tickLabelComponent={<div />} />
                    <VictoryPie
                      width={width}
                      height={width}
                      innerRadius={(width / 2) - 70}
                      colorScale={colorScale}
                      labels={() => null}
                      data={[
                        { y: this.state.nps.detractors },
                        { y: this.state.nps.passives },
                        { y: this.state.nps.promoters },
                      ]}
                    />
                  </VictoryChart>
                )
              }
            </ContainerDimensions>
            <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, right: 0, backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <span style={{ fontWeight: 'lighter', fontSize: 30, margin: '0px 0px 5px', color: '#6d6e71' }}>{parseInt(this.state.npsValue)}</span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: 10, margin: 0, padding: 0, lineHeight: 1, color: '#6d6e71' }}>NPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyRadialBarChart.propTypes = {
  question: PropTypes.object.isRequired,
};

export default MyRadialBarChart;
