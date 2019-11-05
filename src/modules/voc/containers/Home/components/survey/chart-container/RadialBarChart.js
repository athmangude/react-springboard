import React from 'react';
import PropTypes from 'prop-types';
import { RadialBarChart, RadialBar } from 'recharts';
import ContainerDimensions from 'react-container-dimensions';
import { Container, Row, Col } from 'react-grid-system';

const data = [
  { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8', max: 31.47 },
  { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed', max: 31.47 },
  { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1', max: 31.47 },
  { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d', max: 31.47 },
  { name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c', max: 31.47 },
];

const MyRadialBarChart = (props) => (
  <Container style={{ border: 'solid 1px #d9d9d9', backgroundColor: '#FFF', padding: 10 }}>
    <Row>
      <Col xl={5} lg={5} md={5} sm={12} xs={12}>
        <b>{props.question.text}</b>
        <div style={{ margin: 10 }}>
          {
            data.map((item, i) => (
              <div key={i} style={{ margin: '10px 0' }}>
                <div style={{ backgroundColor: item.fill, height: 6, width: 30, borderRadius: 3 }} />
                <span style={{ color: '#9fa7aa', fontSize: 10 }}>Lorem ipsum dolor sit amet</span>
              </div>
            ))
          }
        </div>
      </Col>
      <Col xl={7} lg={7} md={7} sm={12} xs={12}>
        <ContainerDimensions>
          {
            ({ width }) => (
              <RadialBarChart
                width={width}
                height={width}
                cx={width / 2}
                cy={width / 2}
                innerRadius={width / 20}
                outerRadius={width / 2}
                barSize={width / (8 * data.length)}
                data={data}
              >
                <RadialBar
                  minAngle={15}
                  clockWise
                  cornerRadius={10}
                  dataKey="uv"
                  stackId="a"
                  background
                />
              </RadialBarChart>
            )
          }
        </ContainerDimensions>
      </Col>
    </Row>
  </Container>
);

MyRadialBarChart.propTypes = {
  question: PropTypes.object.isRequired,
};

export default MyRadialBarChart;
