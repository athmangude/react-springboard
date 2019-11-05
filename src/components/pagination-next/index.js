import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';

import IconButton from '../icon-button';

import themes from 'SharedComponents/themes';

const { primaryColor } = themes.light;

export default class Pagination extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onPageChange: PropTypes.func.isRequired,
    visibleItems: PropTypes.number.isRequired,
  }

  render() {
    const isFirstPage = this.props.currentPage === 0;
    const isLastPage = Math.ceil(this.props.totalItems / this.props.perPage) === this.props.currentPage + 1;
    return (
      <div style={{ height: 48, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', zIndex: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {
            this.props.totalItems ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {
                  this.props.isLoading ? (
                    <div style={{ margin: '0 10px' }}>
                      <Spinner spinnerColor={primaryColor} size={20} spinnerWidth={2} />
                    </div>
                  ) : null
                }
                <span>{((this.props.currentPage) * this.props.perPage) + 1}&nbsp;-&nbsp;{((this.props.currentPage) * this.props.perPage) + this.props.visibleItems}&nbsp;of&nbsp;{this.props.totalItems}</span>
                {
                  !isFirstPage ? (
                    <IconButton disabled={isFirstPage} onClick={() => this.props.onPageChange({ limit: this.props.perPage, offset: (this.props.currentPage - 1) * this.props.perPage })} icon="keyboard_arrow_left" style={{ margin: '0 5px 0 10px' }} />
                  ) : (
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  )
                }
                {
                  !isLastPage ? (
                    <IconButton disabled={isLastPage} onClick={() => this.props.onPageChange({ limit: this.props.perPage, offset: (this.props.currentPage + 1) * this.props.perPage })} icon="keyboard_arrow_right" style={{ margin: '0 10px 0 5px' }} />
                  ) : (
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  )
                }
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}
