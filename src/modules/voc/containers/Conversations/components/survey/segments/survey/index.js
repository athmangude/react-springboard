import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

import QuestionList from './questions/QuestionList';
import './SurveySegment.css';

const SurveySegment = (props) => {
  const { disableEdits } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: 0, width: '100%', position: 'relative' }}>
      {
        props.conversation && props.conversation.status === 'ACTIVE' ? (
          <Message color="yellow" style={{ width: '100%', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <i className="material-icons" style={{ fontSize: 20 }}>info</i>&nbsp;&nbsp;
            <span>Editing questions is disabled because your survey is already live</span>
          </Message>
        ) : null
      }
      <QuestionList
        disabled={(props.conversation && props.conversation.status === 'ACTIVE') || disableEdits || false}
        questions={props.form.questions}
        onChange={props.onChange}
        objective={props.form.objective}
        conversation={props.conversation}
      />
      {
        props.conversation && props.conversation.status === 'ACTIVE' ? (
          <div style={{ backgroundColor: 'transparent', width: '100vw', height: '100%', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        ) : null
      }
    </div>
  );
};

SurveySegment.propTypes = {
  onChange: PropTypes.func.isRequired,
  disableEdits: PropTypes.bool.isRequired,
  form: PropTypes.array.isRequired,
  conversation: PropTypes.object.isRequired,
};

export default SurveySegment;
