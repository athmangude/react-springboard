/* eslint-disable jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-semantic-ui-react';
import { addValidationRule } from 'formsy-react';

import { Label, Button } from 'semantic-ui-react';
import './target.css';

addValidationRule('isIncentiveANegativeNumber', (values, value) => {
  // check if number is negative
  if (value < 0) return false;
  return true;
});

const TargetSegment = (props) => (
  <div className="target-segment" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', margin: '10px 0' }}>
    {/* {
      !props.showMoreTargetOptions ? (
        <Button role="button" onClick={() => props.onShowMoreTargetOptionsChanged(true)} className="view-more-target-options button" style={{ position: 'absolute', right: 0, top: 20, width: 30, height: 30, margin: 0, padding: 0, borderRadius: 15, backgroundColor: '#f3f3f3', color: '#6d6e71', border: 'solid 2px #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="material-icons" style={{ color: '#d9d9d9', margin: 0 }}>more_horiz</i>
        </Button>
      ) : (
        <Button role="button" onClick={() => props.onShowMoreTargetOptionsChanged(false)} className="view-more-target-options button" style={{ position: 'absolute', right: 0, top: 20, width: 30, height: 30, margin: 0, padding: 0, borderRadius: 15, backgroundColor: '#f3f3f3', color: '#6d6e71', border: 'solid 2px #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="material-icons" style={{ color: '#d9d9d9', margin: 0 }}>close</i>
        </Button>
      )
    } */}
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 50px)', position: 'relative', margin: '10px 0', border: 'solid 1px #d9d9d9' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
        <Input
          name="maxRespondents"
          label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Max. Respondents</span></div>)}
          placeholder="maximum number of respondents"
          validations={{ isExisty: true, isNumeric: true }}
          required
          value={props.form.maxRespondents}
          onChange={props.onChange}
          validationErrors={{ isExisty: 'max respondents is required', isNumeric: 'max respondents must be a number' }}
          style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
        />
      </div>
      {/*
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <b style={{ margin: '20px 0 5px' }}>Target</b>
          <Input
            name="target"
            placeholder="respondents to be contacted per sendout"
            validations={{ isExisty: true, isNumeric: true }}
            required
            value={props.form.target}
            onChange={props.onChange}
            validationErrors={{ isExisty: 'target is required', isNumeric: 'target must be a number' }}
            style={{ width: '100%', position: 'relative' }}
            // errorLabel={(
            //   <Label color="red" pointing />
            // )}
          />
        </div>
        */}
      {
        (props.showMoreTargetOptions) ? (
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
            <Input
              name="defaultIncentiveAmount"
              label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Incentive</span></div>)}
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
              errorLabel={
                <Label color="red" style={{ position: 'absolute', bottom: -26, left: -1, borderRadius: 0 }} />
              }
            />
          </div>
        ) : null
      }
      {
        props.showMoreTargetOptions ? (
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
            <Input
              name="joincode"
              label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Join Code</span></div>)}
              placeholder="(optional) custom join code"
              validations={{ isAlphanumeric: true, minLength: 4, maxLength: 10 }}
              value={props.form.joincode}
              onChange={props.onChange}
              validationErrors={{ isAlphanumeric: 'join code must be a alphanumeric', minLength: 'too short', maxLength: 'too long' }}
              style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
              errorLabel={(
                <Label color="red" style={{ position: 'absolute', bottom: -26, left: -1, borderRadius: 0 }} />
              )}
              disabled={props.conversation && props.conversation.status === 'ACTIVE'}
            />
          </div>
        ) : null
      }
    </div>
  </div>
);

TargetSegment.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  showMoreTargetOptions: PropTypes.bool.isRequired,
  conversation: PropTypes.object.isRequired,
  onShowMoreTargetOptionsChanged: PropTypes.func.isRequired,
};

export default TargetSegment;
