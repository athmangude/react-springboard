import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Header, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

import TabMenu from 'Modules/administration/containers/Accounts/Account/TabMenu';
import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button-styled';
import ValidCSVTemplate from 'SharedComponents/valid-csv-template';
import MwambaErrorMessageList from 'Utils/mwamba-error-message-list';
import ValidationTable from 'SharedComponents/ValidationTable';
import ActivityHandler from 'Utils/ActivityHandler';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';
import * as touchpointActions from '../flux/actions';
import SearchSurveys from 'SharedComponents/Search-Surveys';

const tabs = [{ label: 'TextArea' }, { label: 'CSV File' }];

const columnNameOptions = [
  // { key: null, label: 'Select Column Name', value: null, mapsTo: null, disabled: false, error: null },
  { key: 'alternateJoincode', label: 'Join Code', value: 'alternateJoincode', mapsTo: null, disabled: false, example: '001' },
  { key: 'touchpointName', label: 'Touchpoint', value: 'touchpointName', mapsTo: null, disabled: false, example: 'Nairobi', error: 'Unmapped touchpoint column' },
  { key: 'touchpointType', label: 'Touchpoint Type', value: 'touchpointType', mapsTo: null, disabled: false, example: 'Location/Branch/Transaction Type', error: 'Unmapped touchpoint type column' },
  { key: 'touchpointTriggerType', label: 'Touchpoint Trigger Type', value: 'touchpointTriggerType', mapsTo: null, disabled: false, example: ['KOPOKOPO', 'API', 'SURVEY', 'CUSTOMER_MERCHANT_PAYMENT', 'PAYBILL', 'FTP', 'EMAIL_BODY', 'EMAIL_ATTACHMENT'].join('/'), error: 'Unmapped touchpoint trigger type column' },
  { key: 'quota', label: 'Quota', value: 'quota', mapsTo: null, disabled: false, example: '1000', error: 'Unmapped quota column' },
  { key: 'quotaType', label: 'Quota Type', value: 'quotaType', mapsTo: null, disabled: false, example: 'HOURLY/DAILY/WEEKLY/MONTHLY/ANNUALLY', error: 'Unmapped quota type column' },
  { key: 'startTime', label: 'Start Time', value: 'startTime', mapsTo: null, disabled: false, example: '12:30:00' },
  { key: 'endTime', label: 'End Time', value: 'endTime', mapsTo: null, disabled: false, example: '18:30:00' },
];

