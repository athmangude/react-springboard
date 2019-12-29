import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import infoCardStyles from './infoCardStyles';

const InfoCardWrapper = styled.div`${infoCardStyles}`;

const InfoCard = ({ schema, data, title }) => (
  <InfoCardWrapper>
    <div className="title">
      {title}
    </div>
    <div className="content">
      {
        Object.keys(schema).map((schemaItem) => {
          const value = schema[schemaItem].map((item) => data[item]).join(', ');
          return (
            <div className="item">
              <span style={{ fontWeight: 'bold', fontSize: 12 }}>{schemaItem}</span>
              <span style={{ textTransform: 'capitalize' }}>{!value || value === '' || value === ' ' || value === 'null' ? 'N/A' : value}</span>
            </div>
          );
        })
      }
    </div>
  </InfoCardWrapper>
);

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
};

export default InfoCard;
