/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import backgroundImage from 'Modules/voc/containers/Conversations/components/empty_list_background.png';

const NoResults = ({ question }) => (
  <div style={{ width: '100%', borderRadius: 8 }}>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ width: '100%' }}>
          <b style={{ color: '#3d4553' }}>{question.questionText}</b>
        </div>
      </div>
      <div style={{ padding: 0, margin: '10px auto', backgroundImage: `url(${backgroundImage})`, height: 150, backgroundSize: 'cover', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <b style={{ color: '#3d4553' }}>There are no results for this question...yet!</b>
      </div>
    </div>
  </div>
);

NoResults.propTypes = {
  question: PropTypes.object.isRequired,
};

export default NoResults;
