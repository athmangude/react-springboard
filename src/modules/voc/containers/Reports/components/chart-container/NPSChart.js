/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary, no-mixed-operators, radix */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import styled from 'styled-components';
import { PieChart, Pie, Cell } from 'recharts';
const colorScale = ['#f26b50', '#ffac28', '#20ab9c'];

const Span = styled.span`
  color: #9fa7aa;
  margin: 0 3px;
`;

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
    const { question } = this.props;

    this.calculateNPS(question);
  }

  componentWillReceiveProps(newProps) {
    const { question } = this.props;
    if (question.analysis !== newProps.question.analysis) {
      this.calculateNPS(newProps.question);
    }
  }

  calculateNPS(question) {
    const responses = question.analysis;

    const npsValues = {
      detractors: 0,
      passives: 0,
      promoters: 0,
    };

    let total = 0;

    responses.forEach((response) => {
      if (Number(response.text) <= 6 && response.text !== null) {
        npsValues.detractors += response.count;
      } else if (Number(response.text) > 8 && response.text !== null) {
        npsValues.promoters += response.count;
      } else if (response.text !== null) {
        npsValues.passives += response.count;
      }
      total += response.count;
    });

    const npsValue = (npsValues.promoters - npsValues.detractors) / total * 100;

    this.setState({
      nps: npsValues,
      totalRespondents: total,
      npsValue,
    });
  }

  render() {
    const { nps: { detractors, passives, promoters } } = this.state;
    const { nps, npsValue, totalRespondents } = this.state;
    const data = [
      { name: 'Detractors', value: detractors },
      { name: 'Passives', value: passives },
      { name: 'Promoters', value: promoters },
    ];

    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', width: 200, height: '100%', alignSelf: 'start' }}>
            {
              Object.keys(nps).map((key, i) => (
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', margin: '10px 0' }}>
                  <div>
                    <div style={{ backgroundColor: colorScale[i], height: 6, width: 100, borderRadius: 3 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Span>{key}</Span>
                    <Span>{nps[key]}</Span>
                    <Span>({`${parseFloat(nps[key] / totalRespondents * 100).toFixed(0)}%`})</Span>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ width: 'calc(100% - 200px)', minWidth: 200, maxWidth: 260, position: 'relative' }}>
            <ContainerDimensions>
              {
                ({ width }) => (
                  <PieChart width={width} height={200} onMouseEnter={this.onPieEnter}>
                    <Pie
                      data={data}
                      cx={120}
                      cy={90}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {
                        data.map((entry, index) => <Cell fill={colorScale[index % colorScale.length]} />)
                      }
                    </Pie>
                  </PieChart>
                )
              }
            </ContainerDimensions>
            <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, right: 0, backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <span style={{ fontWeight: 'lighter', fontSize: 30, margin: '0px 0px 5px' }}>{parseInt(npsValue)}</span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: 10, margin: 0, padding: 0, lineHeight: 1 }}>NPS</span>
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
