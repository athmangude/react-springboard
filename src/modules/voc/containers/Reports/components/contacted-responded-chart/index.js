import React from 'react';
import { Statistic } from 'semantic-ui-react';
import { BarChart, Bar, CartesianGrid, Tooltip } from 'recharts';
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

const data = [{
  contacted: 10,
  contactedPadded: 2,
  date: new Date('01-12-2018'),
}, {
  contacted: 5,
  contactedPadded: 2,
  date: new Date('01-13-2018'),
}, {
  contacted: 8,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 11,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 17,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 20,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 3,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 15,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 9,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 1,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 6,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 3,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 11,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}, {
  contacted: 7,
  contactedPadded: 1,
  date: new Date('01-14-2018'),
}, {
  contacted: 10,
  contactedPadded: 2,
  date: new Date('01-14-2018'),
}];

export default () => (
  <div style={{ width: '100%', margin: '10px 0' }}>
    <ContainerDimensions>
      {
        ({ width }) => (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafc', border: 'solid 1px #d9d9d9', flexWrap: 'wrap' }}>
            <div style={{ width: 100 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 10 }}>
                <Statistic size="small">
                  <Statistic.Label style={{ ...styles.statisticLabel, color: '#808285' }}>People Contacted</Statistic.Label>
                  <Statistic.Value style={{ ...styles.statisticValue, fontWeight: 'lighter' }}>1.2K</Statistic.Value>
                  <Statistic.Label style={styles.statisticLabel}>This Month</Statistic.Label>
                </Statistic>
              </div>
            </div>
            <div style={{ width: (width - 120) > 150 ? (width - 120) : width }}>
              <BarChart
                width={(width - 120) > 150 ? (width - 120) : width}
                height={100}
                data={data}
                margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
              >
                <Tooltip
                  offset={-10}
                  cursor={{ fill: '#f0f0f0', fillOpacity: 0.5 }}
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
                  dataKey="contacted"
                  maxBarSize={80}
                  minPointSize={1}
                  barCategoryGap="1%"
                  fill="#f26b50"
                  stackId="a"
                />
                <Bar
                  dataKey="contactedPadded"
                  maxBarSize={80}
                  minPointSize={1}
                  barCategoryGap="1%"
                  fill="#aed8f2"
                  stackId="a"
                />
              </BarChart>
            </div>
          </div>
        )
      }
    </ContainerDimensions>
  </div>
);
