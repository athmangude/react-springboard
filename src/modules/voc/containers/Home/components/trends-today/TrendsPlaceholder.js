/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';

const TrendsPlaceholder = (props) => (
  <ReactPlaceholder
    showLoadingAnimation
    customPlaceholder={(
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        {
            new Array(props.count).fill(0).map((item, i) => (
              <RectShape key={i} color="#d9d9d9" style={{ height: 24, width: Math.floor(Math.random() * ((150 - 70) + 1) + 70), borderRadius: 12, margin: '3px 5px' }} />
            ))
          }
      </div>
      )}
  />
);

TrendsPlaceholder.propTypes = {
  count: PropTypes.number.isRequired,
};

export default TrendsPlaceholder;
