import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

import Visit from './Visit';
import VisitsGraph from './Graph';

const sampleData = [
  { period: '1 Dec', visits: 2400, unique: 1820 },
  { period: '2 Dec', visits: 1398, unique: 1150 },
  { period: '3 Dec', visits: 9800, unique: 1680 },
  { period: '4 Dec', visits: 3908, unique: 1100 },
  { period: '5 Dec', visits: 4800, unique: 150 },
  { period: '6 Dec', visits: 3800, unique: 1900 },
  { period: '7 Dec', visits: 4300, unique: 1600 },
  { period: '8 Dec', visits: 2400, unique: 1400 },
  { period: '9 Dec', visits: 1398, unique: 1100 },
  { period: '10 Dec', visits: 9800, unique: 1500 },
  { period: '11 Dec', visits: 3908, unique: 1600 },
  { period: '12 Dec', visits: 4800, unique: 1700 },
  { period: '13 Dec', visits: 3800, unique: 1800 },
  { period: '14 Dec', visits: 4300, unique: 1900 },
  { period: '15 Dec', visits: 2400, unique: 1000 },
  { period: '16 Dec', visits: 1398, unique: 1100 },
  { period: '17 Dec', visits: 9800, unique: 1200 },
  { period: '18 Dec', visits: 3908, unique: 1300 },
  { period: '19 Dec', visits: 4800, unique: 1400 },
  { period: '20 Dec', visits: 3800, unique: 1500 },
  { period: '21 Dec', visits: 4300, unique: 1600 },
];

const visits = {
  today: { totalVisitors: 1329, totalVisitorsPercentageIncrease: 21, uniqueVisitors: 547, uniqueVisitorsPercentageIncrease: 16 },
  thisWeek: { totalVisitors: 15329, totalVisitorsPercentageIncrease: 21, uniqueVisitors: 2300, uniqueVisitorsPercentageIncrease: 16 },
  thisMonth: { totalVisitors: 93929, totalVisitorsPercentageIncrease: -21, uniqueVisitors: 89365, uniqueVisitorsPercentageIncrease: -16 },
};

const dataSchema = {
  today: { totalVisitors: 0, totalVisitorsPercentageIncrease: 0, uniqueVisitors: 0, uniqueVisitorsPercentageIncrease: 0 },
  thisWeek: { totalVisitors: 0, totalVisitorsPercentageIncrease: 0, uniqueVisitors: 0, uniqueVisitorsPercentageIncrease: 0 },
  thisMonth: { totalVisitors: 0, totalVisitorsPercentageIncrease: 0, uniqueVisitors: 0, uniqueVisitorsPercentageIncrease: 0 },
};

const Visits = ({ data, width }) => {
  let comparisonKey = 'yesterday';
  Object.keys(dataSchema).forEach((key) => {
    dataSchema[key].totalVisitors = data[key].allVisitsCount;
    dataSchema[key].uniqueVisitors = data[key].uniqueVisitsCount;
    if (key !== 'today') {
      comparisonKey = key.replace('this', 'last');
    }
    dataSchema[key].totalVisitorsPercentageIncrease = (parseInt(data[key].allVisitsCount - data[comparisonKey].allVisitsCount, 10) / parseInt(data[comparisonKey].allVisitsCount, 10)) * 100;
    dataSchema[key].uniqueVisitorsPercentageIncrease = (parseInt(data[key].uniqueVisitsCount - data[comparisonKey].uniqueVisitsCount, 10) / parseInt(data[comparisonKey].uniqueVisitsCount, 10)) * 100;
  });
  return (
    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: width > 425 ? '0 10px 0 10px' : 0, borderRadius: 8 }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 5px 20px 5px rgba(67, 70, 86, 0.1)', marginBottom: 20, marginTop: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Visits</div>
        <div style={{ display: 'flex', flexDirection: width > 728 ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
          {
            Object.keys(dataSchema).map((key) => (
              <Visit key={key} label={key} visit={dataSchema[key]} />
            ))
          }
        </div>
        <VisitsGraph data={sampleData} />
      </div>
    </Col>
  );
};

Visits.propTypes = {
  width: PropTypes.number,
  data: PropTypes.object,
};

export default Visits;
