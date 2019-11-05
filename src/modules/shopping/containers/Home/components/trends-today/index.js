/* eslint-disable no-nested-ternary, no-mixed-operators, jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';
import styled from 'styled-components';

import TrendsPlaceholder from './TrendsPlaceholder';
import IconButton from 'SharedComponents/icon-button';

import styles from './style.css';

const TrendsTodayWrapper = styled.div`${styles}`;

const TrendsToday = (props) => {
  const { trends, isFetchingTrendingThemes } = props;
  const trendingThemes = [];
  if (trends) {
    Object.keys(props.trends).forEach((theme) => {
      trendingThemes.push({
        title: theme,
        value: props.trends[theme],
      });
    });
  }

  return (
    <TrendsTodayWrapper className="trends-today" style={{ width: '100%' }}>
      <div style={{ margin: 0, width: '100%' }}>
        <b style={{ fontSize: 14, color: '#6d6e71' }}>
          Trending Themes&nbsp;
          <small>(Last 30 days)</small>
        </b>
      </div>
      {
        isFetchingTrendingThemes ? (
          <div
            style={{
              margin: 10, width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            }}
          >
            <TrendsPlaceholder count={Math.floor(Math.random() * ((12 - 5) + 1) + 5)} size="large" />
          </div>
        ) : !trendingThemes.length ? (
          <div
            style={{
              margin: 10, width: 'calc(100% - 20px)', padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap',
            }}
          >
            <span style={{ color: '#808285' }}>We could not get any trending themes based on your industry</span>
          </div>
        ) : (
          <div
            style={{
              margin: 10, width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            }}
          >
            {
              trendingThemes.sort((a, b) => b.value - a.value).map((item, i) => (
                <button
                  type="button"
                  className="trends-tag"
                  onClick={() => { if (item.title !== props.tag) { props.setNPSTag(item.title); } }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexDirection: 'row', padding: '3px 10px', boxShadow: item.title === props.tag ? '0 0 10px rgba(0, 0, 0, 0.4)' : '0 0 0 rgba(0, 0, 0, 0)', transform: item.title === props.tag ? 'scale(1.1)' : 'scale(1)', backgroundColor: item.title === props.tag ? 'rgba(32, 171, 156, 1)' : `rgba(32, 171, 156, ${0.5 + (((trendingThemes.length - i) / trendingThemes.length) * 0.5)})`, color: '#FFF', margin: item.title === props.tag ? '3px 8px' : 3, borderRadius: 20, outline: 'none',
                  }}
                >
                  <div style={{ textTransform: 'capitalize' }}>
                    {item.title}
                    &nbsp;
                    <span>
                      {`(${item.value})`}
                    </span>
                    &nbsp;
                  </div>
                  {
                    item.title === props.tag ? (
                      <IconButton
                        icon="remove"
                        style={{
                          margin: '0 -6px 0 5px', padding: 0, width: 20, height: 20, backgroundColor: '#fff',
                        }}
                        onClick={props.clearNPSTag}
                      />
                    ) : null
                  }
                </button>
              ))
            }
          </div>
        )
      }
      <Divider />
    </TrendsTodayWrapper>
  );
};

TrendsToday.propTypes = {
  trends: PropTypes.array.isRequired,
  isFetchingTrendingThemes: PropTypes.bool.isRequired,
  clearNPSTag: PropTypes.func.isRequired,
  setNPSTag: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
};

export default TrendsToday;
