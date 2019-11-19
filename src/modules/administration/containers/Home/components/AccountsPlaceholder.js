/* eslint-disable no-mixed-operators */

import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

const AccountsPlaceholder = (props) => (
  <div style={{ width: '100%' }}>
    <ReactPlaceholder
      showLoadingAnimation
      customPlaceholder={(
        <div style={{ width: '100%' }}>
          {
            new Array(props.items).fill(0).map(() => (
              <div style={{ width: '100%', height: 61, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', borderBottom: 'solid 1px #d9d9d9', padding: '0 20px', zIndex: 0 }}>
                <RoundShape style={{ width: 40, height: 40 }} color="#d9d9d9" />
                <RectShape style={{ height: 25, width: Math.floor(Math.random() * (300 - 20 + 1) + 20), margin: '0 20px' }} color="#d9d9d9" />
              </div>
            ))
          }
        </div>
        )}
    />
  </div>
);

AccountsPlaceholder.propTypes = {
  items: PropTypes.number.isRequired,
};

export default AccountsPlaceholder;
