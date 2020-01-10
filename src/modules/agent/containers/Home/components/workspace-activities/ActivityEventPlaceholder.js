import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';

const ActivityEventPlaceholder = () => (
  <ReactPlaceholder
    showLoadingAnimation
    customPlaceholder={(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginLeft: -11, backgroundColor: 'transparent', width: '100%' }}>
        <div style={{ height: 20, width: 20, borderRadius: 10, border: 'solid 2px #d9d9d9', backgroundColor: '#f9fafc' }} />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 'calc(100% - 20px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: 10, width: '20%' }}>
            <RectShape color="#efefef" style={{ height: 9, width: '100%', borderRadius: 0, margin: '2px 0' }} />
            <RectShape color="#efefef" style={{ height: 9, width: '100%', borderRadius: 0, margin: '2px 0' }} />
            <RectShape color="#efefef" style={{ height: 9, width: '100%', borderRadius: 0, margin: '2px 0' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: 10, width: '90%' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20, marginTop: 3 }}>message</i>
              <RectShape color="#efefef" style={{ height: 11, width: '100%', borderRadius: 0, margin: '4px 5px 0px' }} />
            </div>
            <RectShape color="#efefef" style={{ height: 9, width: '100%', borderRadius: 0, margin: '4px 5px 0px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 5, width: '10%' }}>
            <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20 }}>timelapse</i>
            <RectShape color="#efefef" style={{ height: 9, width: '100%', borderRadius: 0, margin: '2px 0' }} />
          </div>
        </div>
      </div>
    )}
  />
);

export default ActivityEventPlaceholder;
