/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PaginationNext from 'SharedComponents/pagination-next';

export default class Pagination extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    items: PropTypes.array,
    totalCount: PropTypes.number,
    path: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const params = (new URL(document.location)).searchParams;

    this.state = {
      isLoading: false,
      currentPage: params.get('page') ? parseInt(params.get('page'), 10) : 1,
    };
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
  }

  onPaginationNextPageChange({ offset }) {
    const nextPage = (offset / 15) + 1;
    const { router } = this.context;

    this.setState({ currentPage: nextPage }, () => {
      const { history } = router;
      const { path } = this.props;
      history.push(`${path}?page=${parseInt(nextPage, 10)}`);
    });
  }

  render() {
    const { items, totalCount = 0 } = this.props;
    const { currentPage, isLoading } = this.state;
    return (
      <PaginationNext
        totalItems={totalCount}
        perPage={15}
        onPageChange={this.onPaginationNextPageChange}
        isLoading={isLoading}
        currentPage={parseInt(currentPage, 10) - 1}
        visibleItems={items.length}
      />
    );
  }
}
