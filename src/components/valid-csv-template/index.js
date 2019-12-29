import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ValidCSVTemplate = ({ columnNameOptions, profilename }) => (
  <div style={{ width: '100%' }}>
    <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
      CSV Template
    <Header.Subheader style={{ textAlign: 'center' }}>
      <p>See below template of a valid csv file</p>
      <p><span style={{ fontSize: 15, color: 'red' }}>*</span> Required</p>
    </Header.Subheader>
    </Header>
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {columnNameOptions.filter((column) => column.key !== null).map((column) => (
              <Table.HeaderCell>
                {column.error ? (
                  <span style={{ fontSize: 15, color: 'red' }}>*</span>
                ) : null}
                &nbsp; {column.label}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {columnNameOptions.filter((column) => column.key !== null).map((column) => (
              <Table.Cell>{column.key === 'store' || column.key === 'alternateJoincode' ? profilename.trim().concat(column.example) : column.example}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  </div>
);

ValidCSVTemplate.propTypes = {
  columnNameOptions: PropTypes.array,
  profilename: PropTypes.string,
};

export default ValidCSVTemplate;
