/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line jsx-a11y/href-no-hash
import React from 'react';
import numeral from 'numeral';
import Spinner from 'react-spinner-material';
import IconButton from 'SharedComponents/icon-button';

const TopBar = (props) => (
  <div
    style={{
      flexDirection: 'column', padding: '5px 10px 0px 10px', display: 'flex', backgroundColor: '#fff', position: 'sticky', zIndex: 2, top: 48, borderBottom: '1px solid #e0e0e0',
    }}
  >
    <div
      style={{
        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', margin: '0px 10px 0px 10px',
      }}
    >
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
                role="button" tabIndex={0} onClick={props.onCancelSearch} style={{
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
      <div
        style={{
          flexDirection: 'row', justifyContent: 'flex-start', display: 'flex', alignItems: 'center',
        }}
      >
        {props.tableBarActions}
      </div>
    </div>
    <div
      style={{
        flexDirection: 'row', alignItems: 'center', height: 30, padding: '5px 10px 5px 10px', display: 'flex', backgroundColor: (props.searchTerm === '') ? '#fff' : '#fce8e6', marginTop: 10, borderTop: '1px solid #e0e0e0',
      }}
    >
      {
        (props.searchTerm === '') ? (
          props.tableCount
        ) : (
          <span style={{ color: '#d93024' }}>
Showing results matching
            {' '}
            '{props.searchTerm}'&nbsp;
            from all customers
          </span>
        )
      }
    </div>
  </div>
);

export default TopBar;
