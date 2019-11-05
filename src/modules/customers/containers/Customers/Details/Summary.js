import React from 'react';
import PropTypes from 'prop-types';

const Summary = ({ customer, customerSchema, width }) => (
  <div style={{ width: '100%', minHeight: 60, backgroundColor: '#f2f5f7', marginBottom: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
    {
      width > 425 ? (
        <div style={{ width: 70, height: 60, borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <i className="material-icons" style={{ color: '#6d6e71', fontSize: 45 }}>person</i>
        </div>
      ) : null
    }
    <div style={{ width: width > 425 ? 'calc(100% - 70px)' : '100%', minHeight: 60, display: 'flex', flexDirection: width > 425 ? 'row' : 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      {
        Object.keys(customerSchema).map((key) => {
          let value = customerSchema[key].map((property) => customer[property]).join(' ');
          value = value === 'null' || value === null ? 'N|A' : value;
          return (
            <div key={key.replace(' ', '-')} style={{ width: '100%', height: 60, borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#6d6e71' }}>
              <div>{key}</div>
              <div style={{ fontWeight: 900 }}>{value}</div>
            </div>
          );
        })
      }
    </div>
  </div>
);

Summary.propTypes = {
  customer: PropTypes.object,
  customerSchema: PropTypes.object,
  width: PropTypes.number,
};

export default Summary;
