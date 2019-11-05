import React from 'react';
import Switch from 'react-ios-switch';

const PoweredByMsurvey = (props) => {
  return (
    <div className="powered-by-msurvey" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', flexDirection: 'row' }}>
      <Switch className="custom-toggle" onColor="#4a4f57" onChange={props.onPoweredByMsurveyChanged} checked={props.form.poweredByMsurvey} />&nbsp;&nbsp;
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
        <span>Powered by mSurvey</span>
        {
          props.form.poweredByMsurvey ? (
            <small><b><code>Powered by mSurvey</code></b> message will be sent at the end of the message</small>
          ) : (
            <small><b><code>Powered by mSurvey</code></b> message will NOT be sent at the end of the message</small>
          )
        }
      </div>
    </div>
  )
}

export default PoweredByMsurvey;
