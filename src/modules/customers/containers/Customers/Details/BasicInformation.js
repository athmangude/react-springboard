import React from 'react';
import propTypes from 'prop-types';

function chunk(array, chunkSize) {
  const temporal = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temporal.push(array.slice(i, i + chunkSize));
  }
  return temporal;
}

const BasicInformation = ({ customer, customerSchema }) => {
  const rows = chunk(Object.keys(customerSchema), 2);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 20 }}>
      <div style={{ width: '100%', height: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#6d6e71' }}>Customer Details</div>
        {/* <div style={{ textTransform: 'uppercase', fontSize: 11, color: '#2574a6', cursor: 'pointer' }}>Update Customer Details</div> */}
      </div>
      {
        rows.map((columns) => (
          <div key={columns.join('-')} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #ffffff', marginBottom: 1, height: 60 }}>
            {
              columns.map((column) => {
                let value = customerSchema[column].map((property) => customer[property]).join(' ');
                value = value === 'null' || value === null ? 'N|A' : value;
                return (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <div key={column.replace(' ', '-')} style={{ width: '100%', height: 60, borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, backgroundColor: '#f2f5f7', color: '#6d6e71' }}>
                      <div>{column}</div>
                    </div>
                    <div style={{ width: '100%', height: 60, borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, backgroundColor: '#f6f7f9', color: '#6d6e71' }}>
                      <div>{value}</div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        ))
      }
    </div>
  );
};

BasicInformation.propTypes = {
  customer: propTypes.object,
  customerSchema: propTypes.object,
};

export default BasicInformation;
