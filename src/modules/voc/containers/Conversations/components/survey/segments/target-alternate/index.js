/* eslint-disable jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-semantic-ui-react';
import { addValidationRule } from 'formsy-react';
import { Label } from 'semantic-ui-react';
import './target.css';

addValidationRule('isIncentiveANegativeNumber', (values, value) => {
  // check if number is negative
  if (value < 0) return false;
  return true;
});

const TargetSegment = (props) => {
  return (
    <div className="target-segment" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', margin: '10px 0' }}>
      {/* {
        !props.showMoreTargetOptions ? (
          <div role="button" onClick={() => props.onShowMoreTargetOptionsChanged(true)} className="view-more-target-options" style={{ position: 'absolute', right: 0, top: 20, width: 30, height: 30, borderRadius: 15, border: 'solid 2px #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="material-icons" style={{ color: '#d9d9d9', margin: 0 }}>more_horiz</i>
          </div>
        ) : (
          <div role="button" onClick={() => props.onShowMoreTargetOptionsChanged(false)} className="view-more-target-options" style={{ position: 'absolute', right: 0, top: 20, width: 30, height: 30, borderRadius: 15, border: 'solid 2px #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="material-icons" style={{ color: '#d9d9d9', margin: 0 }}>close</i>
          </div>
        )
      } */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 50px)', position: 'relative', margin: '10px 0', border: 'solid 1px #d9d9d9' }}>
        {
          props.showMaxRespondents ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
              <Input
                name="maxRespondents"
                label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px' }}><span>Max. Respondents</span></div>)}
                placeholder="maximum number of respondents"
                validations={{ isExisty: true, isNumeric: true }}
                required
                value={props.form.maxRespondents}
                onChange={props.onChange}
                validationErrors={{ isExisty: 'max respondents is required', isNumeric: 'max respondents must be a number' }}
                style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
                // errorLabel={(
                //   <Label color="red" style={{ position: 'absolute', bottom: -26, left: -1, borderRadius: 0 }} />
                // )}
              />
            </div>
          ) : null
        }
        {
          props.showTarget ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
              <Input
                name="target"
                label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px' }}><span>Target</span></div>)}
                placeholder="respondents to be contacted per sendout"
                validations={{ isExisty: true, isNumeric: true }}
                required
                value={props.form.target}
                onChange={props.onChange}
                validationErrors={{ isExisty: 'target is required', isNumeric: 'target must be a number' }}
                style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
                // errorLabel={(
                //   <Label color="red" pointing />
                // )}
              />
            </div>
          ) : null
        }
        {
          props.showMoreTargetOptions && props.showIncentive ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
              <Input
                name="defaultIncentiveAmount"
                label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px' }}><span>Incentive</span></div>)}
                placeholder="incentive"
                validations={{ isNumeric: true, isIncentiveANegativeNumber: 'defaultIncentiveAmount' }}
                value={props.form.defaultIncentiveAmount}
                onChange={props.onChange}
                validationErrors={{ 
                  isExisty: 'incentive is required',
                  isNumeric: 'incentive must be a minimum number of 0',
                  isDefaultRequiredValue: 'incentive must be a minimum number of 0',
                  isIncentiveANegativeNumber: 'incentive must be a minimum number of 0',
                }}
                style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -26, left: -1, borderRadius: 0 }} />
                )}
              />
            </div>
          ) : null
        }
        {
          props.showMoreTargetOptions && props.showJoinCode ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
              <Input
                name="joincode"
                label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px' }}><span>Join Code</span></div>)}
                placeholder="(optional) custom join code"
                validations={{ isAlphanumeric: true, minLength: 4, maxLength: 10 }}
                value={props.form.joincode}
                onChange={props.onChange}
                validationErrors={{ isAlphanumeric: 'join code must be a alphanumeric', minLength: 'too short', maxLength: 'too long' }}
                style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -26, left: -1, borderRadius: 0 }} />
                )}
              />
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

TargetSegment.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TargetSegment;
