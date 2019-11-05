import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

import TabMenu from 'Modules/administration/containers/Accounts/Account/TabMenu';
import IconButton from 'SharedComponents/icon-button';
import ValidCSVTemplate from 'SharedComponents/valid-csv-template';
import MwambaErrorMessageList from 'Utils/mwamba-error-message-list';
import ValidationTable from 'SharedComponents/ValidationTable';
import ActivityHandler from 'Utils/ActivityHandler';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import SearchSurveys from 'SharedComponents/Search-Surveys';

import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';
import * as dndActions from '../flux/actions';

const tabs = {
  primary: [{ label: 'Account' }, { label: 'Survey' }],
  secondary: [{ label: 'TextArea' }, { label: 'CSV File' }],
};

const columnNameOptions = [
  { key: null, text: 'Select Column Name', value: null, mapsTo: null, disabled: false, error: null },
  { key: 'commId', text: 'Phone No.', value: 'commId', mapsTo: null, disabled: false, example: '0720000000', error: 'Unmapped phone number column' },
  { key: 'comment', text: 'Reason', value: 'comment', mapsTo: null, disabled: false, example: 'Opted out', error: 'Unmapped reason column' },
];

@connect((state) => ({
  authentication: state.authentication,
  conversations: state.conversations,
}),
(dispatch) => ({
  dndActions: bindActionCreators(dndActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
export default class DNDUpload extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    EventHandler: PropTypes.func,
    onCloseSidePanel: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.onResetHeader = this.onResetHeader.bind(this);
    this.onPrimaryTabSelected = this.onPrimaryTabSelected.bind(this);
    this.onSecondaryTabSelected = this.onSecondaryTabSelected.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onMapColumnName = this.onMapColumnName.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.submitRawData = this.submitRawData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  state = {
    file: null,
    data: [],
    fileHeaders: [],
    headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
    missingColumnHeaders: false,
    formErrors: [],
    newDND: {
      surveyId: null,
      isBlacklist: true,
    },
    selectedPrimaryTab: 'Account',
    selectedSecondaryTab: 'TextArea',
    textAreaInput: '',
    submitting: false,
  }

  onResetHeader(columnHeader) {
    const { headerOptions } = this.state;
    const newHeaderOptions = headerOptions;
    const headerIdx = headerOptions.findIndex((header) => header.mapsTo === columnHeader);
    const header = headerOptions[headerIdx];
    newHeaderOptions[headerIdx] = { ...header, disabled: false, mapsTo: null };
    this.setState({ headerOptions: newHeaderOptions });
    this.props.EventHandler.trackEvent({ category: 'DND', action: 'reset column headers', value: columnHeader });
  }

  onPrimaryTabSelected(selectedPrimaryTab) {
    this.setState({ selectedPrimaryTab });
  }

  onSecondaryTabSelected(selectedSecondaryTab) {
    this.setState({ selectedSecondaryTab, file: null, data: [], fileHeaders: [], headerOptions: JSON.parse(JSON.stringify(columnNameOptions)), missingColumnHeaders: false, formErrors: [], textAreaInput: '' });
  }

  onMapColumnName(e, { id, value }) {
    if (!value) { return; }
    const key = value;
    const val = id;
    const { headerOptions } = this.state;
    const newHeaderOptions = headerOptions;

    // Unmap and Enable any option that already maps to it
    const previousHeaderIdx = headerOptions.findIndex((header) => header.mapsTo === val);
    const previousHeader = headerOptions[previousHeaderIdx];
    newHeaderOptions[previousHeaderIdx] = { ...previousHeader, mapsTo: null, disabled: false };

    // Map to it and disable it
    const headerIdx = headerOptions.findIndex((header) => header.key === key);
    const header = headerOptions[headerIdx];
    newHeaderOptions[headerIdx] = { ...header, mapsTo: val, disabled: true };

    // Turn off editing for that column
    this.toggleEdit(val);

    this.setState({ headerOptions: newHeaderOptions });
    this.props.EventHandler.trackEvent({ category: 'DND', action: 'map column headers', value: id });
  }

  onDrop(files) {
    this.setState({
      file: files[0],
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      missingColumnHeaders: false,
      formErrors: [],
      textAreaInput: '',
    }, () => {
      Papa.parse(this.state.file, {
        download: true,
        preview: 10,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: (row) => {
          const { data, fileHeaders } = this.state;
          if (!fileHeaders.length) {
            Object.keys(row.data[0]).forEach((header) => {
              fileHeaders.push({ name: header, editing: true });
            });
          }
          data.push(row.data[0]);
          this.setState({
            data,
            fileHeaders,
          });
        },
      });
    });
    this.props.EventHandler.trackEvent({ category: 'DND', action: 'drop file', value: true });
  }

  onChange(value) {
    const name = "surveyId";
    this.setState({
      newDND: { ...this.state.newDND, [name]: value },
    });
  }

  onCancel() {
    this.setState({
      file: null,
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      missingColumnHeaders: false,
      formErrors: [],
      newDND: {
        surveyId: null,
      },
    })
  }

  handleTextAreaChange(e) {
    this.setState({ textAreaInput: e.target.value });
  }

  async submitRawData() {
    const { onCloseSidePanel, alertActions, EventHandler, dndActions } = this.props;
    const data = Papa.parse(this.state.textAreaInput);
    data.data.unshift(columnNameOptions.filter((option) => option.key !== null).map((option) => option.key));
    const { newDND, selectedPrimaryTab } = this.state;

    const formErrors = [];
    if (selectedPrimaryTab === 'Survey' && !newDND.surveyId) {
      formErrors.push({ key: 'surveyId', message: 'No survey has been selected' });
    }

    if (formErrors.length) {
      this.setState({ missingColumnHeaders: true, formErrors, submitting: false });
      return;
    }

    try {
      const results = await dndActions.uploadRawDND(newDND, data.data);
      onCloseSidePanel();
      const fetchDNDListsResult = await dndActions.fetchDNDLists(true);
      dndActions.setDNDLists(fetchDNDListsResult.data.data.Response, fetchDNDListsResult.data.data.Response.length, 1);
      alertActions.addAlert({ type: 'success', message: results.data.data.Metadata.message || 'Successfully uploaded the DND(s) for processing' });
      EventHandler.trackEvent({ category: 'DND', action: 'upload file', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'DND', action: 'upload file', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
    }
  }

  async onSubmit() {
    this.setState({ submitting: true });
    const { dndActions, alertActions, EventHandler, onCloseSidePanel } = this.props;
    const { newDND, file, headerOptions, fileHeaders, selectedPrimaryTab } = this.state;

    if (!file) {
      this.submitRawData();
      return;
    }

    const headerMaps = [];
    const formErrors = [];
    if (selectedPrimaryTab === 'Survey' && !newDND.surveyId) {
      formErrors.push({ key: 'surveyId', message: 'No survey has been selected' });
    }

    headerOptions.forEach((header) => {
      if (!header.mapsTo && header.key && header.error) {
        formErrors.push({ key: header.key, message: header.error });
      }
      headerMaps.push({ key: header.key, value: header.mapsTo });
    });
    if (formErrors.length) {
      this.setState({ missingColumnHeaders: true, formErrors, submitting: false });
      return;
    }

    try {
      await dndActions.uploadDNDList(newDND, file, headerMaps);
      fileHeaders.filter((header) => !header.editing).forEach((header) => this.toggleEdit(header.name));
      onCloseSidePanel();
      const fetchDNDListsResult = await dndActions.fetchDNDLists(true);
      dndActions.setDNDLists(fetchDNDListsResult.data.data.Response, fetchDNDListsResult.data.data.Response.length, 1);
      alertActions.addAlert({ type: 'success', message: 'Successfully uploaded the DND List for processing' });
      EventHandler.trackEvent({ category: 'DND', action: 'upload DND dile', value: true });
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'DND', action: 'upload DND dile', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
      EventHandler.trackEvent({ category: 'DND', action: 'submit file for upload' });
    }
  }

  toggleEdit(columnHeader) {
    if (!columnHeader) {
      return;
    }
    const { fileHeaders } = this.state;
    const updatedFileHeaders = fileHeaders;
    const columnHeaderIdx = fileHeaders.findIndex((header) => columnHeader === header.name);
    const header = fileHeaders[columnHeaderIdx];
    updatedFileHeaders[columnHeaderIdx] = { ...header, editing: !header.editing };
    this.setState({ fileHeaders: updatedFileHeaders });

    if (!header.editing) {
      this.onResetHeader(columnHeader, !header.editing);
    }
    this.props.EventHandler.trackEvent({ category: 'DND', action: 'toggle edit of column header', value: columnHeader });
  }

  render() {
    const { data, file, fileHeaders, headerOptions, submitting, formErrors, missingColumnHeaders, textAreaInput } = this.state;
    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Blacklist Number(s)</h2>
          <IconButton icon="close" onClick={this.props.onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            <TabMenu tabs={tabs.primary} selectedTab={this.state.selectedPrimaryTab} onTabSelected={this.onPrimaryTabSelected} style={{ backgroundColor: 'inherit', borderBottom: 'none' }} />
            <h3>DND DETAILS</h3>
            <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
              Please specify the DND action details
              <Header.Subheader style={{ textAlign: 'center' }}>
                This information will be used to act on the uploaded DND list.
              </Header.Subheader>
            </Header>
            {
              this.state.selectedPrimaryTab === 'Survey' ? (
                <div style={{ width: '100%', margin: '10px 0' }}>
                  <b>Select Survey</b>
                  <SearchSurveys  onSelect={this.onChange} onCancel={this.onCancel} />
                </div>
              ) : null
            }
          </div>
          <TabMenu tabs={tabs.secondary} selectedTab={this.state.selectedSecondaryTab} onTabSelected={this.onSecondaryTabSelected} style={{ backgroundColor: 'inherit', borderBottom: 'none' }} />
          {
            this.state.selectedSecondaryTab === 'CSV File' ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                  <ValidCSVTemplate columnNameOptions={columnNameOptions} />
                  <h3>DND UPLOAD</h3>
                  <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
                    Upload your DND list
                    <Header.Subheader style={{ textAlign: 'center' }}>
                      Provide a valid DND csv file
                    </Header.Subheader>
                  </Header>
                  <div style={{ width: '100%', padding: '0 20%' }}>
                    <Dropzone
                      accept="text/csv, application/vnd.ms-excel"
                      onDrop={this.onDrop}
                      multiple={false}
                      style={{ border: 'dashed 2px #d9d9d9', padding: 20, width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}
                    >
                      {
                        !file ? (
                          <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your DND file here, or click to select it from your computer.</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
                            <i className="material-icons" style={{ margin: '0px 15px' }}>insert_drive_file</i>
                            <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>{this.state.file.name}</span>
                          </div>
                        )
                      }
                    </Dropzone>
                  </div>
                  <div>
                  </div>
                </div>
                {
                  data.length ? (
                    <div style={{ width: '100%' }}>
                      <ValidationTable fileHeaders={fileHeaders} headerOptions={headerOptions} data={data} onMapColumnName={this.onMapColumnName} toggleEdit={this.toggleEdit} />
                    </div>
                  ) : null
                }
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginTop: 30 }}>
                  <div style={{ width: '100%', color: 'rgb(109, 110, 113)', fontFamily: 'monospace', fontSize: 10 }}>
                    {columnNameOptions.filter((option) => option.value !== null).map((option) => option.text).join(', ')}
                  </div>
                  <div style={{ width: '100%', color: 'rgb(109, 110, 113)', fontFamily: 'monospace', fontSize: 10 }}>
                    e.g.&nbsp;
                    {columnNameOptions.filter((option) => option.value !== null).map((option) => option.example).join(', ')}
                  </div>
                </div>
                <textarea onChange={this.handleTextAreaChange} name="textAreaInput" value={this.state.textAreaInput} style={{ backgroundColor: '#ffffff', display: 'block', width: '100%', minHeight: 150, maxHeight: 300, padding: 8, resize: 'vertical', color: 'rgb(109, 110, 113)', border: '1px solid rgba(27,31,35,0.15)', borderRadius: 3, fontFamily: 'monospace' }} />
              </div>
            )
          }
          {
            missingColumnHeaders ? (
              <MwambaErrorMessageList title="There are some errors with your submission" errors={formErrors} />
            ) : null
          }
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '20px 0', width: '100%' }}>
            <Button loading={submitting} disabled={!(file || textAreaInput) || submitting} onClick={this.onSubmit} style={{ height: 35, borderRadius: 17.5, backgroundColor: '#487db3', marginRight: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -5 }}>
                <i className="material-icons" style={{ color: '#FFF', marginRight: 10 }}>file_upload</i>
                <span style={{ color: '#FFF', fontSize: 12 }}>Submit</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
