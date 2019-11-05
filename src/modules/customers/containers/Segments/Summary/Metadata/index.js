/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import Item from './Item';

const Metadata = ({ isLoading, metadata }) => {
  if (isLoading) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />

        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />


        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
      {
        Object.keys(metadata).map((type) => (
          <Item metadata={metadata[type]} key={type} name={type} />
        ))
      }
    </div>
  );
};

Metadata.propTypes = {
  metadata: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default Metadata;
