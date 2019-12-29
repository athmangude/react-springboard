import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Table } from 'semantic-ui-react';
import MwambaDropDownSelect from 'SharedComponents/mwamba-dropdown-select';

const ValidationTable = ({ fileHeaders, headerOptions, data, onMapColumnName, toggleEdit, preview }) => (
  <div style={{ width: '100%', marginTop: 20 }}>
    <p>Showing {data.length > 10 ? preview : data.length} entries as a preview</p>
    <div style={{ marginTop: 20, width: '100%', overflowY: 'hidden' }}>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {
              fileHeaders.map((header) => (
                <Table.HeaderCell key={header.name}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: 130, textAlign: 'center', verticalAlign: 'middle', padding: '6px 10px', fontSize: 13, alignItems: 'center', justifyContent: 'center', minWidth: '14em' }}>
                    {header.editing ? (
                      // <Dropdown placeholder="Column Name" id={header.name} onChange={onMapColumnName} search selection options={headerOptions} />
                      <MwambaDropDownSelect 
                        style={{
                          width: '100%',
                          menu: {
                            minHeight: 100,
                            maxHeight: 130,
                            overflow: 'scroll'
                          }
                        }}
                        options={headerOptions}
                        onChange={onMapColumnName}
                        placeholder='Select Column Name'
                        customParameters={{
                          'id': header.name,
                        }}
                      />
                    ) : (
                      <button onClick={() => toggleEdit(header.name)}>Edit</button>
                    )}
                    <strong>{header.name}</strong>
                    {headerOptions.find((option) => option.mapsTo === header.name) ? (
                      <div>{header.name} &rarr; {headerOptions.find((option) => option.mapsTo === header.name).key}</div>
                    ) : (
                      <span>( unmatched column )</span>
                    )}
                  </div>
                </Table.HeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            data.map((row, index) => (
              <Table.Row key={`row-${index}`}>
                {
                  Object.values(row).map((entry, idx) => (
                    <Table.Cell key={`cell-${idx}`} style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px 10px', fontSize: 13, alignItems: 'center', justifyContent: 'center' }}>
                      {entry}
                    </Table.Cell>
                  ))
                }
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  </div>

);

ValidationTable.propTypes = {
  fileHeaders: PropTypes.array,
  headerOptions: PropTypes.array,
  data: PropTypes.array,
  onMapColumnName: PropTypes.func,
  toggleEdit: PropTypes.func,
};

export default ValidationTable;
