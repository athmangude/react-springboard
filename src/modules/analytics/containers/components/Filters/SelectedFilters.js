/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'SharedComponents/icon-button';

function sentenseCase(value) {
  const newWord = value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1').replace(/\s/g, '\u00A0');
  return newWord.charAt(0).toUpperCase() + newWord.slice(1);
}

function stringifyFilterOptions(options) {
  return options.join(' ').replace(/\s/g, '\u00A0');
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
        &nbsp;
        <strong>and</strong>
        &nbsp;
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

const SelectedFilters = ({ filters, onRemoveFromFilter }) => (
  <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10, marginBottom: 10 }}>
    {
      filters.map((filter) => (
        <div key={filter.name} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', border: '1px solid #fce8e6', padding: '3px 0 3px 10px', margin: '5px 5px', borderRadius: 19, height: 38 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <span style={{ color: '#d93024' }}>
              {getFilter(filter)}
            </span>
          </div>
          <IconButton icon="close" small onClick={() => onRemoveFromFilter(filter)} className="material-icons" style={{ margin: '3px 5px 3px', color: '#d93024' }} />
        </div>
      ))
    }
  </div>
);

SelectedFilters.propTypes = {
  filters: PropTypes.string.isRequired,
  onRemoveFromFilter: PropTypes.func.isRequired,
};

export default SelectedFilters;
