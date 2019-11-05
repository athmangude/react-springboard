/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable object-curly-newline */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line jsx-a11y/href-no-hash
import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button-styled';

function sentenseCase(value) {
  const newWord = value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  return newWord.charAt(0).toUpperCase() + newWord.slice(1);
}

function stringifyFilterOptions(options) {
  const data = [];

  options.forEach((option, index) => (
    (index === 0) ? data.push(option) : data.push(`, ${option}`)
  ));

  return data;
}

function getFilter(filter) {
  if (filter.filterType === 'RANGE') {
    return (
      <span>
        <strong>
          {`${sentenseCase(filter.name)}`}
        &nbsp;between
        </strong>
      &nbsp;
        {filter.minValue}
      &nbsp;and&nbsp;
        {filter.maxValue}
      </span>
    );
  }
  return (
    <span>
      <strong>{`${sentenseCase(filter.name)}`}</strong>
      &nbsp;
      {stringifyFilterOptions(filter.options)}
    </span>
  );
}

const SelectedFilters = (props) => (
  <div
    style={{
      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, flexWrap: 'wrap',
    }}
  >
    <div style={{ width: '100%' }}>
      <span>Applied filters</span>
    </div>
    <div style={{ position: 'relative', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      {
        JSON.parse(props.filters).map((filter, index) => (
          <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fce8e6', padding: '3px 21px 0px 0px', margin: '5px 5px', borderRadius: '20px', height: '42px' }}>
            <IconButton icon="close" onClick={() => props.onRemoveFromFilter(index)} className="material-icons" style={{ margin: '0px 5px 3px', color: '#d93024' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
              <span style={{ color: '#d93024' }}>
                {getFilter(filter)}
              </span>
            </div>
          </div>
        ))
      }
      <ActionButton text="Create&nbsp;Segment" onClick={() => props.createSegment(true)} style={{ height: 42, borderRadius: 21 }} />
    </div>
  </div>
);

SelectedFilters.propTypes = {
  createSegment: PropTypes.func.isRequired,
  filters: PropTypes.string.isRequired,
  onRemoveFromFilter: PropTypes.func.isRequired,
};

export default SelectedFilters;
