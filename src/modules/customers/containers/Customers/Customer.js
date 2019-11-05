/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import Spinner from 'react-spinner-material';
import styled from 'styled-components';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';
import EnhancedTableHead from './Components/Table/EnhancedTableHead';
import ActionButton from 'SharedComponents/action-button-styled';
import TableStyles from './Components/Table/TableStyles';
import ErrorState from 'SharedComponents/mwamba-error-state';
const noData = require('Images/no_data.png');

const TableWrapper = styled.div`${TableStyles}`;

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    fontSize: 14,
    fontFamily: [
      'Lato', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif',
    ].join(','),
  },
  table: {
    minWidth: 700,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  tableRow: {
    height: 60,
    cursor: 'pointer',
  },
  tableCell: {
    fontSize: 14,
  },
  tableHeadCell: {
    fontSize: 14,
  },
  columnSticky: {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
});

class Customer extends Component {
  static propTypes = {
    onCheck: PropTypes.func,
    checked: PropTypes.bool,
    onView: PropTypes.func,
    page: PropTypes.string,
    onPaginationNextPageChange: PropTypes.func,
    customers: PropTypes.array,
    columns: PropTypes.array,
    limit: PropTypes.string,
    isLoadingCustomers: PropTypes.bool,
    isPaginating: PropTypes.bool,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
    onSortCustomers: PropTypes.func,
    withActions: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      checked: [],
    };

