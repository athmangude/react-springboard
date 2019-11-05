import React from 'react';
import PropTypes from 'prop-types';
import './Gender.css';

const GenderFilter = (props) => (
  <div id="aod-report-gender-filter">
    <span style={{ fontSize: 12, color: '#3d4553' }}>Gender</span>
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div className="checkbox-container" style={{ marginRight: 60 }}>
        <input type="checkbox" id="genderMale" name="gender" value="male" checked={props.value.male} onChange={(event) => props.onChange(event.target.value, event.target.checked)} />
        <label htmlFor="genderMale"></label>Male
      </div>
      <div className="checkbox-container">
        <input type="checkbox" id="genderFemale" name="gender" value="female" checked={props.value.female} onChange={(event) => props.onChange(event.target.value, event.target.checked)} />
        <label htmlFor="genderFemale"></label>Female
      </div>
    </div>
  </div>
);

GenderFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
};

export default GenderFilter;
