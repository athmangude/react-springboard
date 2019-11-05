/* eslint-disable object-curly-newline */
// eslint-disable-next-line jsx-a11y/href-no-hash
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

function getTableCountText(checkedItems, totalCount, currentPage, limit, offset) {
  if (totalCount === 0) {
    return (
      <span>No Customers</span>
    );
  }

  if (checkedItems.length) {
    return (
      <span>
            Selected&nbsp;
        {checkedItems.length}
        {' '}
            of&nbsp;
        {numeral(totalCount).format('0,0')}
        {' '}
            Customers&nbsp;
      </span>
    );
  }

  return (
    <span>
    Showing&nbsp;
      { currentPage === 1 ? '1' : parseInt(offset, 10) + 1 }
    &nbsp;-&nbsp;
      {parseInt(limit, 10) + parseInt(offset, 10)}
    &nbsp;
    of&nbsp;
      {numeral(totalCount).format('0,0')}
      {' '}
    Customers
    </span>
  );
}

const TableCount = ({ isLoadingCustomers, isPaginating, checkedItems, totalCount, currentPage, limit, offset }) => (
  <div
    style={{
      flexDirection: 'row', justifyContent: 'flex-start', display: 'flex', alignItems: 'center',
    }}
  >
    {
      isLoadingCustomers ? (
        <ReactPlaceholder
          showLoadingAnimation
          customPlaceholder={<div style={{ width: '100%', marginBottom: 5 }}><RectShape color="#d9d9d9" style={{ height: 25, width: 200 }} /></div>}
        />
      ) : (
        <div>
          { getTableCountText(checkedItems, totalCount, currentPage, limit, offset)}
          {
            (isPaginating) ? (<div style={{ marginLeft: 10 }}><Spinner spinnerColor="#002366" size={20} spinnerWidth={2} /></div>) : null
          }
        </div>
      )
    }

  </div>
);

TableCount.propTypes = {
  isPaginating: PropTypes.bool,
  isLoadingCustomers: PropTypes.bool,
  checkedItems: PropTypes.array,
  totalCount: PropTypes.number,
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  offset: PropTypes.number,
};

export default TableCount;
