import React from 'react';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Response = (props) => {
  console.log(props);
  const { response } = props;
  let sender;

  if (response.originatedFrom === 'USER') {
    
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', border: 'solid 1px #d9d9d9', padding: 10, backgroundColor: '#fafafa', margin: '5px 0' }}>
      <div style={{ width: 80, diplay: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
        <Image src="https://men-haircutstyle.net/wp-content/uploads/2017/05/Haircuts-For-Mixed-Men-as-well-as-patty-cuts-black-mens-haircut-low-mid-skin-fade-waves-1024x977.jpg" circular style={{ width: 70, height: 70, border: 'solid 7px #33597f' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: 'calc(100% - 80px)' }}>
        <div>
          <b>Michael Moore | </b><b style={{ color: '#6d6e71' }}>mSurvey</b>
        </div>
        <span style={{ fontWeight: 600, fontSize: 11, color: '#808285' }}>{moment(response.createDate).format('MMM. Do, YYYY | hh:mm a')}</span>
        <p style={{ color: '#808285', fontSize: 11, margin: '10px 0' }}>{response.message}</p>
      </div>
    </div>
  );
};

Response.propTypes = {
  response: PropTypes.object.isRequired,
};

export default Response;
