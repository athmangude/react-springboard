import React from 'react';
import IconButton from 'SharedComponents/icon-button';

const Pagination = (props, context) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    {
      this.props.accounts.items.length ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {
            this.state.isFetchingAccounts ? (
              <div style={{ margin: '0 10px' }}>
                <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
              </div>
            ) : null
          }
          <span>{((this.props.accounts.page) * this.props.accounts.perPage) + 1} - {((this.props.accounts.page) * this.props.accounts.perPage) + this.props.accounts.items.length} of {this.props.accounts.totalCount}</span>
          {
            !isFirstPage ? (
              <IconButton disabled={isFirstPage} onClick={() => this.fetchAccounts({ limit: this.props.accounts.perPage, offset: (this.props.accounts.page - 1) * this.props.accounts.perPage })} icon="keyboard_arrow_left" style={{ margin: '0 5px 0 10px' }} />
            ) : (
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            )
          }
          {
            !isLastPage ? (
              <IconButton disabled={isLastPage} onClick={() => this.fetchAccounts({ limit: this.props.accounts.perPage, offset: (this.props.accounts.page + 1) * this.props.accounts.perPage })} icon="keyboard_arrow_right" style={{ margin: '0 10px 0 5px' }} />
            ) : (
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            )
          }
        </div>
      ) : null
    }
  </div>
);

export default Pagination;
