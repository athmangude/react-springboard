/* eslint-disable react/jsx-filename-extension, react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, CartesianGrid, Tooltip } from 'recharts';
import { Statistic } from 'semantic-ui-react';
import moment from 'moment';
import ContainerDimensions from 'react-container-dimensions';

const styles = {
  statisticValue: {
    color: '#808285',
    fontSize: 20,
  },
  statisticLabel: {
    textTransform: 'capitalize',
    color: '#808285',
    fontWeight: 'lighter',
    fontSize: 10,
  },
};

const ContactedRespondedChart = (props) => (
  <div style={{ width: '100%' }}>
    <ContainerDimensions>
      {
        ({ width }) => (
          <div className="ui chart small-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#f9fafc', border: 'solid 1px #d9d9d9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Statistic size="small">
                <Statistic.Label style={{ ...styles.statisticLabel, color: '#808285' }}>People Contacted</Statistic.Label>
                <Statistic.Value style={{ ...styles.statisticValue, fontWeight: 'lighter' }}>{props.total}</Statistic.Value>
                <Statistic.Label style={styles.statisticLabel}>This Month</Statistic.Label>
              </Statistic>
            </div>
            <div>
              <BarChart
                width={width - 140}
                height={100}
                data={props.contacted}
                margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
              >
                <Tooltip
                  offset={-10}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      return (
                        <div style={{ height: 36, width: 58, borderRadius: 15, backgroundColor: '#33597f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative', left: -20 }}>
                          <span style={{ color: '#FFFFFF', fontSize: 6, margin: 0 }}>{moment(payload[0].payload.date).format('MMM DD, YYYY')}</span>
                          <span style={{ color: '#FFFFFF', fontSize: 10, margin: -10 }}>{payload[0].value}</span>
                          <span style={{ color: '#FFFFFF', fontSize: 6, margin: 0 }}>{payload[0].name}</span>
                          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #33597f', position: 'absolute', bottom: -5 }} />
                        </div>
                      );
                    }

                    return (
                      <div />
                    );
                  }}
                />
                <CartesianGrid
                  stroke="#eee"
                  strokeDasharray="0 0"
                />
                <Bar
                  dataKey="respondents"
                  maxBarSize={80}
                  minPointSize={1}
                  barCategoryGap="1%"
                  fill="#d9d9d9"
                  background={false}
                />
              </BarChart>
            </div>
          </div>
        )
      }
    </ContainerDimensions >
  </div>
);

ContactedRespondedChart.propTypes = {
  contacted: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

export default ContactedRespondedChart;
