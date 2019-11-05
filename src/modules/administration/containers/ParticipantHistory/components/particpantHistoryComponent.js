import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';


const participantHistoryComponent = (props) => {
  const { participant } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '15px 5px', margin: '0px 75px', borderBottom: '1px solid #d9d9d9' }}>     
      <div>{participant.survey.title} - <small>{moment(participant.survey.lastActivity).format('hh:mm')}</small></div>
      <div>{participant.status}</div>
    </div>
  );
};

participantHistoryComponent.propTypes = {
  participant: PropTypes.object,
};

export default participantHistoryComponent;
