import React from 'react';
import PropTypes from 'prop-types';

const MwambaErrorMessageList = ({ title, errors }) => (
  <div style={{ width: '100%', boxShadow: '0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent', backgroundColor: '#fff6f6', color: '#9f3a38', padding: '1em 1.5em', lineHeight: '1.4285em', transition: 'opacity .1s ease,color .1s ease,background .1s ease,box-shadow .1s ease,-webkit-box-shadow .1s ease', borderRadius: '.28571429rem', marginTop: 20 }}>
    <div style={{ color: '#912d2b', fontSize: '1.14285714em', display: 'block', fontFamily: 'Lato', fontWeight: 700, margin: '-.14285714em 0 0 0' }}>{title}</div>
    <ul style={{ textAlign: 'left', padding: 0, opacity: 0.85, listStylePosition: 'inside', margin: '.5em 0 0' }}>
      {errors.map((error) => (
        <li key={error.key} style={{ position: 'relative', margin: '0 0 .3em 1em', padding: 0, textAlign: 'left', listStylePosition: 'inside', color: '#9f3a38', fontSize: '1em', lineHeight: '1.4285em' }}>{error.message}</li>
      ))}
    </ul>
  </div>
);

MwambaErrorMessageList.propTypes = {
  title: PropTypes.string,
  errors: PropTypes.array,
};

export default MwambaErrorMessageList;
