/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import PropTypes from 'prop-types';

const EmptyConversationsList = ({ items, isLoading }) => {
  const itemsList = new Array(items).fill(0);
  return (
    <div style={{ width: '100%', padding: '0 10px' }}>
      {
        itemsList.map((item) => (
          <div style={{ width: '100%', borderRadius: 8 }} key={`loading-placeholder-${item}`}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
              <ReactPlaceholder
                showLoadingAnimation={isLoading}
                customPlaceholder={(
                  <div style={{ backgroundColor: '#FFF', padding: 10, width: '100%', margin: '50px 5px 30px' }}>
                    <RectShape color="#efefef" style={{ height: 35, width: '100%', borderRadius: 0, margin: '0' }} />
                    <RectShape color="#efefef" style={{ height: 35, width: '100%', borderRadius: 0, margin: '10px 0 0' }} />
                  </div>
                )}
              />
            </div>
          </div>
        ))
      }
    </div>
  );
};

EmptyConversationsList.propTypes = {
  items: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default EmptyConversationsList;
