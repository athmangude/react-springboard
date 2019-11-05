// https://github.com/recharts/recharts/issues/120
// https://codepen.io/eeyore/pen/RjzgdM

/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import ContainerDimensions from 'react-container-dimensions';
import { Container, Row, Col } from 'react-grid-system';

const data = [
  { name: '18-24', uv: 31.47, pv: 11, fill: 'rgba(72,125,179, 1)', max: 31.47 },
  { name: '25-29', uv: 26.69, pv: 20, fill: 'rgba(72,125,179, 0.9)', max: 31.47 },
  { name: '30-34', uv: 15.69, pv: 8, fill: 'rgba(72,125,179, 0.8)', max: 31.47 },
  { name: '35-39', uv: 8.22, pv: 9, fill: 'rgba(72,125,179, 0.7)', max: 31.47 },
  { name: '40-49', uv: 8.63, pv: 38, fill: 'rgba(72,125,179, 0.6)', max: 31.47 },
  { name: '25-29', uv: 26.69, pv: 20, fill: 'rgba(72,125,179, 0.9)', max: 31.47 },
  { name: '30-34', uv: 15.69, pv: 8, fill: 'rgba(72,125,179, 0.8)', max: 31.47 },
];

const barSize = 30;

const MyBarChart = (props) => {
  const responseTexts = props.question.responses.map((response) => response.text);

  const uniqueItems = new Set(responseTexts);

  const chartData = [];
  let shader = uniqueItems.size;
  uniqueItems.forEach((item, iteM, thisSet) => {
    chartData.push({
      name: item,
      count: responseTexts.reduce((accumulator, currentValue) => Number(currentValue) === Number(item) ? accumulator + Number(currentValue) : accumulator, 0),
      fill: `rgba(72, 125, 179, ${0.5 + (0.5 / thisSet.size * shader)})`,
    });

    shader -= 1;
  });

  return (
    <Container style={{ border: 'solid 1px #d9d9d9', backgroundColor: '#FFF', padding: 10 }}>
      <Row>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <ContainerDimensions>
            {
              ({ width }) => (
                <BarChart
                  layout="vertical"
                  width={width}
                  height={((barSize - 10) * data.length)}
                  data={chartData}
                  barSize={barSize}
                  barCategoryGap={0}
                  margin={{ top: 20, right: 30, bottom: 20, left: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    width={200}
                    interval={0}
                    tick={(tickProps) => {
                      const { x, y } = tickProps;
                      const tickWidth = tickProps.width;

                      return (
                        <g>
                          <rect x={x - 192} y={y - 16} width={tickWidth} height={barSize} style={{ fill: '#f4f4f4', strokeWidth: 0, stroke: 'rgba(0,0,0, 0.1)' }} />
                          <text x={x - 185} y={y + 5} fontFamily="Verdana" fontSize="15" fill="#888888">{chartData[tickProps.index].name}</text>
                        </g>
                      );
                    }}
                    axisLine={false}
                  />
                  <Bar dataKey="count" fill="#8884d8" background={{ fill: '#f4f4f4' }}>
                    <LabelList
                      dataKey="count"
                      content={(labelListProps) => {
                        const { x, y, value } = labelListProps;
                        const labelListWidth = labelListProps.width;
                        const radius = 20;

                        return (
                          <g>
                            <text x={x + labelListWidth + 15} y={y + (radius - 5)} fill="#888888" textAnchor="middle" dominantBaseline="middle">
                              {`${value}`}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              )
            }
          </ContainerDimensions>
        </Col>
      </Row>
    </Container>
  );
};

MyBarChart.propTypes = {
  question: PropTypes.object.isRequired,
};

export default MyBarChart;
