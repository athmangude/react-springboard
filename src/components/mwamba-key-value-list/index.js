import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import numeral from 'numeral';

import MwambaCircularListingBulletPoint from '../mwamba-circular-listing-bullet-point';

const MwambaKeyValueList = ({ list, loading, rows = 8 }) => {
  if (loading) {
    return (
      <div style={{ width: '100%', fontSize: 12, lineHeight: 2.92, color: '#6d6e71' }}>
        {
          Array.from(new Array(rows), (val, index) => index + 1).map((item) => (
            <div key={item} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid 1px #d9d9d9' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MwambaCircularListingBulletPoint loading />
                <div>
                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 20, marginBottom: 5, marginTop: 5 }} /></div>} />
                </div>
              </div>
              <div>
                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 40, height: 20, marginBottom: 5, marginTop: 5 }} /></div>} />
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  if (!list || !list.length) {
    return (
      <div style={{ width: '100%', fontSize: 12, lineHeight: 2.92, color: '#6d6e71', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <div>No data to display</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', fontSize: 12, lineHeight: 2.92, color: '#6d6e71' }}>
      {
        list.map((item) => (
          <div key={item.key} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'solid 1px #d9d9d9' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <MwambaCircularListingBulletPoint />
              <div style={{ textTransform: 'capitalize' }}>{item.key}</div>
            </div>
            <div>
              {isNaN(item.value) ? item.value : numeral(item.value).format('0,0')}
            </div>
          </div>
        ))
      }
    </div>
  );
};

MwambaKeyValueList.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  rows: PropTypes.number,
};

export default MwambaKeyValueList;
