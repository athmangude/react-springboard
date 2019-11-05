/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React from 'react';
import numeral from 'numeral';
import { Row, Col } from 'react-grid-system';
import PropTypes from 'prop-types';

function Overview({ overview, isLoading }) {
  return (
    <Row style={{ padding: 0, margin: 0 }}>
      {
        overview.map((record) => {
          let trending = 'trending_flat';
          let color = '#d9d9d9';
          if (record.percentage > 0) {
            trending = 'trending_up';
            color = '#2dce89';
          }
          if (record.percentage < 0) {
            trending = 'trending_down';
            color = '#f44336';
          }
          return (
            <Col xl={4} lg={4} md={6} sm={12} xs={12} key={record.name} style={{ padding: '0 10px 0 10px', borderRadius: 8 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: 'rgba(67, 70, 86, 0.1) 0 0px 10px 5px', marginBottom: 20, marginTop: 10 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', color: '#8898aa', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 10 }}>{record.name}</div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: '#525f7f', fontSize: '1.25rem' }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <span>{record.value > 999 ? numeral(record.value).format('0.0 a').replace(' ', '') : record.value}</span>
                    {
                      record.amount ? (
                        <span style={{ fontWeight: 300, fontSize: '.875rem', marginRight: '.5rem' }}>
                          KES
                          &nbsp;
                          {record.amount > 999 ? numeral(record.amount).format('0.0 a').replace(' ', '') : record.amount}
                        </span>
                      ) : null
                    }
                  </div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', color }}>
                      <i className="material-icons" style={{ fontWeight: 300, fontSize: '.875rem' }}>{trending}</i>
                      &nbsp;
                      <span style={{ fontWeight: 300, fontSize: '.875rem', marginRight: '.5rem' }}>{`${record.percentage}%`}</span>
                    </div>
                    <div style={{ color: '#525f7f', fontWeight: 300, fontSize: 10, width: '100%', textAlign: 'right' }}>Since last month</div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })
      }
    </Row>
  );
}

Overview.propTypes = {
  overview: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default Overview;
