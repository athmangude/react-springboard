/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Heading from './message-types/Heading';
import Body from './message-types/Body';
import UnorderedList from './message-types/UnorderedList';

import styles from './Message.css';

const MessageWrapper = styled.div`${styles}`;

const Message = ({ message, type }) => {

  return (
    <MessageWrapper>
      {
        type === 'heading' ? (
          <Heading message={message} />
        ) : type === 'body' ? (
          <Body message={message} />
        ) : type === 'unorderedList' ? (
          <UnorderedList message={message} />
        ) : null
      }
    </MessageWrapper>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default Message;