@connect((state) => ({
  authentication: state.authentication,
  conversations: state.conversations,
}),
(dispatch) => ({
  touchpointActions: bindActionCreators(touchpointActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
export default class TouchPointUpload extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    EventHandler: PropTypes.func,
    conversations: PropTypes.object,
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
    newTouchPoint: {
      surveyId: null,
    },
    selectedTab: 'TextArea',
    textAreaInput: '',
    submitting: false,
    preview: 10,
  }

  onResetHeader(columnHeader) {
    const { headerOptions } = this.state;
    const newHeaderOptions = headerOptions;
    const headerIdx = headerOptions.findIndex((header) => header.mapsTo === columnHeader);
    const header = headerOptions[headerIdx];
    newHeaderOptions[headerIdx] = { ...header, disabled: false, mapsTo: null };
    this.setState({ headerOptions: newHeaderOptions });
    this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'reset column header', value: columnHeader });
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab, file: null, data: [], fileHeaders: [], headerOptions: JSON.parse(JSON.stringify(columnNameOptions)), missingColumnHeaders: false, formErrors: [], textAreaInput: '' });
  }

  onMapColumnName(option, customParamters) {
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
    this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'map column header', value: customParamters.id });
  }

  onDrop(files) {
    const { preview } = this.state;

    this.setState({
      file: files[0],
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      missingColumnHeaders: false,
      formErrors: [],
      textAreaInput: '',
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
    this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'drop file', value: true });
  }

  onChange(value) {
    const name = "surveyId";
    this.setState({
      newTouchPoint: { ...this.state.newTouchPoint, [name]: value },
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
      newTouchPoint: {
        surveyId: null,
      },
    })
  }

  handleTextAreaChange(e) {
    this.setState({ textAreaInput: e.target.value });
  }

  async submitRawData() {
    const { onCloseSidePanel } = this.props;
    const data = Papa.parse(this.state.textAreaInput);
    data.data.unshift(columnNameOptions.filter((option) => option.key !== null).map((option) => option.key));
    const { newTouchPoint } = this.state;
    const formErrors = [];
    if (!newTouchPoint.surveyId) {
      formErrors.push({ key: 'surveyId', message: 'No survey has been selected' });
    }
    if (formErrors.length) {
      this.setState({ missingColumnHeaders: true, formErrors, submitting: false });
      return;
    }

    try {
      const results = await this.props.touchpointActions.uploadRawTouchpoint(newTouchPoint, data.data);
      this.props.alertActions.addAlert({ type: 'success', message: results.data.data.Metadata.message || 'Successfully uploaded the Touchpoint(s) for processing' });
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'upload file', value: true });
      onCloseSidePanel();
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'upload file', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
    }
  }

  async onSubmit() {
    this.setState({ submitting: true });
    const { newTouchPoint, file, headerOptions, fileHeaders } = this.state;

    if (!file) {
      this.submitRawData();
      return;
    }

    const headerMaps = [];
    const formErrors = [];
    const { onCloseSidePanel } = this.props;
    if (!newTouchPoint.surveyId) {
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
      const uploadTouchPointsResult = await this.props.touchpointActions.uploadTouchPoints(newTouchPoint, file, headerMaps);
      fileHeaders.filter((header) => !header.editing).forEach((header) => this.toggleEdit(header.name));
      if (uploadTouchPointsResult.data.data.Data.status && uploadTouchPointsResult.data.data.Data.success) {
        this.props.alertActions.addAlert({ type: 'success', message: `Successfully uploaded file for processing. UPLOADED: ${uploadTouchPointsResult.data.data.Data.success}. FAILED: ${uploadTouchPointsResult.data.data.Data.failed}.` });
        this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'upload touchpoints', value: true });
      } else {
        this.props.alertActions.addAlert({ type: 'error', message: `Successfully uploaded file for processing. UPLOADED: ${uploadTouchPointsResult.data.data.Data.success}. FAILED: ${uploadTouchPointsResult.data.data.Data.failed}.` });
        this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'upload touchpoints', value: false });
      }
      onCloseSidePanel();
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'upload touchpoints', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
      this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'submit file for upload' });
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
    this.props.EventHandler.trackEvent({ category: 'Touchpoints', action: 'toggle edit column header', value: columnHeader });
  }

  render() {
    const { data, file, fileHeaders, headerOptions, submitting, formErrors, missingColumnHeaders, textAreaInput, preview } = this.state;
    const { profilename } = this.props.authentication.user.account;
    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 5 }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Touch Points</h2>
          <IconButton icon="close" onClick={this.props.onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            <h3>Touch Point DETAILS</h3>
            <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
              Please specify the Touch Point action details
              <Header.Subheader style={{ textAlign: 'center' }}>
                This information will be used to act on the uploaded touch points.
              </Header.Subheader>
            </Header>
            <div style={{ width: '100%', margin: '10px 0' }}>
              <b>Select Survey</b>
              <SearchSurveys  onSelect={this.onChange} onCancel={this.onCancel} />
            </div>
          </div>
          <TabMenu tabs={tabs} selectedTab={this.state.selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: '#ffffff', borderBottom: 'none', top: 63 }} />
          {
            this.state.selectedTab === 'CSV File' ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                  <ValidCSVTemplate columnNameOptions={columnNameOptions} profilename={profilename} />
                  <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
                    Upload your Touch Points
                    <Header.Subheader style={{ textAlign: 'center' }}>
                      Provide a valid Touch Points csv file
                    </Header.Subheader>
                  </Header>
                  <div style={{ width: '100%', padding: '0 20%' }}>
                    <Dropzone
                      accept="text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onDrop={this.onDrop}
                      multiple={false}
                      style={{ border: 'dashed 2px #d9d9d9', padding: 20, width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}
                    >
                      {
                        !file ? (
                          <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your Touch Points file here, or click to select it from your computer.</span>
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
                    e.g. {columnNameOptions.filter((option) => option.value !== null).map((option) => option.example).join(', ')}
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
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" large icon="file_upload" text="Submit" loading={submitting} disabled={!(file || textAreaInput) || submitting} onClick={this.onSubmit} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
