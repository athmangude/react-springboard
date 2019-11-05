import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import { mdiCommentOutline, mdiFacebookMessenger, mdiFacebook, mdiTwitter, mdiLinkedin } from '@mdi/js';

import Platform from './Platform';

const platforms = [
  { mdi: mdiCommentOutline, id: 1, name: 'SMS', disabled: false },
  { mdi: mdiFacebookMessenger, id: 2, name: 'Messenger', disabled: true },
  { mdi: mdiFacebook, id: 3, name: 'Facebook', disabled: true },
  { mdi: mdiTwitter, id: 4, name: 'Twitter', disabled: true },
  { mdi: mdiLinkedin, id: 5, name: 'LinkedIn', disabled: true },
];

const Platforms = (props) => {
  const { activePlatformId, clickPlatformHandler, loading } = props;

  return (
    loading ? (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 10px 20px' }}>
        {
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <ReactPlaceholder
                showLoadingAnimation
                customPlaceholder={
                  <div style={{ width: 30 }}>
                    <RectShape color="#d9d9d9" style={{ width: 30, height: 30, paddingBottom: 10 }} />
                  </div>
                }
              />
            </div>
          ))
        }
      </div>
    ) : (
      <div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 10px 20px' }}>
          {
            platforms.map((platform) => (
              <Platform
                platform={platform}
                activePlatformId={activePlatformId}
                clickPlatformHandler={clickPlatformHandler}
                key={`platform-${platform.id}`}
              />
            ))
          }
        </div>
      </div>
    )
  );
};

Platforms.propTypes = {
  loading: PropTypes.bool,
  activePlatformId: PropTypes.number,
  clickPlatformHandler: PropTypes.func,
};

export default Platforms;
