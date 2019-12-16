/* eslint-disable no-nested-ternary */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const Comment = (props) => {
  const {
    comment, comments, showCommentBox, collaborators, i,
  } = props;

  let iconText;
  let actorName;

  if (!Object.keys(comment).includes('originatedFrom')) {
    const actor = collaborators.find((collaborator) => collaborator.id === comment.userId);
    const firstInitial = actor.firstName.length ? actor.firstName[0].toUpperCase() : '';
    const lastInitial = actor.lastName.length ? actor.lastName[0].toUpperCase() : '';
    iconText = `${firstInitial}${lastInitial}`;
    actorName = `${actor.firstName} ${actor.lastName}`;
  } else if (!comment.originatedFrom || comment.originatedFrom.toLowerCase() === 'user') {
    const actor = collaborators.find((collaborator) => collaborator.id === comment.user);
    const firstInitial = actor.firstName.length ? actor.firstName[0].toUpperCase() : '';
    const lastInitial = actor.lastName.length ? actor.lastName[0].toUpperCase() : '';
    iconText = `${firstInitial}${lastInitial}`;
    actorName = `${actor.firstName} ${actor.lastName}`;
  } else {
    iconText = comment.participant.substring(10, 13);
    actorName = comment.participant;
  }

  return (
    <div
      style={{
        backgroundColor: '#fafafa', width: '100%', padding: 5, borderTop: 'solid 1px #d9d9d9', borderLeft: '1px solid rgb(217, 217, 217)', display: 'flex', flexDirection: 'row', borderBottomRightRadius: (i + 1 === props.comments.length && !showCommentBox) ? 8 : 0, borderBottomLeftRadius: (i + 1 === comments.length && !showCommentBox) ? 8 : 0,
      }}
    >
      <div
        style={{
          width: 50, diplay: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 10px 10px', alignSelf: 'start',
        }}
      >
        <div
          style={{
            width: 40, height: 40, backgroundColor: !Object.keys(comment).includes('originatedFrom') ? '#d9d9d9' : comment.originatedFrom.toLowerCase() === 'user' ? '#d9d9d9' : '#4a4f57', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: 15 }}>{iconText}</span>
        </div>
      </div>
      <div
        style={{
          width: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 'bold' }}>{actorName}</span>
        <span style={{ color: '#808285', fontSize: 10 }}>{moment(comment.createDate).format('MMM. Do YYYY | hh:mm a')}</span>
        <p style={{ fontSize: 11 }}>{unescape(comment.message.replace(/(\+)/g, ' '))}</p>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  showCommentBox: PropTypes.bool.isRequired,
  collaborators: PropTypes.array.isRequired,
  i: PropTypes.number.isRequired,
};

export default Comment;
