/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import ActivityEvent from './ActivityEvent';
import ActivityEventPlaceholder from './ActivityEventPlaceholder';

const WorkSpaceActivities = (props) => {
  const { activeConversations, collaborators, isFetchingActiveConversations } = props;
  return (
    <div>
      <div style={{ margin: 0, width: '100%' }}>
        <b style={{ fontSize: 14, color: '#6d6e71' }}>Active Surveys</b>
      </div>
      {
        isFetchingActiveConversations && !(activeConversations.items && activeConversations.items.length) ? (
          <div>
            <div style={{ borderLeft: 'solid 3px #d8d8d8', margin: '20px 0 0 20px', width: 'calc(100% - 20)' }}>
              {
                [1, 2, 3].fill(0).map((item, i) => (
                  <ActivityEventPlaceholder key={i} index={item.id} /> // eslint-disable-line react/no-array-index-key
                ))
              }
            </div>
          </div>
        ) : !(activeConversations.items && activeConversations.items.length) ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
              <span>You have no active surveys</span>
            </div>
            <div style={{ padding: '0px 10px', width: '100%' }}>
              <Link to="/surveys/new" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" style={{ color: '#d9d9d9' }}>chat</i>
                <span style={{ margin: '0 10px', color: '#3d4553' }}>Create Survey</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ borderLeft: 'solid 3px #d8d8d8', margin: '20px 0 0 20px', width: 'calc(100% - 20)' }}>
              {
                activeConversations.items.filter((item) => item !== null).slice(0, 3).map((item, i) => (
                  <ActivityEvent item={item} key={i} index={item.id} createdBy={collaborators.find((collaborator) => collaborator.id === item.userId)} /> // eslint-disable-line react/no-array-index-key
                ))
              }
            </div>
            <div style={{ padding: 15, width: '100%' }}>
              <Link to="/surveys" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" style={{ color: '#d9d9d9' }}>chat</i>
                {
                  activeConversations.items.length - 3 > 0 ? (
                    <span style={{ margin: '0 10px', color: '#3d4553' }}>{`View Surveys (+${activeConversations.items.length - 3})`}</span>
                  ) : (
                    <span style={{ margin: '0 10px', color: '#3d4553' }}>View Surveys</span>
                  )
                }
              </Link>
            </div>
          </div>
        )
      }
      <Divider />
    </div>
  );
};

WorkSpaceActivities.propTypes = {
  activeConversations: PropTypes.object.isRequired,
  collaborators: PropTypes.object.isRequired,
  isFetchingActiveConversations: PropTypes.bool.isRequired,
};

export default WorkSpaceActivities;
