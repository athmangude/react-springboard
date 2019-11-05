import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import { RoundShape, TextRow } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';

import MwambaInitialsCircle from 'Utils/mwamba-initials-circle';


const CustomerService = ({ me, account, loading }) => {
  if (loading) {
    return (
      <ReactPlaceholder
        ready={false}
        showLoadingAnimation
        customPlaceholder={(
          <div>
            <div style={{ backgroundColor: 'inherit', height: 90, display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: '10px 0', width: '100%' }}>
                <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RoundShape color="#E0E0E0" style={{ width: 50, height: 50 }} />
                </div>
                <div style={{ width: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px' }}>
                  <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                    <TextRow color="#E0E0E0" style={{ width: 60, height: 10 }} />
                  </div>
                  <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                      <TextRow color="#E0E0E0" style={{ width: 120, height: 10 }} />
                    </div>
                    <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 300, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>
                      <TextRow color="#E0E0E0" style={{ width: 60, height: 10 }} />
                    </div>
                  </div>
                  <TextRow color="#E0E0E0" style={{ width: '100%', height: 10, marginBottom: 5 }} />
                  <TextRow color="#E0E0E0" style={{ width: '100%', height: 10 }} />
                </div>
                <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}></div>
              </div>
            </div>
          </div>
        )}
      />
    );
  }

  const backgroundColor = '#20ab9c';
  let initials = '';
  const name = me.firstName.concat(' ').concat(me.lastName);
  if (name.trim()) {
    const matches = name.match(/\b(\w)/g);
    initials = matches.join('').toUpperCase();
  }

  return (
    <Link to="/settings/me">
      <div style={{ backgroundColor: 'inherit', height: 90, display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: 0, width: '100%' }}>
          <MwambaInitialsCircle initials={initials} backgroundColor={backgroundColor} />
          <div style={{ width: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px' }}>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>{name}</div>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 300, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>Customer Service</div>
            {/* <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff' }}>{account.profilename} {me.city ? `- ${me.city}` : null}</div> */}
          </div>
          <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}></div>
        </div>
      </div>
    </Link>
  );
};

CustomerService.propTypes = {
  me: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

export default CustomerService;
