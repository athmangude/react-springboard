import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import MwambaKeyValueList from 'Utils/mwamba-key-value-list';

const KeyValueListPlaceholder = ({ width }) => (
  <Col xl={4} lg={4} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
    <div style={{ width: '100%', height: 'calc(100% - 20px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 100, height: 25 }} /></div>} />
      </div>
      <MwambaKeyValueList loading rows={8} />
    </div>
  </Col>
);

KeyValueListPlaceholder.propTypes = {
  width: PropTypes.number,
};

export default KeyValueListPlaceholder;
