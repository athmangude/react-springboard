import React from 'react';
import { Image, Button } from 'semantic-ui-react';
import Textarea from 'react-expanding-textarea';
import { connect } from 'react-redux';

const Response = (props) => {
  const firstInitial = props.user.firstName.length ? props.user.firstName[0].toUpperCase() : '';
  const lastInitial = props.user.lastName.length ? props.user.lastName[0].toUpperCase() : '';
  return (
    <div
      style={{
        margin: '10px -10px -10px', display: 'flex', flexDirection: 'row', borderBottomRightRadius: 8, borderBottomLeftRadius: 8,
      }}
    >
      <div
        style={{
          width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 60, diplay: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 10px 10px', alignSelf: 'start',
          }}
        >
          <div
            style={{
              width: 50, height: 50, backgroundColor: '#4a4f57', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{`${firstInitial}${lastInitial}`}</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex', flexDirection: 'column', width: 'calc(100% - 160px)', padding: 0, margin: '10px 0',
          }}
        >
          <Textarea
            rows="3"
            style={{
              border: 'solid 1px #d9d9d9', padding: 15, margin: '5px 0px 10px 0px', backgroundColor: 'white', overflow: 'hidden', resize: 'none', minHeight: 60,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex', justifyContent: 'flex-end', padding: 0, width: 40, alignSelf: 'flex-end', margin: '20px 5px 30px',
          }}
        >
          <Button
            as="button"
            style={{
              borderRadius: 17, height: 30, width: 30, backgroundColor: '#4a4f57', color: '#FFF', fontSize: 12, textAlign: 'center', padding: 5, borderRadius: '50%',
            }}
          >
            <i className="material-icons" style={{ fontSize: 15 }}>send</i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect((state) => ({ user: state.authentication.user }))(Response);
