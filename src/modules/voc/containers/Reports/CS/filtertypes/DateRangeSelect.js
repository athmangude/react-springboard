import React from 'react';
import { Form, Label, Popup, Icon } from 'semantic-ui-react';
import moment from 'moment';
import DateRangePicker from '../../../../legacy/common/picker/DateRangePicker'

const DateRangeSelect = (props) => {
  const { dateRange, name, onChange } = props;
  return (
    <Form>
      <Form.Group grouped>
        <Popup
          trigger={
            <Label basic>
              <Icon name="calendar" />
              { moment(dateRange[0]).format('Do MMM YY')} - { moment(dateRange[1]).format('Do MMM YY')}
            </Label>
          }
          flowing
          style={{ padding: 0 }}
          hoverable
        >
          <DateRangePicker
            name={name}
            onChange={onChange}
          />
        </Popup>
      </Form.Group>
    </Form>
  );
};

export default DateRangeSelect;
