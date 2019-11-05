import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SvgIcon from '@material-ui/core/SvgIcon';

import styles from './FeedItem.css';

const FeedItemWrapper = styled.div`${styles}`;

const FeedItem = ({ item }) => {
  function getSentimentIcon(Sentiment) {
    if (Sentiment === "positive") {
      return {
        d: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23M15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11Z",
        fill: "green",
        backgroundColor: '#d9d9d9',
      }
    }

    if (Sentiment === "neutral") {
      return {
        d: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11A1.5,1.5 0 0,1 7,9.5M16,16H8V14H16V16M15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11Z",
        fill: "yellow",
        backgroundColor: '#8c8a8a',
      }
    }

    if (Sentiment === "negative") {
      return {
        d: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,17.23L7.81,15.81C8.71,14.72 10.25,14 12,14C13.75,14 15.29,14.72 16.19,15.81L14.77,17.23M15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11Z",
        fill: "red",
        backgroundColor: '#d9d9d9',
      }
    }

    return {
      d: "M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",
      fill: "gray",
      backgroundColor: '#000',
    }
  }

  function getSourceIcon(fields) {
    const { SearchType, Source } = fields;

    if (SearchType === 'social') {
      if (Source === 'twitter') {
        return {
          d: "M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z",
          fill: "#00aced",
          prefix: "@",
        }
      }
    }

    if (SearchType === 'news') {
      return {
        d: "M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z",
        fill: "#24292e",
        prefix: "",
      }
    }

    return {
      d: "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
      fill: "#000",
      prefix: "",
    }
  }

  function onGoToLink(URL) {
    window.open(URL, '_blank');
  }

  const { fields } = item;
  const { Sentiment, SearchType, Source, URL } = fields;

  const { d, fill, prefix } = getSourceIcon(fields);
  const sentimentIcon = getSentimentIcon(Sentiment);
  return (
    <FeedItemWrapper>
      <div className="header">
        <div className="source">
          <div className="profile-timestamp">
            <b className="name">{`${prefix}${fields.Username}`}</b>
            <small><b>{moment(fields.Timestamp).local().fromNow()}</b><span>&nbsp;On&nbsp;{moment(fields.Timestamp).format('DD MMM, YYYY – hh:mm a')}</span></small>
          </div>
        </div>
        <div className="sentiment">
          {
            Sentiment ? (
              <SvgIcon className="icon" style={{ backgroundColor: sentimentIcon.backgroundColor }}>
                <path
                  d={sentimentIcon.d}
                  fill={sentimentIcon.fill}
                />
              </SvgIcon>
            ) : null
          }
        </div>
      </div>
      <div className="body">
        {fields.Message}
      </div>
      <div className="footer">
        <div className="indicator">
          <SvgIcon className="icon">
            <path
              d={d}
              fill={fill}
            />
          </SvgIcon>
        </div>
        <div className="publication">
          <span>{Source.replace(/[_-]/g, " ")}</span>
        </div>
        <button className="link circular" onClick={() => onGoToLink(URL)}>
          <SvgIcon className="icon smaller">
            <path
              d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
              fill="#818181"
            />
          </SvgIcon>
        </button>
      </div>
    </FeedItemWrapper>
  )
}

export default FeedItem;
