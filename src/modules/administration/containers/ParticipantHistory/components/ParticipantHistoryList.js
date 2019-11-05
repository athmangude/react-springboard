import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ParticipantHistoryComponent from './particpantHistoryComponent';

const ParticipantHistoryList = (props) => { 
  const { particpantHistoryResult } = props;
  let groupedParticipants = {};
  if (particpantHistoryResult.length) {
    groupedParticipants[moment(particpantHistoryResult[0].survey.lastActivity).format('L')] = [];
  }
  particpantHistoryResult.map((participant) => {
    if (!Object.keys(groupedParticipants).includes(moment(participant.survey.lastActivity).format('L'))) {
      groupedParticipants[moment(participant.survey.lastActivity).format('L')] = [];
      groupedParticipants[moment(participant.survey.lastActivity).format('L')].push(participant);
    } else {
      groupedParticipants[moment(participant.survey.lastActivity).format('L')].push(participant);
    }
    return null;
  });
  return (
    <div style={{ margin: '10px 0px'}}>
      {
        Object.keys(groupedParticipants).sort((a, b) => moment(b) - moment(a)).map((date) => (
          <div>
            <strong>{ date }</strong>
            {
              groupedParticipants[date].sort((a, b) => b.survey.lastActivity - a.survey.lastActivity).map((participant) => (
                <ParticipantHistoryComponent participant={participant} />
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

ParticipantHistoryList.propTypes = {
  particpantHistoryResult: PropTypes.array,
};

export default ParticipantHistoryList;