/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { XMasonry, XBlock } from 'react-xmasonry/dist/index';

import Trend from '../../components/NPSTrend';
import WordCloudMentions from '../WordCloudMentions';
import HighlightCard from '../../components/HighlightCard';
import HighestSpender from '../../Spend/HighestSpender';
import Locations from '../Locations';
import Segments from '../Segments';
import Impact from '../../components/ImpactRadarChart';
import Mentions from '../../components/Mentions';

// const ratings = [
//   { title: 'No. of Raters', subtitle: 'How many customers have rated my business?', name: '', value: 571908, valueContextRight: 'customers', performance: 2.9, icon: 'people_outline', rangeDays: 30 },
//   { title: 'Highest NPS', subtitle: 'What has been my highest NPS?', name: '', value: 82, valueContextLeft: 'NPS', performance: 4.3, icon: 'star', rangeDays: 30 },
//   { title: 'Lowest NPS', subtitle: 'What has been my lowest NPS?', name: '', value: -32, valueContextLeft: 'NPS', performance: -1.9, icon: 'star_border', rangeDays: 30 },
// ];

const locationsPerformance = [
  { title: 'Top Location', subtitle: 'Which is the location with highest NPS?', name: 'Java - Hurlingham', value: 71, valueContextLeft: 'NPS', performance: 2.9, icon: 'place', rangeDays: 30 },
  { title: 'Bottom Location', subtitle: 'Which is the location with the lowest NPS?', name: 'Java - Karen', value: -22, valueContextLeft: 'NPS', performance: -1.9, icon: 'place', rangeDays: 30 },
];

const segmentsPerformance = [
  { title: 'Top Segment', subtitle: 'Which is my top performing segment?', name: 'Nairobi', value: 678934758974, valueContextLeft: 'NPS', performance: 1.4, icon: 'group', rangeDays: 30 },
  { title: 'Bottom Segments', subtitle: 'Which is my least performing segment?', name: 'Mombasa', value: 56787, performance: -2.9, valueContextLeft: 'NPS', icon: 'group', rangeDays: 30 },
];

const highestRaterComment = { bookmarked: false, chats: [], commId: '+254711151863', commentId: 5513116, createDate: 1555488599517, id: 12757008, metadata: { branch_code: '315302', amount: '10400.0', last_name: 'ROTICH', location: 'Aga Khan Dr. Plaza', first_name: 'FAITH', transaction_timestamp: '2019-04-17T08:09:49Z' }, npsComment: 'The service was amazing and the food is always exceptional', npsScore: 10, read: true, surveyTitle: 'Java Customer Feedback Nairobi', systemTags: ['food', 'service'], userTags: [] };
const lowestRaterComment = { bookmarked: false, chats: [], commId: '+254711151863', commentId: 5513116, createDate: 1555488599517, id: 12757008, metadata: { branch_code: '315301', amount: '120.0', last_name: 'NJUGUNA', location: 'Mama Ngina', first_name: 'KEVIN', transaction_timestamp: '2019-04-17T08:09:49Z' }, npsComment: 'Excellent samosas, though pricy', npsScore: 5, read: true, surveyTitle: 'Java Customer Feedback Nairobi', systemTags: ['food', 'price'], userTags: [] };

