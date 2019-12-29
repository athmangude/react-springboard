import React from 'react';
import moment from 'moment';

const Activity = (props) => {
  const { item, user } = props;
  const actor = props.collaborators.find((collaborators) => collaborators.id === item.userId);
  const firstInitial = actor.firstName.length ? actor.firstName[0].toUpperCase() : '';
  const lastInitial = actor.lastName.length ? actor.lastName[0].toUpperCase() : '';
  const payLoad = JSON.parse(item.payload);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ backgroundColor: '#fafafa', padding: 10, display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: 60, diplay: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 10px 10px', alignSelf: 'start' }}>
          <div style={{ width: 50, height: 50, backgroundColor: '#d9d9d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{`${firstInitial}${lastInitial}`}</span>
          </div>
        </div>
        <div style={{ width: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
          <span><b>{`${actor.firstName} ${actor.lastName}`}</b></span>
          <span style={{ color: '#808285', fontSize: 10 }}>{`${item.uiSortDate.format('MMM. Do, YYYY | hh:mm a')}`}</span>
          <p>{payLoad.details}</p>
        </div>
      </div>
    </div>
  );
}

export default Activity;
