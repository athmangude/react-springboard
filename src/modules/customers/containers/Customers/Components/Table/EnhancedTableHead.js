/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export default class EnhancedTableHead extends React.Component {
    createSortHandler = (property) => (event) => {
      this.props.onRequestSort(event, property);
    };

    render() {
      const {
        onSelectAllClick, order, orderBy, numSelected, rowCount, rows, withActions,
      } = this.props;
      return (
        <TableHead>
          <TableRow>
            <TableCell
              padding="checkbox"
              style={{
                position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1,
              }}
            >
              <Checkbox
                disableRipple
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
                style={{
                  color: '#888888', textTransform: 'capitalize',
                }}
              />
            </TableCell>
            {rows.map(
              (row) => (
                <TableCell
                  key={row.name}
                  padding={row.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy.toLowerCase() === row.name.toLowerCase() ? order : false}
                  style={{ fontSize: 14 }}
                >
                  <TableSortLabel
                    active={orderBy.toLowerCase() === row.sortField.toLowerCase()}
                    direction={order}
                    onClick={this.createSortHandler(row.sortField)}
                  >
                    {row.name}
                  </TableSortLabel>
                </TableCell>
              ),
              this,
            )}
            {
              (withActions) ? (
                <TableCell
                  key="Actions"
                  padding="default"
                  style={{ fontSize: 14 }}
                >
                Actions
                </TableCell>
              ) : null
            }
          </TableRow>
        </TableHead>
      );
    }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  rows: PropTypes.array,
  withActions: PropTypes.bool,
};