const Overview = ({ windowDimensions, configurations, customerAnalyticsActions, collaborators, alertActions, homeActions, EventHandler, colors, themes, isLoadingThemes, selectedDateRange, appliedFilters, selectedSegment, demoMode, ratings }) => {
  const { width } = windowDimensions;

  return (
    <div id="loyalty-overview">
      <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="nps-over-time" width={4}>
            <Trend
              themes={themes}
              isLoadingThemes={isLoadingThemes}
              selectedDateRange={selectedDateRange}
              selectedSegment={selectedSegment}
              appliedFilters={appliedFilters}
              demoMode={demoMode}
              customerAnalyticsActions={customerAnalyticsActions}
              windowDimensions={windowDimensions}
              EventHandler={EventHandler}
              alertActions={alertActions}
            />
          </XBlock>
          {
            ratings.map((metric) => (
              <XBlock key={metric.title.trim()} width={1}>
                <HighlightCard metric={metric} />
              </XBlock>
            ))
          }
        </XMasonry>
      </div>
      <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="themes-impact" width={2}>
            <Impact themes={themes} isLoadingThemes={isLoadingThemes} selectedDateRange={selectedDateRange} selectedSegment={selectedSegment} appliedFilters={appliedFilters} demoMode={demoMode} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} minimal />
          </XBlock>
          <XBlock key="mentions" width={3}>
            <Mentions themes={themes} isLoadingThemes={isLoadingThemes} colors={colors} selectedDateRange={selectedDateRange} selectedSegment={selectedSegment} appliedFilters={appliedFilters} demoMode={demoMode} customerAnalyticsActions={customerAnalyticsActions} windowDimensions={windowDimensions} EventHandler={EventHandler} alertActions={alertActions} minimal />
          </XBlock>
          {/* <XBlock key="word-cloud-mentions" width={3}>
            <WordCloudMentions data={themes} isLoading={isLoadingThemes} colors={colors} width={width > 425 ? width > 768 ? 500 : 768 : 425} height={320} />
          </XBlock> */}
        </XMasonry>
      </div>
      {/* <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="mentions" width={3}>
            <Mentions themes={themes} isLoadingThemes={isLoadingThemes} colors={colors} selectedDateRange={selectedDateRange} selectedSegment={selectedSegment} appliedFilters={appliedFilters} demoMode={demoMode} customerAnalyticsActions={customerAnalyticsActions} windowDimensions={windowDimensions} EventHandler={EventHandler} alertActions={alertActions} minimal />
          </XBlock>
        </XMasonry>
      </div> */}
      <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="locations-performance" width={2}>
            <Locations selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} demoMode={demoMode} width={width} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} />
          </XBlock>
          <XBlock key="segments-performance" width={3}>
            <Segments selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} demoMode={demoMode} width={width} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} />
          </XBlock>
          {/* {
            locationsPerformance.map((metric) => (
              <XBlock key={metric.title.trim()} width={1}>
                <HighlightCard metric={metric} />
              </XBlock>
            ))
          } */}
        </XMasonry>
      </div>
      {/* <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="segments-performance" width={2}>
            <Locations selectedDateRange={selectedDateRange} appliedFilters={appliedFilters} selectedSegment={selectedSegment} demoMode={demoMode} width={width} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} />
          </XBlock>
          {
            segmentsPerformance.map((metric) => (
              <XBlock key={metric.title.trim()} width={1}>
                <HighlightCard metric={metric} />
              </XBlock>
            ))
          }
        </XMasonry>
      </div> */}
      {/* <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="highest-rater-comment" width={2}>
            <HighestSpender title="Customer Spotlight" subtitle="Which customer rated me the highest?" comment={{ ...highestRaterComment, uiSortDate: moment(highestRaterComment.createDate), type: 'comment' }} collaborators={collaborators} configurations={configurations} homeActions={homeActions} EventHandler={EventHandler} alertActions={alertActions} />
          </XBlock>
          <XBlock key="lowest-rater-comment" width={2}>
            <HighestSpender title="&nbsp;" subtitle="Which customer rated me the lowest?" comment={{ ...lowestRaterComment, uiSortDate: moment(lowestRaterComment.createDate), type: 'comment' }} collaborators={collaborators} configurations={configurations} homeActions={homeActions} EventHandler={EventHandler} alertActions={alertActions} />
          </XBlock>
        </XMasonry>
      </div> */}
    </div>
  );
};

Overview.propTypes = {
  colors: PropTypes.array,
  themes: PropTypes.object,
  isLoadingThemes: PropTypes.bool,
  selectedDateRange: PropTypes.string,
  appliedFilters: PropTypes.array,
  selectedSegment: PropTypes.object,
  demoMode: PropTypes.bool,
  windowDimensions: PropTypes.object,
  alertActions: PropTypes.object,
  homeActions: PropTypes.object,
  configurations: PropTypes.object,
  collaborators: PropTypes.object,
  EventHandler: PropTypes.object,
  customerAnalyticsActions: PropTypes.object,
};

export default Overview;
