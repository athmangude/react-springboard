/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

const Comment = ({ response, i, checkQuestionType }) => {
  const possibleLocationMetadata = ['location', 'branch', 'store', 'store2'];
  let locationKey = null; // Default
  Object.keys(response.metadata).forEach((key) => {
    const lowerCasedKey = key.toLocaleLowerCase();
    if (key !== lowerCasedKey) {
      // It's easier to convert the keys to lowercase as opposed to checcking for whether their exists a property in either uppercase or lowercase
      response.metadata[lowerCasedKey] = response.metadata[key];
    }
    if (possibleLocationMetadata.includes(lowerCasedKey)) {
      locationKey = lowerCasedKey;
      return;
    }
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', margin: '5px 5px', backgroundColor: '#FFF', border: 'solid 1px #d9d9d9', padding: '0px 10px', minHeight: 60, maxHeight: 100, borderRadius: 30 }}>
      {
        response.score !== null && checkQuestionType !== 'OPEN_ENDED_INTEGER'? (
          <div style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: response.score > 8 ? '#80c582' : response.score > 6 ? '#fcda6e' : '#fd9681', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', position: 'relative', top: 15 }}>
            <span style={{ color: '#fff', fontWeight: 'bold', width: 30, textAlign: 'center' }}>{response.score}</span>
          </div>
        ) : (
          <div style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: '#ffac28', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="material-icons" style={{ color: '#FFF', fontSize: 23 }}>person_outline</i>
          </div>
        )
      }
      <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', flexDirection: 'column', color: '#3d4553' }}>
          {
            Object.keys(response.metadata).includes('first_name') ? (
              <span>
                <b style={{ textTransform: 'capitalize' }}>
                  {response.metadata.first_name}
                  &nbsp;
                  {response.metadata.last_name}
                </b>
                &nbsp;<span style={{ fontSize: 11 }}></span>
              </span>
            ) : (
              <b></b>
            )
          }
          {
            locationKey ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', position: 'relative', left: -3, margin: '-4px 0 0 0' }}>
                <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 15, position: 'relative', top: 1 }}>location_on</i>
                <span style={{ color: '#3d4553', textTransform: 'capitalize', fontSize: 11 }}>{response.metadata[locationKey]}</span>
              </div>
            ) : null
          }
        </div>
        <small>{response.response}</small>
      </div>
      {
        Object.keys(response.metadata).includes('amount') ? (
          <div style={{ height: 30, width: 60, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', position: 'relative', top: 15 }}>
            <span style={{ color: '#6d6e71', fontWeight: 'bold' }}>{numeral(response.metadata.amount).format('0,0.00')}</span>
          </div>
        ) : null
      }
    </div>
  );
};

Comment.propTypes = {
  response: PropTypes.object,
  i: PropTypes.number,
};

export default Comment;
