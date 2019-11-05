import React from 'react';
import styled from 'styled-components';
import numeral from 'numeral';
import moment from 'moment';

import Avatar from 'Utils/avatar';

import activityLog from './activityLog';

import activityStyles from './activityStyles';
const ActivityWrapper = styled.div`${activityStyles}`;

const Activity = (props) => {
  const customerId = Object.keys(activityLog).find((userId) => userId);
  const customer = activityLog[customerId] || activityLog[Object.keys(activityLog)[0]];

  return (
    <ActivityWrapper>
      {
        customer.activityLog.reverse().map((log) => (
          <div className="log-item">
            <div className="content-container">
              <div className="avatar">
                <Avatar icon={log.icon} />
              </div>
              <div className="content">
                {
                  log.type === 'transaction' ? (
                    <div>
                      {
                        log.branch ? (
                          <span>{`${log.action} KES ${numeral(log.amount).format('0,0.00')} at ${log.branch}`}</span>
                        ) : (
                          <span>{`${log.action} KES ${numeral(log.amount).format('0,0.00')} through ${log.touchpoint}`}</span>
                        )
                      }
                    </div>
                  ) : (
                    <div>
                      {
                        log.branch ? (
                          <span>{`${log.action} at ${log.branch}`}</span>
                        ) : (
                          <span>{`${log.action} through ${log.touchpoint}`}</span>
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="time">
              <i className="material-icons" style={{ fontSize: 15, margin: 0, padding: 0 }}>timelapse</i>&nbsp;
              <span>{moment(log.time).fromNow()}</span>
            </div>
          </div>
        ))
      }
    </ActivityWrapper>
  );
};

export default Activity;
