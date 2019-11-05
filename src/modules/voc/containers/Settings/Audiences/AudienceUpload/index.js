/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import { connect } from 'react-redux';

import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';
import ActionButton from 'SharedComponents/action-button-styled';
import TabMenu from 'Modules/administration/containers/Accounts/Account/TabMenu';
import IconButton from 'SharedComponents/icon-button';
import ValidCSVTemplate from 'SharedComponents/valid-csv-template';
import MwambaErrorMessageList from 'Utils/mwamba-error-message-list';
import ValidationTable from 'SharedComponents/ValidationTable';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-placeholder';

const tabs = [{ label: 'TextArea' }, { label: 'CSV File' }];

const columnNameOptions = [
  // { key: null, label: 'Select Column Name', value: null, mapsTo: null, disabled: false, error: null },
  { key: 'commId', label: 'Phone No.', value: 'commId', mapsTo: null, disabled: false, example: '0720000000', error: 'Unmapped phone number column' },
  { key: 'firstName', label: 'First Name', value: 'firstName', mapsTo: null, disabled: false, example: 'John' },
  { key: 'lastName', label: 'Last Name', value: 'lastName', mapsTo: null, disabled: false, example: 'Doe' },
  { key: 'email', label: 'E-Mail', value: 'email', mapsTo: null, disabled: false, example: 'john.doe@example.com' },
  { key: 'dateOfBirth', label: 'Date of Birth', value: 'dateOfBirth', mapsTo: null, disabled: false, example: '24-03-1990' },
  { key: 'gender', label: 'Gender', value: 'gender', mapsTo: null, disabled: false, example: 'Male/Female' },
  { key: 'region', label: 'Region', value: 'region', mapsTo: null, disabled: false, example: 'Kiambu' },
];

@connect((state) => ({
  account: state.account,
}), () => ({}))

