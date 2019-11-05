/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css';
import { Col } from 'react-grid-system';
import { Checkbox, Sidebar, Segment, Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chance from 'chance';

import ActivityHandler from 'Utils/ActivityHandler';
import * as aodReportActions from '../../AOD/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

const CheckboxTable = checkboxHOC(ReactTable);

const HeaderWrapper = styled.div`
  display: block; width: 100%;
`;

const LabelWrapper = styled.label`
  font-family: Lato; font-size: 13px; font-style: normal; font-stretch: normal; font-weight: normal; line-height: normal; letter-spacing: 0.5px; text-align: left; color: #808285 !important; overflow: hidden; position: relative; line-height: 1.2em; margin-bottom: 10px; margin-left: 10px; width: 100%; min-height: 20px;
`;

const headersNotToIncludeByDefault = [
  // 'User ID',
  'transaction id',
  'transaction timestamp',
  'survey completion',
  'age',
  'age',
  'age_group',
  'county',
  'gender',
  'name',
  'province',
  'dob',
  'name',
  'start time(gmt)',
  'time of last update(gmt)',
];

const getCheckedHeaders = (headers) => {
  const checkedHeaders = [];
  headers.forEach((header) => {
    if (!headersNotToIncludeByDefault.includes(header.Header.toLowerCase())) {
      checkedHeaders.push(header);
    }
  });
  return checkedHeaders;
};

@connect(
  (state) => ({
    authentication: state.authentication,
    aodReport: state.aodReport,
  }),
  (dispatch) => ({
    aodReportActions: bindActionCreators(aodReportActions, dispatch),
    alertActions: bindActionCreators({ addAlert }, dispatch),
    dispatch,
  })
)

class DataTable extends Component {
  constructor(props) {
    super(props);

    const { startDate, endDate, surveyId, title } = props;

    this.state = {
      visibleHeadersConfig: false,
      selection: [],
      selectAll: false,
      hidden: [],
      isFetchingDataTable: false,
      headers: [],
      data: [],
      checkedHeaders: [],
      startDate,
      endDate,
      surveyId,
      title,
    };
  }

  async componentDidMount() {
    const results = await this.fetchTableData(1, 100);
    if (results) {
      this.renderDataTable();
    }
  }

  componentWillReceiveProps(newProps) {
    const { startDate, endDate, surveyId, title } = newProps;

    if (startDate !== this.state.startDate && endDate !== this.state.endDate) {
      this.setState({
        startDate,
        endDate,
        surveyId,
        title,
      }, async () => {
        const results = await this.fetchTableData(1, 100);
        if (results) {
          this.renderDataTable();
        }
      });
    }
  }

  componentWillUnmount() {
    this.state = {};
  }

  onPageChange = (pageIndex) => {
    const { perPage, data, totalNumberOfRecords } = this.state;
    const page = pageIndex + 1;

    const sizeOfLoadedData = data.length;
    const loadedNumberOfPages = sizeOfLoadedData / perPage;
    const actualNumberOfPages = totalNumberOfRecords / perPage;

    this.fetchMoreData(loadedNumberOfPages, actualNumberOfPages, page, perPage);
  };

  onPageSizeChange = (perPage, pageIndex) => {
    this.setState(() => ({
      perPage,
    }));

    const { data, totalNumberOfRecords } = this.state;
    const page = pageIndex + 1;

    const sizeOfLoadedData = data.length;
    const loadedNumberOfPages = sizeOfLoadedData / perPage;
    const actualNumberOfPages = totalNumberOfRecords / perPage;

    this.fetchMoreData(loadedNumberOfPages, actualNumberOfPages, page, perPage);
  };

  onHeaderToggled = (e, { id }) => {
    const { headers, checkedHeaders } = this.state;
    const headerIdx = _.findIndex(headers, (header) => header.id === id);
    const thisHeader = headers[headerIdx];

    if (e.target.checked) {
      if (thisHeader.accessor === 'select') {
        checkedHeaders.splice(0, 0, thisHeader);
      } else {
        checkedHeaders.push(thisHeader);
      }
    } else {
      _.remove(checkedHeaders, (header) => header.id === id);
    }
    this.setState(() => ({
      checkedHeaders,
    }));
  };

  fetchTableData = async (page, perPage) => {
    this.props.alertActions.addAlert({
      message: 'Fetching data table results',
    });

    this.setState({
      isFetchingDataTable: true,
    });
    const { startDate, endDate, surveyId } = this.state;
    let dataTableResults = null;

    try {
      dataTableResults = await this.props.aodReportActions.fetchSurveyDataTable(
        this.props.authentication,
        surveyId,
        page,
        perPage,
        { startDate, endDate },
      );
      this.props.aodReportActions.setSurveyDataTable(
        surveyId,
        dataTableResults.data.Data
      );
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isFetchingDataTable: false,
      });
    }

    return dataTableResults;
  };

  fetchMoreData = (loadedNumberOfPages, actualNumberOfPages, page, perPage) => {
    if (loadedNumberOfPages < actualNumberOfPages) {
      const remainingPages = actualNumberOfPages - loadedNumberOfPages;
      if (remainingPages > 1) {
        // Load the next two pages
        this.fetchTableData(page, perPage);
      }
      // Load the next page
      this.fetchTableData(page, perPage);
    }
  };

  toggleHeadersConfigVisibility = () => this.setState((prevState) => ({ visibleHeadersConfig: !prevState.visibleHeadersConfig }));

  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    if (keyIndex >= 0) {
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1),
      ];
    } else {
      selection.push(key);
    }
    this.setState({ selection });
  };

  toggleAll = () => {
    const selectAll = !this.state.selectAll;
    const selection = [];
    if (selectAll) {
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      currentRecords.forEach((item) => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = (key) => this.state.selection.includes(key);

  hideSelectedRows = () => {
    const { selection, data } = this.state;
    if (!selection.length) return;
    const hidden = _.remove(data, (row) => selection.includes(row._id));

    this.setState((prevState) => ({
      selection: [],
      data,
      hidden: prevState.hidden.concat(hidden),
    }));
  }

  unhideHiddenRecords = () => {
    const { data, hidden } = this.state;

    this.setState(() => ({
      hidden: [],
      data: hidden.concat(data),
    }));
  }


  camelCase = (str) =>
    str
      .replace(/\s(.)/g, ($1) => $1.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, ($1) => $1.toLowerCase());

  renderDataTable = () => {
    const { surveyId } = this.state;
    const survey = this.props.aodReport[surveyId];

    if (Object.keys(survey).includes('datatable')) {
      const tableData = survey.datatable.objects.slice(0);
      const headers = [];
      const data = [];
      tableData.splice(0, 1)[0].forEach((header) => {
        const camelCasedHeader = this.camelCase(header);
        headers.push({
          Header: header,
          accessor: camelCasedHeader,
          id: camelCasedHeader,
        });
      });

      const chance = new Chance();

      tableData.forEach((row, rowIndex) => {
        data[rowIndex] = [];
        const _id = chance.guid();
        row.forEach((field, colIndex) => {
          const key = [headers[colIndex].accessor];
          data[rowIndex][key] = field;
        });
        data[rowIndex]['_id'] = _id;
      });

      const totalNumberOfRecords = survey.datatable.meta.totalCount;

      this.setState({
        data,
        perPage: totalNumberOfRecords > 20 ? 20 : totalNumberOfRecords,
        totalNumberOfRecords,
        headers,
        checkedHeaders: getCheckedHeaders(headers),
      });
    }
  };

  render() {
    const { toggleSelection, toggleAll, isSelected } = this;
    const { data, perPage, title, headers, checkedHeaders, selection, hidden, selectAll, visibleHeadersConfig, isFetchingDataTable } = this.state;

    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: 'checkbox',
      getTrProps: (s, r) => {
        if (r) {
          const selected = this.isSelected(r.original._id);
          return {
            style: {
              backgroundColor: selected ? 'lightgreen' : 'inherit',
              color: selected ? 'white' : 'inherit',
            },
          };
        }
        return {};
      },
    };

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <div>
          <Button.Group basic size="large">
            <Popup
              trigger={<Button onClick={this.toggleHeadersConfigVisibility}><i className="material-icons" style={{ fontSize: 20 }}>settings</i></Button>}
              content={'Header settings'}
              basic
              inverted
              hoverable
              style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
            />
            <Popup
              trigger={
                <Button disabled={selection.length < 1} onClick={this.hideSelectedRows}><i className="material-icons" style={{ fontSize: 20 }}>remove_circle_outline</i></Button>
              }
              content={'Hide selected records'}
              basic
              inverted
              hoverable
              style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
            />
            <Popup
              trigger={
                <Button disabled={hidden.length < 1} onClick={this.unhideHiddenRecords}><i className="material-icons" style={{ fontSize: 20 }}>add_circle_outline</i></Button>
              }
              content={'Show hidden records'}
              basic
              inverted
              hoverable
              style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
            />
          </Button.Group>
          <Sidebar.Pushable as={Segment}>
            <Sidebar animation="push" width="thin" visible={visibleHeadersConfig} secondary vertical style={{ padding: '10px 5px 0 5px' }}>
              {headers.map((header) => (
                <HeaderWrapper key={`title-${header.accessor}`}>
                  <Checkbox
                    checked={!!_.find(checkedHeaders, (ch) => ch.id === header.id)}
                    onChange={this.onHeaderToggled}
                    label={<LabelWrapper>{header.Header}</LabelWrapper>}
                    id={header.id}
                  />
                </HeaderWrapper>
              ))}
            </Sidebar>
            <Sidebar.Pusher>
              <Segment basic>
                <CheckboxTable
                  ref={(r) => (this.checkboxTable = r)}
                  pageSize={perPage}
                  onPageChange={(pageIndex) => this.onPageChange(pageIndex)}
                  onPageSizeChange={(pageSize, pageIndex) => this.onPageSizeChange(pageSize, pageIndex)}
                  data={data}
                  noDataText="No data to display, yet!"
                  loading={isFetchingDataTable}
                  loadingText="Loading your data. This will take a sec!"
                  columns={[{
                    Header: `${title}`,
                    columns: checkedHeaders,
                  }]}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  style={{ color: '#808285' }}
                  {...checkboxProps}
                />
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
        <br />
        <div style={{ textAlign: 'center' }}>
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
      </Col>
    );
  }
}

DataTable.propTypes = {
  fetchTableData: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  aodReport: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  surveyId: PropTypes.string,
  title: PropTypes.string,
  alertActions: PropTypes.object,
};

export default DataTable;
