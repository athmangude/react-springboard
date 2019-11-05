import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';

const NPSDimensionPillPlaceholder = (props) => {
  return (
    <ReactPlaceholder
      showLoadingAnimation
      customPlaceholder={(
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {
            new Array(props.count).fill(0).map((item, i) => (
              <RectShape key={i} color="#d9d9d9" style={{ height: 30, width: 100,  borderRadius: 15, margin: '3px 5px', ...props.size === "large" ? { height: 50, width: 150, borderRadius: 25 } : {} }} />
            ))
          }
        </div>
      )}
    />
  )
}

export default NPSDimensionPillPlaceholder;
