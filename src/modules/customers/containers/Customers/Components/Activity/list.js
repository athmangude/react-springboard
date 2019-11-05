/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import numeral from 'numeral';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import ActivityStyles from './styles';

const ActivityWrapper = styled.div`${ActivityStyles}`;

const List = ({ activities, selectedActivity, loading, onSelectActivity, currency }) => (
  <div className="hide-scrollbars" style={{ flex: 1, overflowY: 'scroll', paddingLeft: 5 }}>
    {
      loading ? (
        [1, 2, 3, 4, 5].map(() => (
          <ActivityWrapper>
            <div
              className="activity-event activity-list"
            >
              <div className="timeline-line" />
              <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ zIndex: 1 }}><RoundShape color="#d9d9d9" style={{ height: 40, width: 40 }} /></div>} />
              <div className="timeline-list-container">
                <div className="timeline-date-container">
                  <ReactPlaceholder
                    showLoadingAnimation
                    customPlaceholder={(
                      <div style={{ width: '100%', marginBottom: 5 }}>
                        <RectShape color="#d9d9d9" style={{ height: 15, marginBottom: 5, width: 50 }} />
                        <RectShape color="#d9d9d9" style={{ height: 15, width: 50 }} />
                      </div>
                    )}
                  />
                </div>
                <div className="activity">
                  <ReactPlaceholder
                    showLoadingAnimation
                    customPlaceholder={(
                      <div style={{ width: '100%', marginBottom: 5 }}>
                        <RectShape color="#d9d9d9" style={{ height: 25, width: '100%' }} />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </ActivityWrapper>
        ))
      ) : (
          activities.map((activity) => (
            <ActivityWrapper activity={activity} selectedActivity={selectedActivity}>
                <div
                  className="activity-event activity-list"
                  onClick={() => onSelectActivity(activity)}
                >
                  <div className="timeline-line" />
                  <div className="timeline-icon-container">
                    <i className="material-icons timeline-icon">credit_card</i>
                  </div>
                  <div className="timeline-list-container">
                    <div className="timeline-date-container">
                      <span className="timeline-date">{moment(activity.transactionDate).format('H:mm A')}</span>
                      <span className="timeline-date">{moment(activity.transactionDate).format('DD MMM YYYY')}</span>
                    </div>
                    <div className="activity">
                      <span className="activity-text ">
                        {'Transacted'}
                        &nbsp;
                        {currency}
                        &nbsp;
                        {numeral(activity.amountSpent).format('0,0')}
                        &nbsp;
                        {'at'}
                        &nbsp;
                        {activity.location}
                      </span>
                    </div>
                  </div>
                </div>
            </ActivityWrapper>        
          ))
      )
    }
  </div>
);

List.propTypes = {
  activity: PropTypes.object,
  selectedActivity: PropTypes.object,
  loading: PropTypes.bool,
  onSelectActivity: PropTypes.func,
  currency: PropTypes.string,
};


export default List;
