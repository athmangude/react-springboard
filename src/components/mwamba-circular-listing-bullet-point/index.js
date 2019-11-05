import React from 'react';
import PropType from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RoundShape } from 'react-placeholder/lib/placeholders';

const MwambaCircularListingBulletPoint = ({ loading }) => {
  if (loading) {
    return (
      <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: 10, height: 10, borderRadius: 5, marginRight: 10 }}><RoundShape color="#d9d9d9" style={{ width: 10, height: 10 }} /></div>} />
    );
  }

  return (
    <div style={{ width: 10, height: 10, borderRadius: 5, backgroundImage: 'linear-gradient(154deg, #2574a6, #c86dd7)', marginRight: 10 }} />
  );
};

MwambaCircularListingBulletPoint.propTypes = {
  loading: PropType.bool,
};

export default MwambaCircularListingBulletPoint;
