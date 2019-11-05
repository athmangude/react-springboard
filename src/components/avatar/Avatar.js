import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extractInitials } from '../UtilFunctions';

import avatarStyles from './avatarStyles';

const AvatarWrapper = styled.div`${avatarStyles}`;

const Avatar = (props) => (
  <AvatarWrapper {...props}>
    {
      (props.icon) ? (
        <i className="material-icons" style={{ fontSize: 15, margin: 0, padding: 0 }}>{props.icon}</i>
      ) : (
        <span>
          {extractInitials(props.name)}
        </span>
      )
    }
  </AvatarWrapper>
);

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Avatar;
