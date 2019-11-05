import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const EndIssuePresenter = ({ issues, messageId }) => {
  if (!issues || !issues.length) return null;

  const timelineIssues = issues.filter((issue) => issue.endChatActivityId === messageId);

  return (
    <div>
      {timelineIssues.map((issue) => (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: 25, backgroundColor: '#d9d9d9', marginBottom: '8px 0' }} key={`end-issue-${issue.id}`}>
          <span style={{ fontFamily: 'Lato', fontSize: 11, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#808285' }}>
            Issue Resolved: {moment.utc(issue.createdAt).format('dddd, Do MMM YYYY h:mm:ss a')}
          </span>
        </div>
    ))}
    </div>
  );
};

EndIssuePresenter.propTypes = {
  issues: PropTypes.array,
  messageId: PropTypes.number,
};

export default EndIssuePresenter;