export default class AudienceUpload extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object,
    audiencesActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
    user: PropTypes.object,
    audience: PropTypes.object,
    account: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { audience, user } = props;

    this.state = {
      file: null,
      data: [],
      fileHeaders: [],
      headerOptions: JSON.parse(JSON.stringify(columnNameOptions)),
      missingColumnHeaders: false,
      formErrors: [],
      newAudience: {
        name: audience ? audience.panelName : '',
        country: audience ? user.countries.find((country) => country.id === audience.countryId).code : null,
        incentive: 0,
        type: 'PANEL',
      },
      selectedTab: 'TextArea',
      textAreaInput: '',
      submitting: false,
      preview: 10,
    };

    this.onResetHeader = this.onResetHeader.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onMapColumnName = this.onMapColumnName.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeTextArea = this.onChangeTextArea.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.submitRawData = this.submitRawData.bind(this);
  }

  onResetHeader(columnHeader) {
    const { EventHandler } = this.props;
    const { headerOptions } = this.state;
    const newHeaderOptions = headerOptions;
    const headerIdx = headerOptions.findIndex((header) => header.mapsTo === columnHeader);
    const header = headerOptions[headerIdx];
    newHeaderOptions[headerIdx] = { ...header, disabled: false, mapsTo: null };
    this.setState({ headerOptions: newHeaderOptions });
    EventHandler.trackEvent({ category: 'Audiences', action: 'reset column headers', value: columnHeader });
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  onMapColumnName(option, customParamters) {
    if (!option && !option.value) { return; }
    const { EventHandler } = this.props;
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
    EventHandler.trackEvent({ category: 'Audiences', action: 'map column headers', value: customParamters.id  });
  }

  onViewAudience() {
    const { EventHandler } = this.props;
    const { router } = this.context;
    const path = '/settings/audiences';
    router.history.push(path);
    EventHandler.trackEvent({ category: 'navigation', action: 'click', value: path });
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const { EventHandler } = this.props;
    const { preview } = this.state;
    let files = [];
    if (acceptedFiles.length) {
      files = acceptedFiles;
    } else if (rejectedFiles.length) {
      if (['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(rejectedFiles[0].type)) {
        files = rejectedFiles;
      }
    }
    if (!files.length) {
      return;
    }
    this.setState({
      file: files[0],
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
    EventHandler.trackEvent({ category: 'Audiences', action: 'drop file', value: true });
  }

  onChangeCountry(event, { name, value }) {
    const { newAudience } = this.state;
    this.setState({
      newAudience: { ...newAudience, [name]: value },
    });
  }

  onChange(e) {
    const { newAudience } = this.state;
    this.setState({
      newAudience: { ...newAudience, [e.target.name]: e.target.value },
    });
  }

  onChangeTextArea(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async onSubmit() {
    this.setState({ submitting: true });
    const { alertActions, EventHandler, audiencesActions, onCloseSidePanel, audience } = this.props;

    const { newAudience: { name, country, incentive, type }, file, headerOptions, fileHeaders } = this.state;
    if (!file) {
      this.submitRawData();
      return;
    }
    const headerMaps = [];
    const formErrors = [];
    if (!name.length) {
      formErrors.push({ key: 'name', message: 'Specify a name for the audience' });
    }
    if (!country) {
      formErrors.push({ key: 'country', message: 'Specify a country for the audience' });
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
      await audiencesActions.uploadAudience({ name, country, incentive, type }, file, headerMaps, audience);
      fileHeaders.filter((header) => !header.editing).forEach((header) => this.toggleEdit(header.name));
      alertActions.addAlert({ type: 'success', message: 'Successfully uploaded audience' });
      EventHandler.trackEvent({ category: 'Audiences', action: 'upload audience', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Audiences', action: 'upload audience', value: false });
    } finally {
      this.setState({ submitting: false, formErrors: [], missingColumnHeaders: false });
    }
  }

  async submitRawData() {
    const { onCloseSidePanel, alertActions, EventHandler, audiencesActions, audience } = this.props;
    const { newAudience: { name, country, incentive, type }, textAreaInput } = this.state;
    const data = Papa.parse(textAreaInput);
    data.data.unshift(columnNameOptions.filter((option) => option.key !== null).map((option) => option.key));

    const formErrors = [];
    if (!name.length) {
      formErrors.push({ key: 'name', message: 'Specify a name for the audience' });
    }
    if (!country) {
      formErrors.push({ key: 'country', message: 'Specify a country for the audience' });
    }

    if (formErrors.length) {
      this.setState({ missingColumnHeaders: true, formErrors, submitting: false });
      return;
    }

    try {
      const results = await audiencesActions.uploadRawAudience({ name, country, incentive, type }, data.data, audience);
      alertActions.addAlert({ type: 'success', message: results.data.data.Metadata.message || 'Successfully uploaded the audience for processing' });
      EventHandler.trackEvent({ category: 'Audiences', action: 'upload file', value: true });
      onCloseSidePanel();
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Audiences', action: 'upload file', value: false });
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
    EventHandler.trackEvent({ category: 'Audiences', action: 'toggle edit column header', value: columnHeader });
  }

  render() {
    const { newAudience, data, file, textAreaInput, fileHeaders, headerOptions, submitting, formErrors, missingColumnHeaders, selectedTab, preview } = this.state;
    const { onCloseSidePanel, user, audience, account } = this.props;
    const countries = user.countries.map((country) => ({ key: country.id, value: country.code, flag: country.code.toLowerCase(), text: country.name }));

    if (!account.active) {
      return (
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add Members to Audience</h2>
            <IconButton icon="close" onClick={onCloseSidePanel} />
          </div>
          <div style={{ padding: '0 10px 0 10px' }}>
            <GenericPagePlaceholder title="Restricted Access" text="Your account is deactivated. You cannot upload a panel" />
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 2 }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add Members to Audience</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          {
            audience ? (
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: stringToHexColor(audience.panelName).backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stringToHexColor(audience.panelName).color }}>{extractInitials(audience.panelName)}</div>
                  <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{audience.panelName}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginTop: 30, width: '100%' }}>
                <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 0.5 }}>AUDIENCE DETAILS</div>
                <div style={{ fontSize: 16, letterSpacing: 0.5 }}>Enter the audience details</div>
                <div style={{ fontSize: 12, letterSpacing: 0.5 }}>This information will be used to identify the audience</div>
                <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ width: '100%', margin: 0 }}>
                    <p>Audience Name</p>
                    <input type="text" name="name" placeholder="Audience name" value={newAudience.name} onChange={this.onChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                  </div>
                </div>
                <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ width: '100%', margin: 0 }}>
                    <p>Country</p>
                    <Dropdown
                      placeholder="Select Country"
                      fluid
                      search
                      selection
                      name="country"
                      value={newAudience.country}
                      onChange={this.onChangeCountry}
                      options={countries}
                      className="hide-active-border"
                      style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', width: '100%' }}
                    />
                  </div>
                </div>
                <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ width: '100%', margin: 0 }}>
                    <p>Incentive</p>
                    <input type="number" name="incentive" placeholder="Incentive" value={newAudience.incentive} onChange={this.onChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
                  </div>
                </div>
              </div>
            )
          }
          <TabMenu tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: '#ffffff', borderBottom: 'none', top: 60 }} />
          {
            selectedTab === 'CSV File' ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                  <ValidCSVTemplate columnNameOptions={columnNameOptions} />
                  <h3>Audience UPLOAD</h3>
                  <h5>Upload your audience list</h5>
                  <div>Provide a valid CSV file</div>
                  <div style={{ width: '100%', padding: '0 20%' }}>
                    <Dropzone
                      accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onDrop={this.onDrop}
                      multiple={false}
                      style={{ border: 'dashed 2px #d9d9d9', padding: 20, width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}
                    >
                      {
                        !file ? (
                          <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your Audience file here, or click to select it from your computer.</span>
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
                <textarea onChange={this.onChangeTextArea} name="textAreaInput" value={textAreaInput} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%', backgroundColor: '#ffffff', display: 'block', minHeight: 80, maxHeight: 300, resize: 'vertical', color: 'rgb(109, 110, 113)', fontFamily: 'monospace' }} />
              </div>
            )
          }
          {
            missingColumnHeaders ? (
              <MwambaErrorMessageList title="There are some errors with your submission" errors={formErrors} />
            ) : null
          }
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0', marginBottom: 100 }}>
            <ActionButton className="primary" type="submit" large icon="file_upload" text="Submit" loading={submitting} disabled={!(file || textAreaInput) || submitting} onClick={this.onSubmit} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