    this.onView = this.onView.bind(this);
    this.onCheckBoxChanged = this.onCheckBoxChanged.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
  }

  onView(participant) {
    const { onView } = this.props;
    onView(participant);
  }

  onCheckBoxChanged(customer) {
    const { onCheck } = this.props;
    const { checked } = this.state;

    const index = checked.findIndex((item) => item.participantId === customer.participantId);

    if (index !== -1) {
      checked.splice(index, 1);
    } else {
      checked.push(customer);
    }
    onCheck(checked);
    // this.setState({ checked }, () => onCheck(checked));
  }

  onSelectAll() {
    const { customers, onCheck } = this.props;
    const { checked } = this.state;

    const items = [];

    if (checked.length === 0 || (checked.length > 0 && checked.length < customers.items.length)) {
      customers.items.map((customer) => items.push(customer));
      this.setState({ checked: items }, () => onCheck(items));
    } else {
      this.setState({ checked: [] }, () => onCheck([]));
    }
  }

  onPaginationNextPageChange(event, page) {
    const { onPaginationNextPageChange } = this.props;

    onPaginationNextPageChange(page);
  }

  handleRequestSort = (event, property) => {
    const { onSortCustomers, sortBy, sortOrder } = this.props;

    const orderBy = property;

    let order = 'desc';

    if (sortBy === property && sortOrder === 'desc') {
      order = 'asc';
    }

    onSortCustomers(orderBy, order);
  };

  isSelected(value) {
    const { checked } = this.state;

    const index = checked.findIndex((item) => item.participantId === value);

    if (index !== -1) {
      return true;
    }

    return false;
  }

  render() {
    const {
      columns, customers, classes, limit, page, isLoadingCustomers, isPaginating, withActions, sortBy, sortOrder,
    } = this.props;
    const { checked } = this.state;
    
    return (
      <div style={{ marginRight: 10 }}>
        <div className={classes.tableWrapper}>
          {
            (isLoadingCustomers) ? (
              <Table className={classes.table}>
                <EnhancedTableHead
                  numSelected={checked.length}
                  order={sortOrder}
                  orderBy={sortBy}
                  onSelectAllClick={this.onSelectAll}
                  onRequestSort={this.handleRequestSort}
                  rowCount={customers.items.length}
                  rows={columns.filter((value) => value.show)}
                  withActions={withActions}
                />
                <TableBody>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                      <TableRow
                        hover
                        key={index}
                        className={classes.tableRow}
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <TableCell padding="checkbox" className={classes.columnSticky} style={{ backgroundColor: '#fff' }}>
                          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 20 }} /></div>} />
                        </TableCell>
                        {
                          columns.filter((value) => value.show).map((value) => (
                            (value.dataKey === 'name') ? (
                              <TableCell component="th" scope="row" className={classes.tableCell} style={{ backgroundColor: '#fff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RoundShape color="#d9d9d9" style={{ height: 40, width: 40 }} /></div>} />
                                  <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 5 }}><RectShape color="#d9d9d9" style={{ height: 25, width: 120 }} /></div>} />
                                </div>
                              </TableCell>
                            ) : (
                              <TableCell className={classes.tableCell} style={{ backgroundColor: '#fff' }}>
                                <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 5 }}><RectShape color="#d9d9d9" style={{ height: 25, width: 120 }} /></div>} />
                              </TableCell>
                            )
                          ))
                        }
                      </TableRow>
                    ))
                  }
                  </TableBody>
                </Table>
            ) : (customers.items.length) ? (
              <Table className={classes.table}>
                <EnhancedTableHead
                  numSelected={checked.length}
                  order={sortOrder}
                  orderBy={sortBy}
                  onSelectAllClick={this.onSelectAll}
                  onRequestSort={this.handleRequestSort}
                  rowCount={customers.items.length}
                  rows={columns.filter((value) => value.show)}
                  withActions={withActions}
                />
                <TableBody>
                  {
                    customers.items.map((row) => {
                      const isSelected = this.isSelected(row.participantId);
                      return (
                        <TableRow
                          hover
                          key={row.participantId}
                          className={classes.tableRow}
                          selected={isSelected}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <TableCell padding="checkbox" className={classes.columnSticky} style={{ backgroundColor: isSelected ? '#e8eaed' : '#fff' }}>
                            <Checkbox
                              disableTouchRipple
                              checked={isSelected}
                              onChange={() => this.onCheckBoxChanged(row)}
                              style={{ color: '#888888', textTransform: 'capitalize', backgroundColor: 'transparent' }}
                            />
                          </TableCell>
                          {
                            columns.filter((value) => value.show).map((value) => (
                              (value.dataKey === 'name') ? (
                                <TableCell onClick={() => this.onView(row)} component="th" scope="row" className={classes.tableCell} style={{ backgroundColor: isSelected ? '#e8eaed' : '#fff' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <div
                                      style={{
                                        margin: '0 10px', height: 40, width: 40, minWidth: 40, minHeight: 40, borderRadius: 20, backgroundColor: stringToHexColor(`${row[value.dataKey]}`).backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stringToHexColor(`${row[value.dataKey]}`).color,
                                      }}
                                    >
                                      {extractInitials(`${row[value.dataKey]}`)}
                                    </div>
                                    <span
                                      style={{
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                                      }}
                                    >
                                      {`${row[value.dataKey]}`}
                                    </span>
                                  </div>
                                </TableCell>
                              ) : (value.dataKey === 'lastTransactionTimestamp') ? (
                                <TableCell onClick={() => this.onView(row)} className={classes.tableCell} style={{ backgroundColor: isSelected ? '#e8eaed' : '#fff' }}>{moment(row[value.dataKey]).format('D-MMM-YYYY')}</TableCell>
                              ) : 
                              (<TableCell onClick={() => this.onView(row)} className={classes.tableCell} style={{ backgroundColor: isSelected ? '#e8eaed' : '#fff' }}>{row[value.dataKey]}</TableCell>)
                            ))
                          }
                          {
                            (withActions) ? (
                              <TableCell>
                                <div style={{ display: 'flex' }}>
                                  <ActionButton text="Remove" icon="close" />
                                  <ActionButton text="Add" icon="add" />
                                </div>
                              </TableCell>
                            ) : null
                          }
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            ) : (
              <ErrorState text='No customers to display' />
            )
          }
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {
            isPaginating ? <Spinner style={{ flex: 2 }} spinnerColor="#002366" size={20} spinnerWidth={2} /> : null
          }
          {
            (!isPaginating && customers.items.length) ? (
              <TablePagination
                component="tableCell"
                count={customers.totalCount}
                labelRowsPerPage=""
                rowsPerPage={limit}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.onPaginationNextPageChange}
                rowsPerPageOptions={[]}
              />              
            ) : null
          }
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(Customer);
