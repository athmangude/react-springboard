/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

import Title from '../../components/Title';
import WordCloud from '../../components/WordCloud';

// const data = {
//   william: 80,
//   ronnie: 10,
//   athman: 40,
//   george: 16,
//   ian: 40,
//   vivian: 60,
//   peggy: 90,
//   gina: 150,
//   thomas: 35,
//   lionel: 60,
//   monicah: 50,
//   andrew: 70,
//   louis: 10,
//   tony: 145,
// };

const WordCloudMentions = ({ colors, data, isLoading, height, width }) => (
  <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
    <Title title="Themes Mentions Word Cloud" subtitle="What are my customers talking about?" />
    {
      isLoading ? (
        <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'center', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
        </div>
      ) : Object.keys(data).length ? (
        <WordCloud data={data} colors={colors} width={width} height={height} />
      ) : (
        <div style={{ backgroundColor: '#FFF', width: '100%', position: 'relative', textAlign: 'center', marginBottom: 20, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          No themes to display.
        </div>
      )
    }
  </div>
);

WordCloudMentions.propTypes = {
  colors: PropTypes.array,
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default WordCloudMentions;
