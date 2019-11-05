import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';

const Payments = ({ payments, width }) => (
  <Col xl={3} lg={3} md={3} sm={12} xs={12} style={{ padding: '0 10px 0 10px', backgroundColor: 'inherit' }}>
    <div style={{ width: '100%', minHeight: 370, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10, minHeight: 'calc(100% - 20px)' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#6d6e71', width: '100%', padding: '10px 0 20px 0' }}>Payments <span style={{ fontSize: 12, fontWeight: 'normal' }}>in KES</span></div>
      <div style={{ width: '100%', backgroundImage: 'linear-gradient(to bottom, #2574a6, #c86dd7)' }}>
        {
          payments.map((payment) => (
            <div key={payment.key} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff', borderBottom: '2px solid #ffffff', fontSize: 11, lineHeight: 4.73, padding: width > 425 ? '0 10px 0 10px' : '0 20px 0 20px' }}>
              <div>{payment.key}</div>
              <div>{payment.value}</div>
            </div>
          ))
        }
      </div>
    </div>
  </Col>
);

Payments.propTypes = {
  payments: PropTypes.array,
  width: PropTypes.number,
};

export default Payments;
