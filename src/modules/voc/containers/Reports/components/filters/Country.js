import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const CountryFilter = (props) => (
  <div style={{ marginTop: 40 }}>
    <span style={{ fontSize: 12, color: '#3d4553' }}>Country</span>
    <Dropdown
      placeholder="Select Country"
      fluid
      search
      selection
      onChange={props.onChange}
      value={props.value}
      icon={(
        <i style={{ float: 'right', position: 'relative', top: -5, right: 7, color: '#808285' }} className="material-icons">keyboard_arrow_down</i>
      )}
      options={props.countries.map((country) => ({ key: country.id, value: country.id, flag: country.code.toLowerCase(), text: country.name }))}
    />
  </div>
);

CountryFilter.propTypes = {
  countries: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default CountryFilter;
