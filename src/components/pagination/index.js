import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import Spinner from 'react-spinner-material';
import './pagination.scss';

const Pagination = (props) => (
  <div
    className="pagination"
    style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative', margin: '10px 0 0 0',
    }}
  >
    {
      props.isLoading ? (
        <div
          style={{
            width: '100%', height: 70, backgroundColor: '#fafafa', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0,
          }}
        >
          <Spinner spinnerColor="#4a4f57" size={40} spinnerWidth={4} />
        </div>
      ) : null
    }
    <ReactPaginate
      pageCount={props.totalCount / props.itemsPerPage}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={props.onChangePage}
      nextLabel={(<i className="material-icons">chevron_right</i>)}
      previousLabel={(<i className="material-icons">chevron_left</i>)}
      initialPage={props.currentPage}
      disableInitialCallback
    />
  </div>
);

Pagination.propTypes = {
  onChangePage: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Pagination;
