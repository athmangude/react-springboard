/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

import ActionButton from 'SharedComponents/action-button-styled';
import TabMenu from 'Modules/administration/containers/Accounts/Account/TabMenu';
import IconButton from 'SharedComponents/icon-button';
import ValidCSVTemplate from 'SharedComponents/valid-csv-template';
import MwambaErrorMessageList from 'Utils/mwamba-error-message-list';
import ValidationTable from 'SharedComponents/ValidationTable';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';
import * as businessNumberActions from '../flux/actions';
import './index.css';
import SearchSurvey from 'SharedComponents/Search-Surveys';

const tabs = [{ label: 'TextArea' }, { label: 'CSV File' }];

const columnNameOptions = [
  // { key: null, label: 'Select Column Name', value: null, mapsTo: null, disabled: false, error: null },
  { key: 'store', label: 'Store', value: 'store', mapsTo: null, disabled: false, example: ' 12456', error: 'Unmapped store column' },
  { key: 'location', label: 'Location', value: 'location', mapsTo: null, disabled: false, example: 'Nairobi', error: 'Unmapped location column' },
];

@connect((state) => ({
  authentication: state.authentication,
  conversations: state.conversations,
}),
(dispatch) => ({
  businessNumberActions: bindActionCreators(businessNumberActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
export default class BusinessNumberUpload extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    EventHandler: PropTypes.func,
    alertActions: PropTypes.func,
    businessNumberActions: PropTypes.func,
    authentication: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.onResetHeader = this.onResetHeader.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onMapColumnName = this.onMapColumnName.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.state = {
      file: null,
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      missingColumnHeaders: false,
      formErrors: [],
      newBusinessNumber: {
        surveyId: null,
      },
      textAreaInput: '',
      selectedTab: 'TextArea',
      preview: 10,
    };
  }

  onResetHeader(columnHeader) {
    const { EventHandler } = this.props;
    const { headerOptions } = this.state;
    const newHeaderOptions = headerOptions;
    const headerIdx = headerOptions.findIndex((header) => header.mapsTo === columnHeader);
    const header = headerOptions[headerIdx];
    newHeaderOptions[headerIdx] = { ...header, disabled: false, mapsTo: null };
    this.setState({ headerOptions: newHeaderOptions });
    EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'reset column headers', value: columnHeader });
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab, file: null, data: [], fileHeaders: [], headerOptions: JSON.parse(JSON.stringify(columnNameOptions)), missingColumnHeaders: false, formErrors: [], textAreaInput: '' });
  }

  onMapColumnName(option, customParamters) {
    const { EventHandler } = this.props;
    if (!option && !option.value) { return; }
    const key = option.value;
    const val = customParamters.id;
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
    EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'map column names', value: customParamters.id });
  }

  onDrop(files) {
    const { EventHandler } = this.props;
    const { preview } = this.state;

    this.setState({
      file: files[0],
      textAreaInput: '',
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      formErrors: [],
      missingColumnHeaders: false,
    }, () => {
      const { file } = this.state;
      Papa.parse(file, {
        download: true,
        preview,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { data, fileHeaders } = this.state;
          
          if (!fileHeaders.length) {
            results.meta.fields.forEach((header) => {
              fileHeaders.push({ name: header, editing: true });
            });
          }
          results.data.forEach((row) => {
            if(typeof row === "object" && !Array.isArray(row) && row !== null) {
              data.push(row);
            }
          });

          this.setState({
            data,
            fileHeaders,
          });
        },
      });
    });
    EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'drop file', value: true });
  }

  onChange(value) {
    const name = 'surveyId';
    const { newBusinessNumber } = this.state;
    this.setState({
      newBusinessNumber: { ...newBusinessNumber, [name]: value },
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
      newBusinessNumber: {
        surveyId: null,
      },
      textAreaInput: '',
    });
  }

  async onSubmit() {
    this.setState({ submitting: true });
    const { businessNumberActions, EventHandler, alertActions } = this.props;
    const { newBusinessNumber, file, headerOptions, fileHeaders } = this.state;

    if (!file) {
      this.submitRawData();
      return;
    }

    const headerMaps = [];
    const formErrors = [];
    const { onCloseSidePanel } = this.props;
    if (!newBusinessNumber.surveyId) {
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
      const results = await businessNumberActions.uploadBusinessNumber(newBusinessNumber, file, headerMaps);
      fileHeaders.filter((header) => !header.editing).forEach((header) => this.toggleEdit(header.name));
      alertActions.addAlert({ type: 'success', message: results.data.data.Metadata.message || 'Successfully uploaded the Business Numbers List for processing' });
      EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'upload file', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'upload file', value: false });
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
    }
  }

  async submitRawData() {
    const { EventHandler, alertActions, businessNumberActions, onCloseSidePanel } = this.props;
    const { textAreaInput } = this.state;
    const data = Papa.parse(textAreaInput);
    data.data.unshift(['store', 'location']);
    const { newBusinessNumber } = this.state;
    const formErrors = [];
    if (!newBusinessNumber.surveyId) {
      formErrors.push({ key: 'surveyId', message: 'No survey has been selected' });
    }
    if (formErrors.length) {
      this.setState({ missingColumnHeaders: true, formErrors, submitting: false });
      return;
    }

    try {
      const results = await businessNumberActions.uploadRawBusinessNumber(newBusinessNumber, data.data);
      alertActions.addAlert({ type: 'success', message: results.data.data.Metadata.message || 'Successfully uploaded the Business Numbers List for processing' });
      EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'upload file', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'upload file', value: false });
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
    }
  }

  toggleEdit(columnHeader) {
    const { EventHandler } = this.props;
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
    EventHandler.trackEvent({ category: 'BusinessNumbers', action: 'toggle edit column header', value: columnHeader });
  }

  handleTabChange() {
    this.setState({
      file: null,
      textAreaInput: '',
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      formErrors: [],
      missingColumnHeaders: false,
    });
  }

  handleTextAreaChange(e) {
    this.setState({ textAreaInput: e.target.value });
  }

  render() {
    const { authentication, onCloseSidePanel } = this.props;
    const { data, file, formErrors, missingColumnHeaders, submitting, textAreaInput, fileHeaders, selectedTab, headerOptions, preview } = this.state;
    const { profilename } = authentication.user.account;

    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 5 }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Business Numbers</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            <h3>Business Number DETAILS</h3>
            <div style={{ width: '100%', margin: '10px 0' }}>
              <b>Select Survey</b>
              <SearchSurvey onSelect={this.onChange} onCancel={this.onCancel} />
            </div>
          </div>
          <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: '#ffffff', borderBottom: 'none', top: 63 }} />
          {
            selectedTab === 'CSV File' ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                  <ValidCSVTemplate columnNameOptions={columnNameOptions} profilename={profilename} />
                  <h3>BUSINESS NUMBERS UPLOAD</h3>
                  <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
                    Upload your Business Numbers
                    <Header.Subheader style={{ textAlign: 'center' }}>
                      Provide a valid Business Numbers csv file
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
                          <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your Business Numbers file here, or click to select it from your computer.</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
                            <i className="material-icons" style={{ margin: '0px 15px' }}>insert_drive_file</i>
                            <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>{file.name}</span>
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
                      <ValidationTable fileHeaders={fileHeaders} headerOptions={headerOptions} data={data} onMapColumnName={this.onMapColumnName} toggleEdit={this.toggleEdit} preview={preview} />
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
                <textarea onChange={this.handleTextAreaChange} name="textAreaInput" value={textAreaInput} style={{ backgroundColor: '#ffffff', display: 'block', width: '100%', minHeight: 150, maxHeight: 300, padding: 8, resize: 'vertical', color: 'rgb(109, 110, 113)', border: '1px solid rgba(27,31,35,0.15)', borderRadius: 3, fontFamily: 'monospace' }} />
              </div>
            )
          }
          {
            missingColumnHeaders ? (
              <MwambaErrorMessageList title="There are some errors with your submission" errors={formErrors} />
            ) : null
          }
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" large icon="file_upload" text="Submit" loading={submitting} disabled={!(file || textAreaInput) || submitting} onClick={this.onSubmit} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
