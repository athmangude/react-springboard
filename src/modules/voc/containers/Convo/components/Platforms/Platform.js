import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { Popup } from 'semantic-ui-react';

const Platform = ({ activePlatformId, platform: { id, mdi, name, disabled }, clickPlatformHandler }) => (
  <div
    role="button"
    tabIndex={0}
    disabled={disabled}
    style={{ cursor: 'pointer', borderBottom: activePlatformId === id ? '1px solid #ffffff' : 'none', paddingBottom: 10 }}
    onClick={() => {
      if (activePlatformId === id || disabled) return null;
      return clickPlatformHandler(id);
    }}
  >
    <Popup
      trigger={
        <Icon
          path={mdi}
          size={1.2}
          horizontal
          vertical
          color={activePlatformId === id ? '#ffffff' : '#cfe4f2'}
        />
      }
      content={<span>{name}</span>}
      basic
      inverted
      hoverable
      style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
    />
  </div>
);

Platform.propTypes = {
  platform: PropTypes.object,
  activePlatformId: PropTypes.number,
  clickPlatformHandler: PropTypes.func,
};

export default Platform;
