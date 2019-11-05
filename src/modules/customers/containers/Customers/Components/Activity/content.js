/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { XMasonry, XBlock } from 'react-xmasonry/dist/index';
import { Container, Row, Col } from 'react-grid-system';
import styled from 'styled-components';
import ContentStyles from './contentStyles';

import Title from 'Modules/analytics/containers/components/Title';
import TransactionInformation from '../ViewCustomer/TransactionInformation';
import CustomerSpendOverTime from '../ViewCustomer/SpendOverTime';
import CustomerRatingOverTime from '../ViewCustomer/CustomerRatingOverTime';
import CustomerSegments from '../ViewCustomer/CustomerSegments';
const ActivityWrapper = styled.div`${ContentStyles}`;

const Content = ({ selectedActivity, isLoadingTransactions, customerAnalyticsActions, participantId, selectedDateRange, EventHandler, demoMode, customerSpendData, isLoadingCustomerSpend, onChangeInterval, onViewSegment, customerRatingData, isLoadingNpsTrend, isLoadingSegments, segments, themes, currency, activityInformation, width, style, context }) => (
  <div className="hide-scrollbars" style={{ flex: (width > 768 && width <= 1156) ? 1 : 2, flexDirection: 'row', width: '50%', borderLeft: '1px solid #d8d8d8', overflowY: 'scroll', zIndex: 1, ...style }} ref={activityInformation}>
    <ActivityWrapper>
      <Container>
        <Row>
          <Col style={{ paddingLeft: 0, paddingRight: 5 }}>
            <TransactionInformation selectedActivity={selectedActivity} currency={currency} loading={isLoadingTransactions} />

            <CustomerRatingOverTime
              customerAnalyticsActions={customerAnalyticsActions}
              EventHandler={EventHandler}
              participantId={participantId}
              selectedDateRange={selectedDateRange}
              demoMode={demoMode}
              currency={currency}
              style={{ boxShadow: 0, padding: 0 }}
            />

            {/* <div style={{ flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', width: '100%', padding: 10, backgroundColor: 'rgb(236, 236, 236)', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Title title="Themes" subtitle="What themes stand out about this location?" />
                </div>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 5 }}>
                  <RadarChart width={400} height={400} cx="50%" cy="50%" outerRadius={150} data={themes}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="theme" />
                    <PolarRadiusAxis />
                    <Legend />
                    <Tooltip />
                    <Radar name="NPS" dataKey="nps" stroke="rgb(191,42,44)" fill="rgb(191,42,44)" fillOpacity={0.5} />
                  </RadarChart>
                </div>
              </div>
            </div> */}
          </Col>
          <Col style={{ paddingRight: 0, paddingLeft: 5 }}>
            <CustomerSpendOverTime
              width={width}
              customerAnalyticsActions={customerAnalyticsActions}
              EventHandler={EventHandler}
              participantId={participantId}
              selectedDateRange={selectedDateRange}
              demoMode={demoMode}
              currency={currency}
            />
            
            {/* <CustomerSegments
              customerAnalyticsActions={customerAnalyticsActions}
              EventHandler={EventHandler}
              demoMode={demoMode}
              context={context}
            /> */}
          </Col>
        </Row>
      </Container>
    </ActivityWrapper>
  </div>
);

Content.propTypes = {
  selectedActivity: PropTypes.object,
  isLoadingTransactions: PropTypes.bool,
  isLoadingCustomerSpend: PropTypes.bool,
  isLoadingNpsTrend: PropTypes.bool,
  isLoadingSegments: PropTypes.bool,
  segments: PropTypes.array,
  themes: PropTypes.array,
  customerSpendData: PropTypes.array,
  customerRatingData: PropTypes.array,
  onChangeInterval: PropTypes.func,
  currency: PropTypes.string,
};

export default Content;
