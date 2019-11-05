import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-semantic-ui-react';
import { Label } from 'semantic-ui-react';

import './title.css';

const TitleSegment = (props) => (
  <div className="title-segment" style={{ width: '100%', display: 'flex', flexDirection: 'column', margin: '20px 0', border: 'solid 2px #d9d9d9' }}>
    <Input
      label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px' }}><span>Title</span></div>)}
      name="title"
      placeholder="Enter your survey title"
      validations={{ minLength: 1, isExisty: true }}
      required
      value={props.form.title}
      onChange={props.onChange}
      validationErrors={{ minLength: 'title is Required', isExisty: 'title is required' }}
      style={{ width: '100%', height: 50, border: 'none', outline: 'none' }}
      // errorLabel={(
      //   <Label color="red" pointing />
      // )}
    />
  </div>
);

TitleSegment.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TitleSegment;
