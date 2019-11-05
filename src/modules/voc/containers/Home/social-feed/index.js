import React from 'react';
import styled from 'styled-components';
import FeedItem from './FeedItem';

import styles from './index.css';

const SocialFeedWrapper = styled.div`${styles}`;

const SocialFeed = ({ socialItems, dateFilters, homeActions }) => {
  return (
    <SocialFeedWrapper>
      {
        socialItems.items.map((item) => (
          <FeedItem item={item} key={item.id} />
        ))
      }
    </SocialFeedWrapper>
  );
}

export default SocialFeed;
