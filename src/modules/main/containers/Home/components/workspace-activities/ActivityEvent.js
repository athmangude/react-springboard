/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Hashids from 'hashids';
import './ActivityEvent.css';

const encodeSurveyId = (surveyId) => {
  const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
  return hashids.encode(surveyId);
};

const ActivityEvent = (props) => {
  let ringColor;
  const { index } = props;
  switch ((index + 1) % 3) {
    case 0:
      // ringColor = '#ffac28';
      ringColor = '#4a4f57';
      break;
    case 1:
      // ringColor = '#20ab9c';
      ringColor = '#4a4f57';
      break;
    case 2:
      // ringColor = '#f26b50';
      ringColor = '#4a4f57';
      break;
    default:
      // ringColor = '#ffac28';
      ringColor = '#4a4f57';
  }

  const { item, createdBy } = props;
  const responseRate = item.metrics.contacted === 0 ? 0 : (item.metrics.responded / item.metrics.contacted * 100).toFixed(0);

  return (
    <div
      className="activity-event"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginLeft: -11, backgroundColor: 'transparent', width: '100%',
      }}
    >
      <div
        style={{
          height: 20, width: 20, borderRadius: 10, border: `solid 2px ${ringColor}`, backgroundColor: '#f9fafc',
        }}
      />
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 'calc(100% - 20px)',
        }}
      >
        <div
          style={{
            display: 'flex', flexDirection: 'column', padding: 10, width: '20%',
          }}
        >
          <span style={{ color: '#808285', fontSize: 10 }}>Created</span>
          <span style={{ color: '#3d4553', fontSize: 10 }}>{moment(item.createDate).format('DD MMM YYYY')}</span>
        </div>
        <div
          style={{
            display: 'flex', flexDirection: 'column', padding: 10, width: '90%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20, marginTop: 3 }}>message</i>
            <Link className="link" to={`/surveys/${encodeSurveyId(item.id)}/report/${item.objective.toLowerCase()}`}><span style={{ fontSize: 12, fontWeight: 'bold', margin: '0 3px' }}>{item.title}</span></Link>
          </div>
          <div>
            <span style={{ color: '#808285', fontSize: 11 }}>
Created by:
              {createdBy ? `${createdBy.firstName} ${createdBy.lastName}` : 'Account collaborator' }
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 5, width: '10%',
          }}
        >
          <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20 }}>timelapse</i>
          <span style={{ color: '#808285', fontSize: 10 }}>
            {responseRate}
%
          </span>
        </div>
      </div>
    </div>
  );
};

ActivityEvent.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  createdBy: PropTypes.object.isRequired,
};

export default ActivityEvent;
