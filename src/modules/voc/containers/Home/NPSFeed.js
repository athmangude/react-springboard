import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Spinner from 'react-spinner-material';
import { isIE } from 'react-device-detect';
import ContainerDimensions from 'react-container-dimensions';
import moment from 'moment';
import ActionButton from 'SharedComponents/action-button-styled';

import Feedback from './components/feedback';
import DateSegemnt from './components/DateSegment';
import Survey from './components/survey';
import EmptyFeedItem from './components/EmptyFeedItem';
import TrendsToday from './components/trends-today';
import NPSCard from './components/nps-card/npsCard';

import themes from 'SharedComponents/themes';

const theme = themes.light;

const { primaryColor } = theme;

const NPSFeed = ({ home, dateFilters, isFetchingActivityFeed, isFetchingFeedComments, collaborators, configurations, isFetchingHomeFeed, npsFilters, setNPSFilters, isFetchingNPS, homeActions, onFeedFiltersChanged, isFetchingContacted, isFetchingTrendingThemes, windowDimensions, EventHandler, alertActions, isRefreshingFeed, onLoadMoreActivityFeedItems, conversations, setNPSTag, clearNPSTag, feedFilters }) => {
  let contacted = home.contacted.items.map((value) => ({
    date: moment(value.date, 'x').toDate(),
    respondents: parseInt(value.contacted),
    finished: parseInt(value.finished),
    value,
  }));

  // TODO: pick the last ten entries
  const daysInMonth = dateFilters.clone().daysInMonth();
  const padding = new Array(Math.abs(daysInMonth - contacted.length)).fill(0).map((item, i) => ({
    date: contacted.length ? moment(contacted[contacted.length - 1].value.date).add((i + 1), 'days') : moment().add((i + 1), 'days'),
    respondents: 0,
    finished: 0,
  }));

  contacted = [...contacted, ...padding];

  const totalContacted = contacted.reduce((currentValue, nextValue) => currentValue + nextValue.respondents, 0);
  const totalResponded = contacted.reduce((currentValue, nextValue) => currentValue + nextValue.finished, 0);


  const { feedItems } = home;
  const visibleFeedItemsGroup = feedItems.sort((a, b) => b.createDate - a.createDate);

  const timeline = [];
  let currentUISortdate;

  if (visibleFeedItemsGroup.length) {
    timeline.push({
      type: 'date',
      value: visibleFeedItemsGroup[0].uiSortDate,
    });

    currentUISortdate = visibleFeedItemsGroup[0].uiSortDate;
  }

  visibleFeedItemsGroup.forEach((feedItem) => {
    if (currentUISortdate.diff(feedItem.uiSortDate, 'days') > 0) {
      currentUISortdate = feedItem.uiSortDate;
      timeline.push({
        type: 'date',
        value: feedItem.uiSortDate,
      });
    }

    timeline.push(feedItem);
  });

  // Prepare NPS filters with values that will be passed down to child components
  const filters = {};
  Object.keys(npsFilters).forEach((key) => {
    if (npsFilters[key]) {
      filters[key] = npsFilters[key];
    }
  });

  return (
    <Container fluid style={{ width: 'calc(100% - 20px)', padding: 0, margin: 10 }}>
      <Row style={{ width: '100%', margin: 0, padding: 0 }}>
        <Col xl={7} lg={7} md={7} sm={12} xs={12} style={{ overflow: 'unset', padding: 10 }}>
          <div style={{ width: '100%' }}>
            {
              !timeline.length && (isFetchingActivityFeed || isFetchingFeedComments) ? (
                <div
                  style={{
                    width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Spinner spinnerColor={primaryColor} size={40} spinnerWidth={4} />
                  <span style={{ margin: 20 }}>Fetching feed items</span>
                </div>
              ) : !timeline.length && !home.npsComments.length ? (
                <EmptyFeedItem items={3} loading={isFetchingActivityFeed} conversations={conversations} fetchNPSComments={setNPSFilters} isRefreshingFeed={isRefreshingFeed} />
              ) : timeline.map((item) => {
                if (item.type === 'chart') {
                  return (
                    <Survey
                      survey={item}
                      key={item.surveyId}
                      collaborators={collaborators}
                      configurations={configurations}
                      homeActions={homeActions}
                      EventHandler={EventHandler}
                    />
                  );
                }

                if (item.type === 'comment') {
                  return (
                    <Feedback
                      comment={item}
                      collaborators={collaborators}
                      configurations={configurations}
                      homeActions={homeActions}
                      EventHandler={EventHandler}
                      alertActions={alertActions} />
                  );
                }

                if (item.type === 'date') {
                  return (
                    <DateSegemnt
                      date={item}
                      homeActions={homeActions}
                      EventHandler={EventHandler}
                    />
                  );
                }

                // if (item.type === 'activity') {
                //   return (
                //     <Activity item={item} key={item.id} user={this.props.user} collaborators={collaborators} homeActions={homeActions} />
                //   );
                // }
                return null;
              })
            }
          </div>
          <div
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', padding: '10px 0',
            }}
          >
            {
              !home.feedItems.length ? null : !isFetchingFeedComments ? ( // eslint-disable-line no-nested-ternary
                <ActionButton onClick={onLoadMoreActivityFeedItems} primary text="Load More" />
              ) : (
                <div style={{ marginTop: 10 }}>
                  <Spinner spinnerColor={primaryColor} size={30} spinnerWidth={3} />
                </div>
              )
            }
          </div>
        </Col>
        {
          windowDimensions.width >= 768 ? (
            <Col xl={5} lg={5} md={5} sm={12} xs={12} style={{ padding: 0, overflow: 'visible' }}>
              <div
                style={{
                  width: '100%', padding: 10, position: 'sticky', top: 0,
                }}
              >
                {
                  !isIE ? (
                    <ContainerDimensions>
                      {
                        ({ width }) => (
                          <NPSCard
                            width={width}
                            nps={home.nps}
                            setNPSFilters={setNPSFilters}
                            isFetchingNPS={isFetchingNPS}
                            isFetchingHomeFeed={isFetchingHomeFeed}
                            contactedCount={totalContacted}
                            respondedCount={totalResponded}
                            contactedLast30Days={home.contactedLast30Days}
                            onFeedFiltersChanged={onFeedFiltersChanged}
                            contacted={contacted}
                            totalContacted={totalContacted}
                            date={home.contacted.date}
                            isFetchingContacted={isFetchingContacted}
                          />
                        )
                      }
                    </ContainerDimensions>
                  ) : null
                }
                <TrendsToday
                  isFetchingTrendingThemes={isFetchingTrendingThemes}
                  trends={home.trendingThemes}
                  tag={feedFilters.tag}
                  setNPSTag={setNPSTag}
                  clearNPSTag={clearNPSTag}
                />
              </div>
            </Col>
          ) : null
        }
        {/* right side bar end */}
      </Row>
    </Container>
  )
}

export default NPSFeed;
