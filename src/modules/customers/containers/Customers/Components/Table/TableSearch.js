/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line jsx-a11y/href-no-hash
import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

const TableSearch = (props) => (
  <div style={{ width: '100%', position: 'relative', boxShadow: 'none' }}>
    <div style={{ width: '100%', display: 'flex' }}>
      <input
        type="search"
        value={props.searchTerm}
        placeholder="Search customers"
        style={{
          width: '100%', height: 50, backgroundColor: '#e8eaed', borderRadius: 25, outline: 'none', padding: '0 50px 0 20px', fontSize: 15, textAlign: 'left',
        }}
        onChange={props.onSearchTermChange}
      />
      {
        props.isSearchingCustomers ? (
          <div
            style={{
              position: 'absolute', top: 10, bottom: 0, right: 10,
            }}
          >
            <Spinner spinnerColor="#808285" size={30} spinnerWidth={3} />
          </div>
        ) : props.searchTerm.length ? (
          <div
            role="button"
            tabIndex={0}
            onClick={props.onCancelSearch}
            style={{
              position: 'absolute', top: 5, bottom: 0, right: 5,
            }}
          >
            <i className="material-icons" style={{ color: '#808285', fontSize: 40, cursor: 'pointer' }}>cancel</i>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute', top: 5, bottom: 0, right: 5,
            }}
          >
            <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 40 }}>search</i>
          </div>
        )
      }
    </div>
  </div>
);


TableSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
  isSearchingCustomers: PropTypes.bool.isRequired,
  onCancelSearch: PropTypes.func.isRequired,
};

export default TableSearch;
