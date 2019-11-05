import React from 'react';
import { Form } from 'semantic-ui-react';

const MultiSelect = (props) => {
  const { data, name, onChange } = props;
  return (
    <Form>
      <Form.Group grouped>
        {
        data.map((label) => {
          return (
            <Form.Checkbox
              label={label}
              onChange={onChange}
              name={name}
              value={label}
            />);
        })
      }
      </Form.Group>
    </Form>
  );
};

export default MultiSelect;
